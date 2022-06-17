import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUid } from "../services/auth";
import Spinner from "../ui/components/spinner";

export const AuthCheck = () => {
  const navigate = useNavigate();
  const uid = useUid();

  useEffect(() => {
    if (uid) {
      navigate("/library");
    } else {
      const ref = setTimeout(() => {
        navigate("/login");
      }, 5000);
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
