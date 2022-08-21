import { useAuth } from "../hooks/useAuth";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import "./form.css";

export default function Login() {
  const { onLogin } = useAuth();

  const { register, handleSubmit } = useForm();

  const onError = (errors, e) => console.log(errors, e);

  return (
    <>
      <h1 className="FormTitle" sx={{ m: 2 }}>
        Login
      </h1>
      <form onSubmit={handleSubmit(onLogin, onError)}>
        <label className="Label">Email</label>
        <input
          className="Input mb-6"
          {...register("email", {
            required: true,
          })}
        />
        <label className="Label">Password</label>
        <input
          className="Input mb-6"
          {...register("password", {
            required: true,
          })}
        />
        <Button variant="text" component="label">
          Sign in
          <button hidden type="submit" />
        </Button>
        <Link to="/signup">
          <Button variant="text" component="label">
            Sign Up Now
          </Button>
        </Link>
      </form>
    </>
  );
}
