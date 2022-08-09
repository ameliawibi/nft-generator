import React from "react";
import { useFieldArray } from "react-hook-form";

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
                name={`attributesList[${index}].subtrait`}
                {...register(`attributesList[${index}].subtrait`, {
                  required: true,
                })}
                defaultValue={item.subtrait}
              />
            </li>
          );
        })}
      </ul>
    </>
  );
}
