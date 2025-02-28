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
import { Eye, EyeOff, Loader } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from 'js-cookie';
import { useUserContext } from '../../../context/UserContext';

const loginSchema = z.object({
  emailOrUsername: z.string().nonempty({
    message: "L'email ou le username est requis.",
  }),
  password: z.string().min(5, {
    message: "Le mot de passe doit comporter au moins 5 caractères.",
  }),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { fetchUserData } = useUserContext();

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
    if (isLoading) return; // Prevent multiple submissions
    
    setIsLoading(true);
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
        Cookies.set('access_token', response.data.access_token, { expires: 1, secure: true, sameSite: 'None' });
        await fetchUserData();
        toast.success("Authentification réussie", { autoClose: 2000 });
        navigate('/dash/Home');
      }
    } catch (error) {
      if (error.response) {
        toast.error("Identifiants invalides");
      } else {
        toast.error("Une erreur est survenue. Veuillez réessayer.");
      }
      setIsLoading(false);
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
          <h1 className="text-3xl font-bold mx-0 font-custom text-center">
            Bienvenue ! 
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
                    disabled={isLoading}
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
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    disabled={isLoading}
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

          <Button 
            type="submit" 
            className="w-full bg-black text-white hover:bg-gray-800 ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader className="h-4 w-4 animate-spin" />
                <span>Connexion en cours...</span>
              </div>
            ) : (
              "Se Connecter"
            )}
          </Button>
        </form>
      </Form>


      <div className="flex flex-col items-center justify-center gap-2">
        <p className="text-sm text-gray-500">
          Copyright © 2025 - Tous droits réservés
        </p>
        <p className="text-sm text-gray-500">
          Abdelrahim & Wiicode Team
        </p>
        <p className="text-xs text-center text-gray-500">
          Version 1.0.0
        </p>
      </div>
    </div>
  );
};

export default Login;