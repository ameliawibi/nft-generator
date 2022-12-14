import { useAuth } from "../hooks/useAuth";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import CustomSnackbar from "../components/CustomSnackbar";
import { useState } from "react";
import "./form.css";

export default function Login() {
  const { onLogin, message } = useAuth();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onError = (err, e) => {
    console.log(err, e);
  };

  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState(null);

  const onSubmit = (data) => {
    onLogin(data);
    message === "Successfully logged in"
      ? setSeverity("success")
      : setSeverity("error");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <h1 className="FormTitle" sx={{ m: 2 }}>
        Login
      </h1>

      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <label className="Label">Email</label>
        <input
          name="email"
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
          name="password"
          placeholder="Your password"
          className="Input mb-2"
          {...register("password", {
            required: true,
          })}
        />
        {errors.password && (
          <p className="mb-6 text-xs text-red-600">This field is required</p>
        )}
        <div>
          <Button variant="text" component="label">
            Sign in
            <button hidden type="submit" />
          </Button>
          <Link to="/signup">
            <Button variant="text" component="label">
              Sign Up Now
            </Button>
          </Link>
        </div>
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
