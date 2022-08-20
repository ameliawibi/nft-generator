import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import FieldArray from "../components/Fields";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Attributes({ collectionId }) {
  const [defaultValues, setDefaultValues] = useState(null);

  const { control, register, handleSubmit, errors, reset } = useForm({
    defaultValues,
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const counts = {};
    let chosenIndex = [];
    await data.attributesList.map((item, index) => {
      counts[item.trait_type] = counts[item.trait_type]
        ? counts[item.trait_type] + 1
        : 1;
      if (counts[item.trait_type] === 1) {
        chosenIndex.push(index);
      }
      return chosenIndex;
    });
    await data.attributesList.map((item, index) => {
      for (let i = 0; i < chosenIndex.length; i++) {
        if (chosenIndex[i] < index && chosenIndex[i + 1] > index) {
          item.probability = data.attributesList[chosenIndex[i]].probability;
        }
      }
      return data;
    });

    axios.post("/updatetraits", data).then((res) => {
      console.log(res);
    });
  };

  useEffect(() => {
    axios
      .get(`/collection/attribute/${collectionId}/gettraits/`)
      .then((res) => {
        setDefaultValues({ attributesList: res.data.attributesList });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  return (
    <div>
      <Button sx={{ ml: 1, my: 2 }} onClick={() => navigate(-1)}>
        ⧀ Go back to Collection
      </Button>
      {defaultValues && (
        <form>
          <FieldArray {...{ control, register, defaultValues, errors }} />
          <Button
            variant="contained"
            sx={{ ml: 2, my: 2 }}
            onClick={handleSubmit(onSubmit)}
          >
            Submit
          </Button>
        </form>
      )}
    </div>
  );
}
