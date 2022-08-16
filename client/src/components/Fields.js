import { array } from "prop-types";
import React from "react";
import { useFieldArray } from "react-hook-form";
import "./Fields.css";

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
      <ul>
        {fields.map((item, index) => {
          if (chosenIndex.includes(index)) {
            return (
              <li key={item.id}>
                <input
                  name={`attributesList[${index}].trait_type`}
                  {...register(`attributesList[${index}].trait_type`, {
                    required: true,
                  })}
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
            );
          }
        })}
        {fields.map((item, index) => {
          return (
            <li key={item.id}>
              <input
                name={`attributesList[${index}].subtrait`}
                {...register(`attributesList[${index}].subtrait`, {
                  required: true,
                })}
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
          );
        })}
      </ul>
    </>
  );
}
