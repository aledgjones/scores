import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useResumeSession } from "../services/auth";
import Spinner from "../ui/components/spinner";

export const AuthCheck = () => {
  const navigate = useNavigate();
  const auth = useResumeSession();

  useEffect(() => {
    // loading
    if (auth === undefined) {
      return;
    }

    if (auth === null) {
      navigate("/login");
    } else {
      navigate("/library");
    }
  }, [auth]);

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
