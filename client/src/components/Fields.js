import React from "react";
import { useFieldArray } from "react-hook-form";
import "./Fields.css";

export default function Fields({ control, register, defaultValues, errors }) {
  const { fields } = useFieldArray({
    control,
    shouldUnregister: true,
    name: "attributesList",
  });

  return (
    <>
      <ul>
        {fields.map((item, index) => {
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
                defaultValue={item.rarity}
                className="Slider"
                {...register(`attributesList[${index}].probability`, {
                  required: true,
                })}
              />
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
