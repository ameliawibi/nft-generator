import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import Button from "@mui/material/Button";
import CustomSnackbar from "../components/CustomSnackbar";
import axios from "axios";
import { useState } from "react";
import "./form.css";

export default function SignUp() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState(null);
  const [message, setMessage] = useState(null);

  const onSignup = async (data) => {
    try {
      const response = await axios.post("/auth/signup", data);
      if (response.status === 200) {
        navigate("/login");
      }
    } catch (e) {
      setMessage(e.response.data.message);
      setOpen(true);
      setSeverity("error");
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onError = (errors, e) => console.log(errors, e);

  return (
    <>
      <h1 className="FormTitle" sx={{ m: 2 }}>
        Sign Up
      </h1>
      <form onSubmit={handleSubmit(onSignup, onError)}>
        <label className="Label">Name</label>
        <input
          name="name"
          placeholder="Your name"
          className="Input mb-2"
          {...register("name", {
            required: true,
          })}
        />
        {errors.name && (
          <p className="mb-6 text-xs text-red-600">This field is required</p>
        )}
        <label className="Label">Email</label>
        <input
          className="Input mb-2"
          placeholder="Your email"
          {...register("email", {
            required: true,
          })}
        />
        {errors.email && (
          <p className="mb-6 text-xs text-red-600">This field is required</p>
        )}
        <label className="Label">Password</label>
        <input
          type="password"
          className="Input mb-2"
          placeholder="Your password"
          {...register("password", {
            required: true,
          })}
        />
        {errors.password && (
          <p className="mb-6 text-xs text-red-600">This field is required</p>
        )}
        <Button variant="text" component="label">
          Sign up
          <button hidden type="submit" />
        </Button>
        <Link to="/login">
          <Button variant="text" component="label">
            Go to Login
          </Button>
        </Link>
      </form>
      {message && (
        <CustomSnackbar
          open={open}
          severity={severity}
          handleClose={handleClose}
          message={message}
        />
      )}
    </>
  );
}
