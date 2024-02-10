import React from "react";
import { Controller } from "react-hook-form";
import isEqual from "lodash/isEqual";
import { NumericFormat } from "react-number-format";

import MUITextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import MUICheckbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import MUIRadioGroup from "@mui/material/RadioGroup";
import MUIAutocomplete from "@mui/material/Autocomplete";
import ListSubheader from "@mui/material/ListSubheader";

export const DynamicInput = ({ type: inputType, ...props }) => {
  switch (inputType) {
    case "text":
      return <TextField {...props} />;

    case "password":
    case "date":
    case "datetime-local":
    case "time":
    case "url":
      return <TextField type={inputType} {...props} />;
    case "number":
      return <Number {...props} />;

    case "select":
      return <Select {...props}></Select>;

    case "checkbox":
      return <Checkbox {...props} />;

    case "radio":
      return <RadioGroup row {...props} />;

    case "autocomplete":
      return <Autocomplete {...props} />;

    default:
      return (
        <div>{`The field: ${props.name} does not have an input_type`}</div>
      );
  }
};

const RadioGroup = ({
  defaultValue = "",
  name,
  control,
  rules = {},
  label,
  helperText,
  options,
  readOnly = false,
  ...props
}) => (
  <Controller
    defaultValue={defaultValue}
    name={name}
    control={control}
    rules={rules}
    render={({ field: { onChange, value, ref }, fieldState: { error } }) => {
      const handleClick = (event) => {
        const newVal = event.target.value;
        onChange(newVal === value ? "" : newVal);
      };
      return (
        <FormControl error={error != null}>
          <FormLabel>{label}</FormLabel>
          <MUIRadioGroup {...props} value={value}>
            {options.map((o) => (
              <FormControlLabel
                inputRef={ref}
                key={o?.value || o}
                onClick={handleClick}
                value={o?.value || o}
                control={<Radio />}
                label={o?.label || o}
                disabled={readOnly || o?.readOnly}
              />
            ))}
          </MUIRadioGroup>
          <FormHelperText>{error?.message || helperText}</FormHelperText>
        </FormControl>
      );
    }}
  />
);

const Checkbox = ({
  label,
  defaultValue = false,
  name,
  control,
  rules = {},
  helperText,
  readOnly = false,
  ...props
}) => (
  <Controller
    defaultValue={defaultValue}
    name={name}
    control={control}
    rules={rules}
    render={({ field: { onChange, value }, fieldState: { error } }) => (
      <FormControl error={error != null}>
        <FormControlLabel
          label={label}
          control={
            <MUICheckbox
              {...props}
              checked={value}
              onChange={readOnly ? undefined : onChange}
            />
          }
        />
        <FormHelperText>{error?.message || helperText}</FormHelperText>
      </FormControl>
    )}
  />
);

const Select = ({
  name,
  defaultValue = "",
  control,
  rules = {},
  options,
  placeholder,
  inputProps = {},
  readOnly = false,
  children,
  multiple,
  ...props
}) => (
  <Controller
    defaultValue={defaultValue ? defaultValue : multiple ? [] : ""}
    name={name}
    control={control}
    rules={rules}
    render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
      <MUITextField
        fullWidth
        select
        onChange={onChange}
        value={value ? value : multiple ? [] : ""}
        error={error != null}
        inputProps={{ ...inputProps, readOnly }}
        inputRef={ref}
        InputLabelProps={{ shrink: true }}
        SelectProps={{ multiple }}
        {...props}
      >
        {placeholder && (
          <MenuItem disabled value="">
            <em>{placeholder}</em>
          </MenuItem>
        )}
        {options.map(({ value, label, isGroup, ...rest }, index) =>
          isGroup ? (
            <ListSubheader key={label}>{label}</ListSubheader>
          ) : (
            // cant use value as key because value can be object
            // cant use label as key because can appear twice in different groups
            <MenuItem key={index} value={value} {...rest}>
              {label}
            </MenuItem>
          )
        )}
      </MUITextField>
    )}
  />
);

const TextField = ({
  name,
  defaultValue = "",
  control,
  helperText,
  rules = {},
  readOnly = false,
  inputProps = {},
  sx = {},
  ...props
}) => (
  <Controller
    defaultValue={defaultValue}
    name={name}
    control={control}
    rules={rules}
    render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
      <MUITextField
        onKeyDown={(e) => {
          if (props.multiline && e.code === "Enter") e.stopPropagation();
        }}
        onChange={
          props.type === "number"
            ? (e) => onChange(parseFloat(e.target.value))
            : onChange
        }
        value={value || defaultValue}
        error={error != null}
        helperText={
          error?.message || inputProps.maxLength > 80
            ? `${(value || defaultValue).length}/${
                inputProps.maxLength
              } remaining`
            : helperText
        }
        inputProps={{ readOnly, ...inputProps }}
        inputRef={ref}
        InputLabelProps={{ shrink: true }}
        sx={
          props.multiline
            ? {
                ...props.sx,
                textarea: { resize: "vertical" },
                ".MuiFormHelperText-root": {
                  color: "primary.main",
                  marginLeft: 3,
                },
              }
            : props.sx
        }
        autoComplete="off"
        {...props}
      />
    )}
  />
);

const Number = ({
  name,
  defaultValue = "",
  control,
  helperText,
  rules = {},
  readOnly = false,
  inputProps = {},
  ...props
}) => (
  <Controller
    defaultValue={defaultValue}
    name={name}
    control={control}
    rules={rules}
    render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
      <NumericFormat
        value={value}
        onValueChange={(values) => {
          // if you clear the number input, floatValue will be undefined,
          // and for some reason calling onChange(undefined) sets the value
          // to the defaultValue passed in
          onChange(
            typeof values.floatValue == "number" ? values.floatValue : ""
          );
        }}
        customInput={MUITextField}
        error={error != null}
        helperText={error?.message || helperText}
        inputProps={{ readOnly, ...inputProps }}
        inputRef={ref}
        autoComplete="off"
        {...props}
      />
    )}
  />
);

const Autocomplete = ({
  name,
  defaultValue,
  control,
  rules = {},
  options,
  getOptionLabel = (option) => option,
  freeSolo = false,
  multiple = false,
  helperText,
  disabled,
  readOnly,
  groupBy,
  isOptionEqualToValue,
  ...textFieldProps
}) => (
  <Controller
    defaultValue={defaultValue ? defaultValue : multiple ? [] : ""}
    name={name}
    control={control}
    rules={rules}
    render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
      <MUIAutocomplete
        value={value ? value : multiple ? [] : ""}
        onChange={(_event, newVal) => {
          onChange(newVal);
        }}
        options={options}
        isOptionEqualToValue={isOptionEqualToValue || isEqual}
        freeSolo={freeSolo}
        selectOnFocus={freeSolo}
        clearOnBlur={freeSolo}
        multiple={multiple}
        getOptionLabel={getOptionLabel}
        readOnly={readOnly}
        disabled={disabled}
        groupBy={groupBy}
        renderInput={(params) => (
          <MUITextField
            {...params}
            {...textFieldProps}
            error={error != null}
            helperText={error?.message || helperText}
            inputRef={ref}
            autoFocus
            InputLabelProps={{ shrink: true }}
          />
        )}
      />
    )}
  />
);
