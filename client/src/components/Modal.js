import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useCollection } from "../hooks/useCollection";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function BasicModal({
  open,
  handleClose,
  collectionId,
  collectionName,
}) {
  const { isNFTGenerated } = useCollection();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = (data, e) => {
    axios.post(`/${collectionId}/generateNFT`, data).then((res) => {
      console.log(res);
    });

    isNFTGenerated(collectionId);
  };

  const onError = (errors, e) => console.log(errors, e);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Generate NFT #{collectionId}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Number of NFTs
            </Typography>
            <input
              name="num"
              type="number"
              className="InputModal mb-2"
              {...register("num", {
                required: true,
              })}
            />
            {errors.num && (
              <p className="mb-6 text-xs text-red-600">
                This field is required
              </p>
            )}
            <input
              hidden
              {...register("collectionName", { value: collectionName })}
            />
            <Button variant="text" component="label">
              Generate
              <button hidden type="submit" />
            </Button>
          </Box>
        </form>
      </Modal>
    </div>
  );
}
