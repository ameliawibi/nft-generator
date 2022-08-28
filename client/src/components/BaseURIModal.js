import { useState } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useForm } from "react-hook-form";
import axios from "axios";
import Box from "@mui/material/Box";
import CustomSnackbar from "../components/CustomSnackbar";

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

export default function BaseURIModal({ open, handleClose, collectionId }) {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`/${collectionId}/replaceJSON`, data);
      if (response.status === 200) {
        setMessage(response.data.message);
        setOpenSnackbar(true);
        setSeverity("success");
      }
    } catch (e) {
      setMessage(e.response.data.message);
      setOpenSnackbar(true);
      setSeverity("error");
    }
  };

  const onError = (err, e) => console.log(err, e);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [severity, setSeverity] = useState(null);
  const [message, setMessage] = useState(null);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Replace Base URI #{collectionId}
          </Typography>
          <form onSubmit={handleSubmit(onSubmit, onError)}>
            <input
              name="baseURI"
              className="Input mb-2"
              placeholder="Your CID"
              {...register("baseURI", {
                required: true,
              })}
            />
            {errors.baseURI && (
              <p className="mb-6 text-xs text-red-600">
                This field is required
              </p>
            )}
            <Button variant="text" component="label">
              Submit
              <button hidden type="submit" />
            </Button>
          </form>
        </Box>
      </Modal>
      {message && (
        <CustomSnackbar
          open={openSnackbar}
          severity={severity}
          handleClose={handleCloseSnackbar}
          message={message}
        />
      )}
    </div>
  );
}
