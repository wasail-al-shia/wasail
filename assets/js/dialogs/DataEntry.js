import * as React from "react";
import Spinner from "../kmui/Spinner";
import { useForm } from "react-hook-form";
import { DynamicInput } from "../kmui/rhfInputs";
import { useMutation, useQueryClient } from "react-query";
import { getMutation, applyMutation } from "../utils/graph-ql";
import pick from "lodash/pick";
import { SnackContext } from "../context/SnackContext";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import uniq from "lodash/uniq";
import { blockFormSubmitOnEnterKey } from "../utils/sys";

// For now only using this dialog to update but will re use for adds
export default ({
  open,
  onClose,
  fields,
  dataQueryKeys = [],
  defaultValues,
  mutationApi,
  responseKeys = ["message", "status"],
  basePayload = {},
  title,
  btnText = "Save",
  transformPayload = (x) => x,
  deleteApi,
  deletePayload,
  watchFields = [],
  onlyDirty = true,
  alwaysInclude = [],
  allowSaveWhenNotDirty = false,
  wrapInInput = false,
  ...props
}) => {
  // console.log("fields", fields);
  const queryClient = useQueryClient();
  const { createSnack } = React.useContext(SnackContext);
  const {
    control,
    handleSubmit,
    formState: { isDirty, dirtyFields },
    reset,
    watch,
  } = useForm();

  const watchedFormData = watch(watchFields);

  // need to update default values so dirty form state is accurate
  React.useEffect(() => {
    if (open && defaultValues != null) reset(defaultValues);
  }, [open]);

  const closeAndReset = () => {
    onClose();
    reset();
    dataQueryKeys.forEach((key) => queryClient.invalidateQueries(key));
  };

  const onSuccess = (...params) => {
    props.onSuccess?.(...params);
    createSnack("Changes saved succesfully", {
      severity: "success",
    });
    closeAndReset();
  };

  const onDelete = (...params) => {
    props.onDelete?.(...params);
    createSnack("Deleted succesfully", {
      severity: "success",
    });
    closeAndReset();
  };

  const onError = () => {
    onClose();
    createSnack("Failed to save changes", { severity: "error" });
  };

  const { mutate: addOrUpdateMutation, isLoading: saving } = useMutation(
    getMutation(mutationApi, responseKeys),
    { onError, onSuccess }
  );

  const { mutate: deleteRec, isLoading: isDeleting } = useMutation(
    () => applyMutation(deleteApi, deletePayload),
    {
      onSuccess: onDelete,
      onError,
    }
  );

  const updateData = async (data) => {
    const dirtyKeys = uniq(Object.keys(dirtyFields).concat(alwaysInclude));
    // fields that are defaulted to some value in adds aren't marked as dirty but need to be sent
    const defaultedFields =
      defaultValues == null ? getDefaultedFields(fields) : [];
    console.log({ data, defaultedFields });
    const payload = {
      ...basePayload,
      ...transformPayload(
        onlyDirty ? pick(data, [...dirtyKeys, ...defaultedFields]) : data
      ),
    };
    const finalPayload = wrapInInput ? { input: payload } : payload;
    console.log("final payload", finalPayload);
    // console.log("transformed email  payload", transformEmailPayload(data));
    // return;

    return addOrUpdateMutation(finalPayload);
  };

  const getFields = (xs) =>
    xs.map(({ options, sx, children, rules, entities, ...f }) => ({
      ...f,
      options:
        typeof options == "function" ? options(watchedFormData) : options,
      sx: typeof sx == "function" ? sx(watchedFormData) : sx,
      rules: typeof rules == "function" ? rules(watchedFormData) : rules,
      children: children?.length ? getFields(children) : null,
      entities:
        typeof entities == "function" ? entities(watchedFormData) : undefined,
    }));
  const finalFields = getFields(fields);
  const processing = saving || isDeleting;

  return (
    <Dialog open={open} fullWidth maxWidth="md">
      <Spinner open={processing}>
        <form
          onSubmit={handleSubmit(updateData)}
          // onSubmit={handleSubmit(console.log)}
          onKeyDown={blockFormSubmitOnEnterKey}
        >
          <DialogTitle sx={{ padding: 3 }}>{title}</DialogTitle>
          <DialogContent sx={{ padding: 3 }}>
            <Fields fields={finalFields} control={control} />
          </DialogContent>
          <DialogActions>
            <Button
              type="submit"
              color="primary"
              disabled={
                allowSaveWhenNotDirty ? processing : processing || !isDirty
              }
            >
              {btnText}
            </Button>
            {deleteApi && (
              <Button onClick={deleteRec} color="error" disabled={processing}>
                Delete
              </Button>
            )}
            <Button onClick={onClose} color="secondary" disabled={processing}>
              Cancel
            </Button>
          </DialogActions>
        </form>
      </Spinner>
    </Dialog>
  );
};

const Fields = ({ fields, control }) => (
  <Grid container sx={{ padding: 3 }} alignItems="center" spacing={5}>
    {fields.map((f) => (
      <Grid md={f.md || 6} key={f.name}>
        <DynamicInput {...f} control={control} />
      </Grid>
    ))}
  </Grid>
);

const getDefaultedFields = (fields) =>
  fields.reduce(
    (acc, f) =>
      f.name && f.defaultValue !== null
        ? [...acc, f.name]
        : f.children?.length
        ? [...acc, ...getDefaultedFields(f.children)]
        : acc,
    []
  );
