import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "react-feather";
import {useNavigate } from 'react-router-dom';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const loginSchema = z.object({
  emailOrUsername: z.string(),
  password: z.string().min(5, {
    message: "Le mot de passe doit comporter au moins 5 caractères.",
  }),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrUsername: "",
      password: "",
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };


  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/authentication/login`,
        {
          emailOrUsername: data.emailOrUsername,
          password: data.password,
        },
        {
          withCredentials: true,
        }
      ); 
      if (response.data) {
        console.log(response.data.access_token)
        toast.success("Login successful!", { autoClose: 3000 });
        setTimeout(() => {
          navigate('/dash/Home');
        }, 2000);
      }
    } catch (error) {
      if (error.response) {
        toast.error("Invalid credentials");
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen p-4">
      <ToastContainer />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-sm space-y-6 bg-white p-8 rounded-md"
        >
          <h1 className="text-3xl font-bold mx-0 font-custom">
           
          </h1>

          <FormField
            control={form.control}
            name="emailOrUsername"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">Email ou Username</FormLabel>
                <FormControl>
                  <Input
                    className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
                    placeholder="Email ou Username"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">Password</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <Eye className="h-5 w-5 text-gray-600" />
                    ) : (
                      <EyeOff className="h-5 w-5 text-gray-600" />
                    )}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 ring-0 focus-visible:ring-offset-0 focus-visible:ring-0">
            Se Connecter
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Login;