import { GitHubIcon, GoogleIcon, SSOIcon } from "../components/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Loader2Icon, EyeIcon, EyeOffIcon, AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { authContext } from "@/services/authContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const signupSchema = z.object({
  firstName: z.string().min(1, "Nome é obrigatório"),
  lastName: z.string().min(1, "Sobrenome é obrigatório"),
  email: z.string().email("Digite um email válido"),
  password: z.string().optional(),
});

type SignupStepData = z.infer<typeof signupSchema>;

const Signup = () => {
  const auth = authContext;
  const navigate = useNavigate();
  const [isLoading, setisLoading] = useState(false);
  const [eyeIcon, setEyeIcon] = useState(false);
  const [passType, setPassType] = useState("password");
  const [step, setStep] = useState<"details" | "password">("details");
  const [signupError, setSignupError] = useState(false);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupStepData>({
    resolver: zodResolver(signupSchema),
  });

  const password = watch("password");
  const email = watch("email");
  const firstName = watch("firstName");
  const lastName = watch("lastName");

  function showPass() {
    setEyeIcon(!eyeIcon);

    if (passType !== "text") {
      setPassType("text");
      return;
    }
    setPassType("password");
  }

  async function handleSignup() {
    setisLoading(true);
    setSignupError(false);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (step !== "password") {
      setStep("password");
      setisLoading(false);
      return;
    }

    const username = `${firstName} ${lastName}`;
    const { error, data } = await auth.signUp(email, password || "", username);

    if (error) {
      setSignupError(true);
      console.error(error)
      setisLoading(false);
      return;
    }

    console.log(data);
    navigate("/");
    setisLoading(false);
  }

  return (
    <div className="flex justify-center items-center h-screen w-screen font-prompt px-4">
      <Card className="flex flex-col items-center justify-center bg-[#151515] border border-zinc-800 px-10 py-2 md:px-18 md:py-10">
        <CardHeader>
          <CardTitle className="text-center text-xl">Sign up</CardTitle>
          <CardDescription className="text-center text-base">
            {step === "password"
              ? "Create your password"
              : "Get started in seconds"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(handleSignup)}
            className="flex flex-col gap-4"
          >
            {step === "password" ? (
              <>
                {signupError && (
                  <div className="bg-red-600/60 border border-red-400/40 px-4 py-1 rounded-sm flex gap-2 items-center justify-center">
                    <AlertCircle className="w-4" />
                    <span className="text-xs">
                      O email informado já está em uso.
                    </span>
                  </div>
                )}
                <div className="grid gap-4 md:grid-cols-2">            
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium" htmlFor="email">
                    Email
                  </label>
                  <Input
                    disabled
                    className="rounded-sm bg-transparent  px-2 focus:ring-1 focus:ring-zinc-800 focus:outline-none focus:ring-offset-0 border border-zinc-800 disabled:opacity-50"
                    value={email}
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium" htmlFor="password">
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <Input
                      autoComplete="off"
                      disabled={isLoading}
                      {...register("password")}
                      type={passType}
                      required
                      className="rounded-sm pr-12 bg-transparent pl-2 focus:ring-1 focus:ring-zinc-800 focus:outline-none focus:ring-offset-0 border border-zinc-800 w-full"
                      id="password"
                    />
                    {password !== "" && !isLoading && (
                      <Button
                        type="button"
                        onClick={showPass}
                        variant="ghost"
                        className="absolute right-0 bg-transparent focus:outline-none"
                      >
                        {eyeIcon ? <EyeIcon /> : <EyeOffIcon />}
                      </Button>
                    )}
                  </div>
                  {errors.password?.message && (
                    <span className="text-red-500 text-xs flex gap-2 items-center">
                      <AlertCircle className="w-4" />
                      {errors.password.message}
                    </span>
                  )}
                </div>

                {isLoading ? (
                  <Button
                    className="border-2 rounded-xl hover:border-zinc-900 w-full"
                    disabled
                  >
                    <Loader2Icon className="animate-spin" />
                    Please Wait
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="border-2 rounded-sm w-full bg-zinc-200 text-[#121212]"
                  >
                    Sign Up
                  </Button>
                )}
              </>
            ) : (
              <>
                <div className="grid md:grid-cols-2 gap-4 md:max-w-sm">
                  <div className="grid gap-2">
                    <label className="text-sm" htmlFor="firstName">
                      First Name
                    </label>
                    <Input
                      className="rounded-sm bg-transparent py-2 px-2 focus:ring-1 focus:ring-zinc-800 focus:outline-none focus:ring-offset-0 border border-zinc-800 w-full"
                      id="firstName"
                      type="text"
                      {...register("firstName")}
                      disabled={isLoading}
                    />
                    {errors.firstName?.message && (
                      <span className="text-red-500 text-xs flex gap-2 items-center">
                        <AlertCircle className="w-4" />
                        {errors.firstName.message}
                      </span>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm" htmlFor="lastName">
                      Last Name
                    </label>
                    <Input
                      className="rounded-sm bg-transparent py-2 px-2 focus:ring-1 focus:ring-zinc-800 focus:outline-none focus:ring-offset-0 border border-zinc-800 w-full"
                      id="lastName"
                      type="text"
                      {...register("lastName")}
                      disabled={isLoading}
                    />
                    {errors.lastName?.message && (
                      <span className="text-red-500 text-xs flex gap-2 items-center">
                        <AlertCircle className="w-4" />
                        {errors.lastName.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="grid gap-2 max-w-md">
                  <label className="text-sm font-medium" htmlFor="email">
                    Email
                  </label>
                  <Input
                    className="rounded-sm bg-transparent px-2 focus:ring-1 focus:ring-zinc-800 focus:outline-none focus:ring-offset-0 border border-zinc-800 w-full"
                    id="email"
                    type="email"
                    disabled={isLoading}
                    {...register("email")}
                  />
                  {errors.email?.message && (
                    <span className="text-red-500 text-xs flex gap-2 items-center">
                      <AlertCircle className="w-4" />
                      {errors.email.message}
                    </span>
                  )}
                </div>

                <div className="text-center">
                  <span className="text-sm text-neutral-400">
                    Already have an account?
                    <Link
                      className="text-sm text-neutral-400 opacity-80 ml-1 underline"
                      to="/"
                    >
                      Sign In
                    </Link>
                  </span>
                </div>

                {isLoading ? (
                  <Button
                    className="border-2 rounded-xl hover:border-zinc-900 w-full"
                    disabled
                  >
                    <Loader2Icon className="animate-spin" />
                    Please Wait
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="border-2 rounded-sm mt-2 bg-zinc-200 text-[#121212] hover:border-zinc-900 w-full"
                  >
                    Continue
                  </Button>
                )}

                <div className="flex items-center justify-center gap-2 mt-2 md:mt-4">
                  <Separator className="w-16" />
                  <span className="text-center">Or</span>
                  <Separator className="w-16" />
                </div>
                <div className="flex justify-between md:mt-4 text-sm">
                  <a
                    href="#section"
                    className="flex flex-col items-center ml-6 text-gray-200 hover:text-gray-200"
                  >
                    <SSOIcon />
                    <p className="mt-2">Sso</p>
                  </a>
                  <a
                    href="#section"
                    className="flex flex-col items-center text-gray-200 hover:text-gray-200"
                  >
                    <GoogleIcon />
                    <p className="mt-2">Google</p>
                  </a>
                  <a
                    href="#section"
                    className="flex flex-col items-center text-gray-200 hover:text-gray-200 "
                  >
                    <GitHubIcon />
                    <p className="mt-2 ">GitHub</p>
                  </a>
                </div>
              </>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
