import { Button } from "@/components/ui/button";
import { authContext } from "@/services/authContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2Icon, Check, XIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { supabase } from "@/services/supabaseClient";

interface ChangePassProps {
  setIsPasswordRecovery: (value: boolean) => void;
}

const ChangePass = ({ setIsPasswordRecovery }: ChangePassProps) => {
  const auth = authContext;
  const navigate = useNavigate();
  const [newPass, setNewPass] = useState("");
  const [eyeIcon, setEyeIcon] = useState(false);
  const [passType, setPassType] = useState("password");
  const [isLoading, setIsLoading] = useState(false);

  // Verificar se há um contexto de reset válido ao montar o componente
  useEffect(() => {
    const checkRecoveryContext = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      // Se não há sessão, não é um contexto válido de reset
      if (!session) {
        navigate('/');
        return;
      }
    };

    checkRecoveryContext();
  }, [navigate]);

  function showPass() {
    setEyeIcon(!eyeIcon);

    if (passType !== "text") {
      setPassType("text");
      return;
    }
    setPassType("password");
  }
 

  async function handleSubmitTest(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      const { data, error } = await auth.updateUser(newPass);
      console.log(data);

      if (error) {
        console.log(error)
        setIsLoading(false);
        return;
      }

      // Limpar o flag de password recovery após atualização bem-sucedida
      setIsPasswordRecovery(false);
      navigate('/test')
    } catch (error) {
      console.log("Ocorreu um erro interno", error);
    }
    finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="w-screen h-screen flex justify-center items-center gap-4 px-4 md:px-10 py-8 font-prompt">
      <Card className="bg-[#151515] border-zinc-800 opacity-100 md:h-fit md:w-fit flex flex-col justify-center px-12 py-6 md:px-16 md:py-10 mt-4 md:mt-0 items-center">
        <CardHeader>
          <CardTitle className="text-center"><h1 className="text-lg">Update your password</h1></CardTitle>
          <CardDescription><p>Please put your new password below</p></CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitTest}>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium" htmlFor="password">
                New password
              </label>
              <div className="relative flex items-center">
                <Input
                  onChange={(e) => setNewPass(e.target.value)}
                  value={newPass}
                  disabled={isLoading}
                  type={passType}
                  id="password"
                  className="pr-12 rounded-sm bg-transparent focus:ring-1 placeholder:opacity-50 focus:ring-zinc-800 focus:outline-none focus:ring-offset-0 border border-zinc-800 "
                ></Input>
                {newPass !== "" && !isLoading && (
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

              <div className="mt-2 text-[11px]">
                <div className="flex items-center gap-[3px]">
                  {/[A-Z]/.test(newPass) ? (
                    <>
                      <Check className="w-4 text-blue-500" />{" "}
                      <p>At least one upercase letter</p>
                    </>
                  ) : (
                    <>
                      <XIcon className="w-4 text-red-700" />
                      <p className="opacity-60">At least one upercase letter</p>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {newPass.length >= 6 ? (
                    <>
                      <Check className="w-4 text-blue-500" />{" "}
                      <p>Minimum 6 characters</p>
                    </>
                  ) : (
                    <>
                      <XIcon className="w-4 text-red-700" />
                      <p className="opacity-60">Minimum 6 characters</p>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {/\d/.test(newPass) ? (
                    <>
                      <Check className="w-4 text-blue-500" />{" "}
                      <p>At least one number</p>
                    </>
                  ) : (
                    <>
                      <XIcon className="w-4 text-red-700" />
                      <p className="opacity-60">At least one number</p>
                    </>
                  )}
                </div>
              </div>
            </div>
            {isLoading ? (
              <Button
                className="border-2 rounded-xl w-full hover:border-zinc-900 mt-2"
                disabled
              >
                <Loader2Icon className="animate-spin" />
                Please Wait
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={
                  !/[A-Z]/.test(newPass) ||
                  newPass.length < 6 ||
                  !/\d/.test(newPass)
                }
                className="bg-neutral-200 w-full text-[#121212] mt-3 hover:border-none focus:outline-none"
              >
                Confirm
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </main>
  );
};

export default ChangePass;
