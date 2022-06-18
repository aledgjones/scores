import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUid } from "../services/auth";
import { supabase } from "../services/db";
import Spinner from "../ui/components/spinner";

export const AuthCheck = () => {
  const navigate = useNavigate();
  const uid = useUid();

  useEffect(() => {
    if (uid) {
      navigate("/library");
      const session = supabase.auth.session();
      if (session?.refresh_token) {
        supabase.auth.signIn({ refreshToken: session?.refresh_token });
      }
    } else {
      const ref = setTimeout(() => {
        navigate("/login");
      }, 2000);
      return () => {
        clearTimeout(ref);
      };
    }
  }, [uid]);

  return (
    <>
      <div className="page">
        <Spinner color="#fff" />
      </div>
      <style jsx>{`
        .page {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100vw;
          height: 100vh;
          background-image: linear-gradient(
            35deg,
            rgb(var(--primary)),
            rgb(var(--secondary))
          );
        }
      `}</style>
    </>
  );
};
