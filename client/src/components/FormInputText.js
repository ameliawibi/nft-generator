import TextField from "@mui/material/TextField";
import { Controller } from "react-hook-form";
import React from "react";

export default function FormInputText({ name, control, label, defaultValues }) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, textValue } }) => (
        <TextField
          onChange={onChange}
          value={textValue}
          label={label}
          defaultValue={defaultValues[name]}
        />
      )}
    />
  );
}
