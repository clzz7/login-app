import { useState } from "react";
import { authContext } from "@/services/authContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GitHubIcon, GoogleIcon, SSOIcon } from "../components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "react-router-dom";
import {
  Loader2Icon,
  EyeIcon,
  EyeOffIcon,
  AlertCircle,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

const emailStepSchema = z.object({
  email: z.string().email("Digite um email válido"),
  password: z.string().optional(),
});

type EmailStepData = z.infer<typeof emailStepSchema>;

const Login = () => {
  const auth = authContext;
  const navigate = useNavigate();
  const [isLoading, setisLoading] = useState(false);
  const [eyeIcon, setEyeIcon] = useState(false);
  const [passType, setPassType] = useState("password");
  const [step, setStep] = useState<"email" | "password">("email");
  const [invalidPass, setInvalidPass] = useState(false);
  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EmailStepData>({
    resolver: zodResolver(emailStepSchema),
  });
  const password = watch("password");
  const email = watch("email");

  function showPass() {
    setEyeIcon(!eyeIcon);

    if (passType !== "text") {
      setPassType("text");
      return;
    }
    setPassType("password");
  }

  async function handleLoginTest() {
    setisLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    if (step !== "password") {
      setStep("password");
      setValue('password', '')
      setisLoading(false);
      return;
    }

      const { error, data } = await auth.signInWithEmail(email, password || '');

      if (error) {
        setInvalidPass(true)
        setisLoading(false)
        return
      }

      console.log(data)

      navigate('/test')

      setisLoading(false);
    
  }


  return (
    <div className="w-screen h-screen flex justify-center items-center gap-4 md:px-10 py-8 px-4 font-prompt">
      <Card className="bg-[#151515] border-zinc-800 opacity-100 md:h-fit md:w-fit flex flex-col justify-center px-12 py-6 md:px-16 md:py-10 mt-4 md:mt-0 items-center">
        <CardHeader>
          <CardTitle>
            <h1 className="text-lg font-prompt">Sign in</h1>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-2"
            onSubmit={handleSubmit(handleLoginTest)}
          >
            {step !== "email" ? (
              <>
                {invalidPass && (
                  <div className="bg-red-600/60 border border-red-400/40 px-4 py-1 rounded-sm flex gap-2 items-center justify-center">
                    <AlertCircle className="w-4" />
                    <span className="text-xs">Email ou senha invalidos!</span>
                  </div>
                )}
                <label>Email</label>
                <Input
                  disabled
                  className="disabled:border-1 disabled:border-zinc-800 h-fit"
                  value={email}
                />
                <label className="mt-2" htmlFor="password">
                  Password
                </label>
                <div className="relative flex items-center">
                  <Input
                    autoComplete="off"
                    disabled={isLoading}
                    {...register("password")}
                    type={passType}
                    required
                    className="rounded-sm pr-12 bg-transparent pl-2 focus:ring-1 focus:ring-zinc-800 focus:outline-none focus:ring-offset-0 border border-zinc-800 md:w-[300px]"
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
                  )}{" "}
                </div>
                {(errors as any).password?.message && (
                  <span className="text-red-500 text-xs flex gap-2 items-center">
                    <AlertCircle className="w-4" />
                    {(errors as any).password.message}
                  </span>
                )}
                <Link
                  to="/forgot"
                  className="text-center opacity-80 text-neutral-400 underline mt-2 text-sm"
                >
                  Forgot your password?
                </Link>
                {isLoading ? (
                  <Button
                    className="mt-4 hover:border-transparent"
                    size="lg"
                    disabled
                  >
                    <Loader2Icon className="animate-spin" />
                    Please Wait
                  </Button>
                ) : (
                  <Button className="bg-zinc-200 text-[#121212] rounded-sm mt-2">
                    Login
                  </Button>
                )}
              </>
            ) : (
              <>
                <label htmlFor="email">Email</label>
                <Input
                  disabled={isLoading}
                  {...register("email")}
                  className="rounded-sm bg-transparent px-2 focus:ring-1 focus:ring-zinc-800 focus:outline-none focus:ring-offset-0 border border-zinc-800 md:w-[300px]"
                  id="email"
                />
                {errors.email?.message && (
                  <span className="text-red-500 text-xs flex gap-2 items-center">
                    <AlertCircle className="w-4" />
                    {errors.email.message}
                  </span>
                )}
                <span className="text-center text-sm mt-2 text-neutral-400">
                  Don't have a account?
                  <Link
                    to="/signup"
                    className="ml-2 text-neutral-400 opacity-80 underline text-sm"
                  >
                    Sign up
                  </Link>
                </span>
                {isLoading ? (
                  <Button
                    className="mt-4 hover:border-transparent"
                    size="lg"
                    disabled
                  >
                    <Loader2Icon className="animate-spin" />
                    Please Wait
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="bg-zinc-200 text-[#121212] rounded-sm mt-2"
                  >
                    Login
                  </Button>
                )}
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Separator className="w-16" />
                  <span className="text-center">Or</span>
                  <Separator className="w-16" />
                </div>
                <div className="flex justify-between mt-8 text-sm">
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

export default Login;
