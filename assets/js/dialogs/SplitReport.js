import React from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
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

export default function ({
  open,
  onClose,
  report,
  defaultValues,
  dataQueryKeys = [],
}) {
  const { createSnack } = React.useContext(SnackContext);
  const { control, handleSubmit, reset } = useForm();
  const responseKeys = ["message", "status", "id"];
  const updateTextMutation = useMutation(
    getMutation("updateText", responseKeys)
  );
  const addTextMutation = useMutation(getMutation("addText", responseKeys));
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

  const splitReport = async (data) => {
    if (report.texts.length != 1)
      throw "Can't split report with zero or multiple fragments";

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
    if (engTexts.length == 1) throw "Text not divided";

    const updateTextPayload = {
      textId: defaultValues.id,
      fragmentNo: defaultValues.fragmentNo,
      textArb: arbTexts[0],
      textEng: engTexts[0],
    };
    const response = await updateTextMutation.mutateAsync(updateTextPayload);
    console.log("Update text mutation response=", response);

    var startNo = 2;
    const payloadList = [];
    for (let i = 1; i < engTexts.length; i++) {
      payloadList.push({
        reportId: report.id,
        fragmentNo: i + startNo - 1,
        textEng: engTexts[i],
        textArb: arbTexts[i],
      });
    }
    console.log("payloadList=", payloadList);
    try {
      const mutationPromises = payloadList.map((payload) =>
        addTextMutation.mutateAsync(payload)
      );
      await Promise.all(mutationPromises);

      console.log("All mutations completed successfully");
    } catch (error) {
      console.error("Error occurred during mutations:", error);
    }
    createSnack("Report split succesfully", {
      severity: "success",
    });
    closeAndReset();
  };

  return (
    <Dialog open={open} fullWidth maxWidth="md">
      <form
        onSubmit={handleSubmit(splitReport)}
        // onSubmit={handleSubmit(console.log)}
        onKeyDown={blockFormSubmitOnEnterKey}
      >
        <DialogTitle>{`Split Report ${report.reportNo}`}</DialogTitle>
        <DialogContent>
          <Stack sx={{ mt: 5 }} spacing={5}>
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
            Split Report
          </Button>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
