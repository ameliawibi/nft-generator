import { useAuth } from "../hooks/useAuth";
import { useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function Login() {
  const { onLogin } = useAuth();
  const { register, handleSubmit } = useForm();

  const onError = (errors, e) => console.log(errors, e);

  return (
    <>
      <h2>Login page (Public)</h2>
      <form onSubmit={handleSubmit(onLogin, onError)}>
        <Typography id="email" sx={{ m: 2 }}>
          Email
        </Typography>
        <input {...register("email")} />
        <Typography id="email" sx={{ m: 2 }}>
          Password
        </Typography>
        <input {...register("password")} />
        <Button variant="text" component="label">
          Sign in
          <button hidden type="submit" />
        </Button>
      </form>
    </>
  );
}
