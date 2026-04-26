import axios from "axios";
import Image from "next/image";
import Input from "../component/Input";
import { useCallback, useState } from "react";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [variant, setVariant] = useState("login");

  const toggleVariant = useCallback(() => {
    setVariant((currentVariant) =>
      currentVariant === "login" ? "register" : "login",
    );
  }, []);

  const register = useCallback(async () => {
    try {
      await axios.post("/api/register", { email, name, password });
    } catch (err) {
      console.log(err);
    }
  }, [email, name, password]);

  const login = useCallback(async () => {
    try {
      await signIn("credentials", {
        email,
        password,
        callbackUrl: "/profile",
      });
    } catch (err) {
      console.log(err);
    }
  }, [email, password]);

  return (
    <div
      className="relative h-screen w-full bg-fixed bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/hero.jpg')" }}
    >
      <div className="bg-black w-full h-full lg:bg-black/50">
        <nav className="px-12 py-5">
          <Image src="/images/Logo.png" alt="Logo" width={120} height={48} />
        </nav>
        <div className="flex justify-center">
          <div className="bg-black/70 px-16 py-16 self-center mt-2 lg:w-2/5 lg:max-w-md rounded-md w-full">
            <h2 className="text-white text-4xl mb-8 font-semibold">
              {variant === "login" ? "Sign in" : "Register"}
            </h2>
            <div className="flex flex-col gap-4">
              {variant === "register" && (
                <Input
                  label="Username"
                  onChange={(e) => setName(e.target.value)}
                  id="name"
                  value={name}
                />
              )}
              <Input
                label="Email"
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                type="email"
                value={email}
              />
              <Input
                label="Password"
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                value={password}
                type="password"
              />
            </div>

            <button
              onClick={variant === "login" ? login : register}
              className="bg-red-600 py-3 text-white rounded-md w-full mt-10 hover:bg-red-700 transition"
            >
              {variant === "login" ? "Login" : "Sign up"}
            </button>

            {/* Social Login Buttons */}
            <div className="flex flex-row items-center gap-4 mt-8 justify-center">
              <button
                onClick={() => signIn("google", { callbackUrl: "/profile" })}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:opacity-80 transition cursor-pointer"
              >
                <FcGoogle size={24} />
              </button>
              <button
                onClick={() => signIn("github", { callbackUrl: "/profile" })}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:opacity-80 transition cursor-pointer"
              >
                <FaGithub size={24} />
              </button>
            </div>

            <p className="text-neutral-500 mt-12 text-center">
              {variant === "login"
                ? "First time using Netflix? "
                : "Already have an account? "}
              <span
                onClick={toggleVariant}
                className="text-white ml-1 hover:underline cursor-pointer"
              >
                {variant === "login" ? "Create an account" : "Login"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
