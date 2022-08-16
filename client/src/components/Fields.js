import React from "react";
import { useFieldArray } from "react-hook-form";
import "./Fields.css";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";

export default function Fields({ control, register, defaultValues, errors }) {
  const { fields } = useFieldArray({
    control,
    shouldUnregister: true,
    name: "attributesList",
  });

  const counts = {};
  let chosenIndex = [];
  fields.map((item, index) => {
    counts[item.trait_type] = counts[item.trait_type]
      ? counts[item.trait_type] + 1
      : 1;
    if (counts[item.trait_type] === 1) {
      chosenIndex.push(index);
    }
  });

  return (
    <>
      <Typography component="div" variant="h4" sx={{ mx: 2 }}>
        Traits Probability
      </Typography>
      <ul>
        {fields.map((item, index) => {
          if (chosenIndex.includes(index)) {
            return (
              <Box
                key={index}
                sx={{ minWidth: 275, maxWidth: 300, mx: 2, my: 4 }}
              >
                <Card variant="outlined" sx={{ p: 1 }}>
                  <li key={item.id}>
                    <input
                      name={`attributesList[${index}].trait_type`}
                      {...register(`attributesList[${index}].trait_type`, {
                        required: true,
                      })}
                      disabled
                      className="Input"
                      defaultValue={item.trait_type}
                    />
                    <input
                      id="minmax-range"
                      name={`attributesList[${index}].probability`}
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      defaultValue={item.probability}
                      className="Slider"
                      {...register(`attributesList[${index}].probability`, {
                        required: true,
                      })}
                    />
                  </li>
                </Card>
              </Box>
            );
          }
        })}
        <Typography component="div" variant="h4" sx={{ mx: 2 }}>
          Subtraits Rarity
        </Typography>
        {fields.map((item, index) => {
          return (
            <Box
              key={index}
              sx={{ minWidth: 275, maxWidth: 300, mx: 2, my: 4 }}
            >
              <Card variant="outlined" sx={{ p: 2 }}>
                <li key={item.id}>
                  <Typography component="div" variant="h5">
                    {item.trait_type}
                  </Typography>
                  <input
                    name={`attributesList[${index}].subtrait`}
                    {...register(`attributesList[${index}].subtrait`, {
                      required: true,
                    })}
                    className="Input"
                    disabled
                    defaultValue={item.subtrait}
                  />
                  <input
                    id="minmax-range"
                    name={`attributesList[${index}].rarity`}
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    defaultValue={item.rarity}
                    className="Slider"
                    {...register(`attributesList[${index}].rarity`, {
                      required: true,
                    })}
                  />
                </li>
              </Card>
            </Box>
          );
        })}
      </ul>
    </>
  );
}
