import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getLastLibrary, useLibraries } from "../services/libraries";

export const Library = () => {
  const navigate = useNavigate();
  const { libraries } = useLibraries();

  useEffect(() => {
    (async () => {
      if (libraries.length > 0) {
        const key = await getLastLibrary(libraries);
        navigate(`/library/${key}`);
      }
    })();
  }, [libraries]);

  return null;
};
