import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import Button from "@mui/material/Button";
import axios from "axios";
import "./form.css";

export default function SignUp() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const navigate = useNavigate();

  const onSignup = async (data) => {
    const response = await axios.post("/auth/signup", data);
    if (response.status === 200) {
      console.log("Sign Up success");
      navigate("/login");
    }
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
          {...register("email", {
            required: true,
          })}
        />
        {errors.email && (
          <p className="mb-6 text-xs text-red-600">This field is required</p>
        )}
        <label className="Label">Password</label>
        <input
          className="Input mb-2"
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
    </>
  );
}
