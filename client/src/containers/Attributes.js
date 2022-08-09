import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import FormInputText from "../components/FormInputText";
import FormInputSlider from "../components/FormInputSlider";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Attributes({ collectionId }) {
  const [defaultValues, setDefaultValues] = useState(null);

  const methods = useForm({
    defaultValues: defaultValues,
  });
  const { handleSubmit, control, reset } = methods;
  const onSubmit = (data) => console.log(data);

  useEffect(() => {
    axios.get(`${collectionId}/gettraits/`).then((res) => {
      setDefaultValues(res.data.attributesList[0]);
    });
  }, []);

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  return (
    <div>
      {defaultValues && (
        <form>
          <FormInputText
            name={"trait_type"}
            control={control}
            label={"trait_type"}
            defaultValues={defaultValues}
          />
          <FormInputSlider
            name={"probability"}
            control={control}
            label={"probability"}
            defaultValues={defaultValues}
          />
          <FormInputSlider
            name={"rarity"}
            control={control}
            label={"rarity"}
            defaultValues={defaultValues}
          />
          <Button onClick={handleSubmit(onSubmit)}>Submit</Button>
        </form>
      )}
    </div>
  );
}
