import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import axios from "axios";

export default function SignUp() {
  const { register, handleSubmit } = useForm();
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
      <h2>Sign up page (Public)</h2>
      <form onSubmit={handleSubmit(onSignup, onError)}>
        <Typography id="name" sx={{ m: 2 }}>
          Name
        </Typography>
        <input {...register("name")} />
        <Typography id="email" sx={{ m: 2 }}>
          Email
        </Typography>
        <input {...register("email")} />
        <Typography id="email" sx={{ m: 2 }}>
          Password
        </Typography>
        <input {...register("password")} />
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
