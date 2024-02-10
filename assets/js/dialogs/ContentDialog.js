import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { DynamicInput } from "../kmui/rhfInputs";
import pick from "lodash/pick";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import Button from "@mui/material/Button";
import { blockFormSubmitOnEnterKey } from "../utils/sys";
import { getMutation } from "../utils/graph-ql";
import { SnackContext } from "../context/SnackContext";

export default ({
  open,
  onClose,
  mutationApi,
  queryKey,
  defaultValues,
  basePayload = {},
}) => {
  const { createSnack } = React.useContext(SnackContext);

  const dialogFields = [
    {
      name: "reportNo",
      label: "Report No",
      type: "number",
      size: "small",
      sx: { width: 120 },
      md: 4,
    },
    {
      name: "headingEng",
      label: "Heading Eng",
      type: "text",
      size: "small",
      sx: { width: 300 },
      md: 4,
    },
  ];

  const queryClient = useQueryClient();
  const {
    handleSubmit,
    control,
    formState: { isSubmitted, isValid, isDirty, dirtyFields },
    reset,
  } = useForm();

  const isAdding = mutationApi == "addReport";

  // need to update default values so dirty form state is accurate
  React.useEffect(() => {
    if (open && defaultValues != null) {
      reset(defaultValues);
    }
  }, [open]);

  const { mutate: addOrUpdateMutation } = useMutation(
    getMutation(mutationApi),
    {
      onSuccess: (_response) => {
        onClose();
        queryClient.invalidateQueries(queryKey);
        createSnack(isAdding ? "Added Report" : "Updated Report", {
          severity: "success",
        });
      },
      onError: (_error, _variables, _context) => {
        onClose();
        createSnack("Error saving changes.", { severity: "error" });
      },
    }
  );

  const { mutate: deleteMutation } = useMutation(getMutation("deleteReport"), {
    onSuccess: (_response) => {
      onClose();
      queryClient.invalidateQueries(queryKey);
      createSnack("Deleted Report", {
        severity: "success",
      });
    },
    onError: (_error, _variables, _context) => {
      onClose();
      createSnack("Error deleting report.", { severity: "error" });
    },
  });

  const addOrUpdate = (data) => {
    const payload = isAdding
      ? data
      : { ...basePayload, ...pick(data, Object.keys(dirtyFields)) };
    console.log("addOrUpdate: payload:", payload);
    return addOrUpdateMutation(payload);
  };

  return (
    <Dialog scroll="paper" fullWidth={true} maxWidth="md" open={open}>
      <DialogTitle>
        {mutationApi == "addReport" ? "Add Report" : "Update Report"}
      </DialogTitle>
      <form
        onSubmit={handleSubmit(addOrUpdate)}
        onKeyDown={blockFormSubmitOnEnterKey}
      >
        <DialogContent>
          {isSubmitted && !isValid && (
            <Typography color="error" variant="body1">
              Please fill all required fields
            </Typography>
          )}
          <Grid
            container
            sx={{ border: "2 px solid black" }}
            alignItems="center"
            spacing={5}
          >
            {dialogFields.map((f) => (
              <Grid md={f.md || 6} key={f.name}>
                <DynamicInput fullWidth size="small" {...f} control={control} />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          {!isAdding && (
            <Button
              color="secondary"
              onClick={() => {
                deleteMutation({ reportId: basePayload.id });
              }}
            >
              Delete
            </Button>
          )}
          <Button type="submit" color="primary" disabled={!isDirty}>
            {isAdding ? "Add" : "Update"}
          </Button>
          <Button color="secondary" onClick={onClose}>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
