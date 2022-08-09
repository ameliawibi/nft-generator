import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import FieldArray from "../components/Fields";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Attributes({ collectionId }) {
  const [defaultValues, setDefaultValues] = useState(null);

  const { control, register, handleSubmit, errors, reset } = useForm({
    defaultValues,
  });

  const onSubmit = (data) => console.log(data);

  useEffect(() => {
    axios.get(`${collectionId}/gettraits/`).then((res) => {
      const newArr = [];
      res.data.attributesList.map((o) => {
        delete Object.assign(o, { ["tableId"]: o["id"] })["id"];
        newArr.push(o);
        return newArr;
      });
      setDefaultValues({ attributesList: newArr });
    });
  }, []);

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  return (
    <div>
      {defaultValues && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldArray {...{ control, register, defaultValues, errors }} />
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
}
