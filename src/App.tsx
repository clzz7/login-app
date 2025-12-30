import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading from "./pages/Loading";
import { supabase } from "./services/supabaseClient";
import Login from "./pages/Login";
import Forgot from "./pages/Forgot";
import Signup from "@/pages/Signup";
import ChangePass from "./pages/ChangePass";
import { type Session } from "@supabase/supabase-js";
import Test from "./pages/Test";
import { Provider } from "./components/ui/provider";

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });


    return () => subscription.unsubscribe();
  }, []);

  return (
    <Provider>
      {loading ? (
        <Loading />
      ) : (
        <Routes>
          <Route
            path="/"
            element={!session ? <Login /> : <Navigate to="/test" />}
          />

          {/* OUTRAS ROTAS PÚBLICAS */}
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/changepass" element={<ChangePass />} />

          {/* ROTA PRIVADA (Protegida) */}
          <Route
            path="/test"
            element={session ? <Test /> : <Navigate to="/" />}
          />
        </Routes>
      )}
    </Provider>
  );
}

export default App;