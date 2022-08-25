import { useAuth } from "../hooks/useAuth";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import "./form.css";

export default function Login() {
  const { onLogin } = useAuth();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onError = (err, e) => {
    console.log(err, e);
  };

  return (
    <>
      <h1 className="FormTitle" sx={{ m: 2 }}>
        Login
      </h1>

      <form onSubmit={handleSubmit(onLogin, onError)}>
        <label className="Label">Email</label>
        <input
          name="email"
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
          name="password"
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
    </>
  );
}
