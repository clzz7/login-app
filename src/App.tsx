import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState, lazy, Suspense } from "react";
import Loading from "./pages/Loading";
import { supabase } from "./services/supabaseClient";
import { type Session, type AuthChangeEvent } from "@supabase/supabase-js";
import { Provider } from "./components/ui/provider";

// Lazy loading das páginas para reduzir o bundle inicial
const Login = lazy(() => import("./pages/Login"));
const Forgot = lazy(() => import("./pages/Forgot"));
const Signup = lazy(() => import("@/pages/Signup"));
const ChangePass = lazy(() => import("./pages/ChangePass"));
const Test = lazy(() => import("./pages/Test"));

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session) => {
      // Detectar quando o evento é PASSWORD_RECOVERY
      if (event === 'PASSWORD_RECOVERY') {
        setIsPasswordRecovery(true);
      }
      // Limpar o flag quando o usuário fizer signout
      if (event === 'SIGNED_OUT') {
        setIsPasswordRecovery(false);
      }
      // Nota: Não limpamos o flag em SIGNED_IN porque pode ser após o updateUser
      // O flag será limpo manualmente em ChangePass após sucesso
      
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
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route
              path="/"
              element={
                !session ? (
                  <Login />
                ) : isPasswordRecovery ? (
                  <Navigate to="/changepass" />
                ) : (
                  <Navigate to="/test" />
                )
              }
            />

            {/* OUTRAS ROTAS PÚBLICAS */}
            <Route path="/forgot" element={<Forgot />} />
            <Route path="/signup" element={<Signup />} />
            <Route 
              path="/changepass" 
              element={
                isPasswordRecovery || !session ? (
                  <ChangePass setIsPasswordRecovery={setIsPasswordRecovery} />
                ) : (
                  <Navigate to="/" />
                )
              } 
            />

            {/* ROTA PRIVADA (Protegida) */}
            <Route
              path="/test"
              element={session ? <Test /> : <Navigate to="/" />}
            />
          </Routes>
        </Suspense>
      )}
    </Provider>
  );
}

export default App;