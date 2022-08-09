import Slider from "@mui/material/Slider";
import { Controller } from "react-hook-form";

export default function FormInputSlider({
  name,
  control,
  label,
  defaultValues,
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, sliderValue } }) => (
        <Slider
          onChange={onChange}
          label={label}
          value={sliderValue}
          valueLabelDisplay="auto"
          defaultValue={Number(defaultValues[name])}
          step={0.1}
          marks
          min={0}
          max={1}
        />
      )}
    />
  );
}
