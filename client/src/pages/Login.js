import { useAuth } from "../hooks/useAuth";
import { useCollection } from "../hooks/useCollection";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import "./form.css";

export default function Login() {
  const { onLogin } = useAuth();
  const { initialize } = useCollection();

  const { register, handleSubmit } = useForm();

  const initializeOnLogin = async (data) => {
    await onLogin(data);
    initialize();
  };

  const onError = (errors, e) => console.log(errors, e);

  return (
    <>
      <h1 className="FormTitle" sx={{ m: 2 }}>
        Login
      </h1>
      <form onSubmit={handleSubmit(initializeOnLogin, onError)}>
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
