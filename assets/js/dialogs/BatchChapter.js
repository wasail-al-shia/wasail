import React from "react";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { blockFormSubmitOnEnterKey } from "../utils/sys";
import { useForm } from "react-hook-form";
import { DynamicInput } from "../kmui/rhfInputs";
import { useMutation, useQueryClient } from "react-query";
import { getMutation } from "../utils/graph-ql";
import { SnackContext } from "../context/SnackContext";
import { flipParenthesis } from "../utils/string";
import { capitalizeFirstLetter } from "../utils/string";

export default function ({
  open,
  onClose,
  section,
  defaultValues,
  dataQueryKeys = [],
}) {
  const { createSnack } = React.useContext(SnackContext);
  const { control, handleSubmit, reset } = useForm();
  const responseKeys = ["message", "status", "id"];
  const addReportMutation = useMutation(
    getMutation("addReportFrag", responseKeys)
  );
  const addChapterMutation = useMutation(
    getMutation("addChapter", responseKeys)
  );
  const queryClient = useQueryClient();

  // need to update default values so dirty form state is accurate
  React.useEffect(() => {
    if (open && defaultValues != null) reset(defaultValues);
  }, [open]);

  const closeAndReset = () => {
    onClose();
    reset();
    dataQueryKeys.forEach((key) => queryClient.invalidateQueries(key));
  };

  const addReports = async (data) => {
    const engTexts = data.textEng
      .split(/[\r\n]+/)
      .filter((x) => x.trim().length > 0);
    const arbTexts = data.textArb
      .split(/[\r\n]+/)
      .filter((x) => x.trim().length > 0);

    console.log("ARB:");
    for (let i = 0; i < arbTexts.length; i++) {
      console.log(`arb[${i}] (${arbTexts[i].length}): ${arbTexts[i]}`);
    }
    console.log("ENG:");
    for (let i = 0; i < engTexts.length; i++) {
      console.log(`eng[${i}] (${engTexts[i].length}): ${engTexts[i]}`);
    }

    if (engTexts.length != arbTexts.length) throw "Length mismatch";

    const chapterPayload = {
      sectionId: section.id,
      chapterNo: data.chapterNo,
      nameEng: capitalizeFirstLetter(data.chapterNameEng),
      nameArb: data.chapterNameArb,
    };
    const response = await addChapterMutation.mutateAsync(chapterPayload);
    console.log("Chapter mutation response=", response);
    const chapterId = response.addChapter?.id;

    var startNo = data.startingReportNo;
    const payloadList = [];
    for (let i = 0; i < engTexts.length; i++) {
      payloadList.push({
        chapterId: chapterId,
        reportNo: i + startNo,
        review: true,
        hide: true,
        headingEng: `Hadith ${i + startNo}`,
        textEng: engTexts[i],
        textArb: flipParenthesis(arbTexts[i]),
      });
    }
    console.log("payloadList=", payloadList);

    try {
      const mutationPromises = payloadList.map((payload) =>
        addReportMutation.mutateAsync(payload)
      );
      await Promise.all(mutationPromises);

      console.log("All mutations completed successfully");
    } catch (error) {
      console.error("Error occurred during mutations:", error);
    }
    createSnack("Changes saved succesfully", {
      severity: "success",
    });
    closeAndReset();
  };

  return (
    <Dialog open={open} fullWidth maxWidth="md">
      <form
        onSubmit={handleSubmit(addReports)}
        // onSubmit={handleSubmit(console.log)}
        onKeyDown={blockFormSubmitOnEnterKey}
      >
        <DialogTitle>Batch Reports</DialogTitle>
        <DialogContent>
          <Stack sx={{ mt: 3 }} spacing={7}>
            <Stack direction="row" spacing={5}>
              <DynamicInput
                control={control}
                type="number"
                name="chapterNo"
                label="Chapter No"
                sx={{ width: 120 }}
                size="small"
                rules={{ required: true }}
              />
              <DynamicInput
                control={control}
                type="number"
                name="startingReportNo"
                label="Start With"
                sx={{ width: 120 }}
                size="small"
                rules={{ required: true }}
              />
            </Stack>
            <DynamicInput
              control={control}
              name="chapterNameEng"
              label="Chapter Name Eng"
              type="text"
              size="small"
              rules={{ required: true }}
              fullWidth={true}
            />
            <DynamicInput
              control={control}
              name="chapterNameArb"
              label="Chapter Name Arb"
              type="text"
              size="small"
              rules={{ required: true }}
              fullWidth={true}
              inputProps={{
                dir: "rtl",
                style: {
                  lineHeight: 1.5,
                  fontSize: "1.5rem",
                  fontFamily: "Noto Naskh Arabic Variable",
                },
              }}
            />
            <DynamicInput
              control={control}
              name="textArb"
              label="Text Arabic"
              type="text"
              size="small"
              inputProps={{
                dir: "rtl",
                style: {
                  lineHeight: 1.5,
                  fontSize: "1.5rem",
                  fontFamily: "Noto Naskh Arabic Variable",
                },
              }}
              fullWidth={true}
              multiline={true}
              rules={{ required: true }}
              rows={7}
            />
            <DynamicInput
              control={control}
              name="textEng"
              label="Text English"
              type="text"
              size="small"
              fullWidth={true}
              inputProps={{
                style: { fontSize: "1.0rem", fontFamily: "Overpass Variable" },
              }}
              multiline={true}
              rules={{ required: true }}
              rows={12}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button type="submit" color="primary">
            Add Reports
          </Button>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
