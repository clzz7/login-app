import { supabase } from "@/services/supabaseClient";
import { useNavigate } from "react-router-dom";

const Test = () => {
  const navigate = useNavigate();
  const SignOut = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await supabase.auth.signOut();
    navigate("/");
    console.log(response);
  };

  return (
    <div className="bg-slate-600">
      <form onSubmit={SignOut}>
        <button> signOut </button>
      </form>
    </div>
  );
};

export default Test;
