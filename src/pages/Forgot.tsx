import { useState } from "react";
import { useForm } from "react-hook-form";
import { AlertCircle, Loader2Icon, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authContext } from "@/services/authContext";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";

const forgotSchema = z.object({
  email: z.string().email("Digite um email valido"),
});

type forgotType = z.infer<typeof forgotSchema>;

const Forgot = () => {
  const auth = authContext;
  const [otp, setOtp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    handleSubmit,
    watch,
    register,
    formState: { errors },
  } = useForm<forgotType>({
    resolver: zodResolver(forgotSchema),
  });

  const email = watch('email');

  async function handleSubmitTest() {
    setIsLoading(true);

    new Promise((resolve) => setTimeout(resolve, 1500));

    const { data, error } = await auth.resetPassword(email);

    setIsLoading(false);

    if (error) {
      console.log(error);
    }

    setOtp(true)

    console.log(data);
  }

  return (
    <main className="w-screen h-screen flex justify-center items-center px-4 gap-4 md:px-10 py-8 font-prompt">
      <Card className="bg-[#151515] border-zinc-800 opacity-100 md:h-fit md:w-fit flex flex-col justify-center px-12 py-6 md:px-16 md:py-10 mt-4 md:mt-0 items-center">
        <CardHeader>
          <CardTitle className="text-center">
            <h1 className="text-lg">Forgot your password</h1>
          </CardTitle>
          <CardDescription>
            {!otp && <p>Please enter you account email</p>}
            {otp && (
              <span className="flex justify-center mt-4">
                <MailCheck size={32} />
              </span>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex justify-center items-center">
            <form
              onSubmit={handleSubmit(handleSubmitTest)}
              className="flex flex-col justify-center"
            >
              {otp ? (
                <div className="flex flex-col">
                  <p className="text-sm text-center opacity-90">
                    Enviamos um e-mail para
                  </p>
                  <strong className="text-sm text-center text-white">
                    {email}
                  </strong>
                  <p className="max-w-xs text-xs text-center mt-4">
                    Dentro de instantes, acesse o seu e-mail e clique no link
                    para redefinir sua senha.
                  </p>
                </div>
              ) : (
                <>
                <label className="text-sm font-medium" htmlFor="password">
                Email
              </label>
                  <Input
                    className="mt-2 rounded-sm bg-transparent py-1 px-2 focus:ring-1 placeholder:opacity-50 focus:ring-zinc-800 focus:outline-none focus:ring-offset-0 border border-zinc-800 "
                    type="email"
                    disabled={isLoading}
                    {...register("email")}
                  />
                  
                </>
              )}
              {errors.email?.message && (
                <span className="text-red-500 text-xs flex gap-2 items-center mt-[2px]">
                  <AlertCircle className="w-4" />
                  {errors.email.message}
                </span>
              )}
              {!otp && <Button
                    className=" bg-neutral-200 text-[#121212] mt-3 hover:border-none focus:outline-none"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2Icon className="animate-spin" />
                        Please Wait
                      </>
                    ) : (
                      <>Confirm</>
                    )}
                  </Button>}
            </form>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};
export default Forgot;
