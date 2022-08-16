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

  const onSubmit = (data) => {
    const counts = {};
    let chosenIndex = [];
    data.attributesList.map((item, index) => {
      counts[item.trait_type] = counts[item.trait_type]
        ? counts[item.trait_type] + 1
        : 1;
      if (counts[item.trait_type] === 1) {
        chosenIndex.push(index);
      }
    });
    data.attributesList.map((item, index) => {
      for (let i = 0; i < chosenIndex.length; i++) {
        if (chosenIndex[i] < index && chosenIndex[i + 1] > index) {
          item.probability = data.attributesList[chosenIndex[i]].probability;
        }
      }
    });
    console.log(data);
  };

  useEffect(() => {
    axios.get(`${collectionId}/gettraits/`).then((res) => {
      setDefaultValues({ attributesList: res.data.attributesList });
    });
  }, []);

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  return (
    <div>
      {defaultValues && (
        <form>
          <FieldArray {...{ control, register, defaultValues, errors }} />
          <Button onClick={handleSubmit(onSubmit)}>Submit</Button>
        </form>
      )}
    </div>
  );
}
