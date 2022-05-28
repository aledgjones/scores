import { FC, useState } from "react";
import pkg from "../../package.json";
import toast from "react-hot-toast";
import { signUp } from "../services/auth";
import { Link, useNavigate } from "react-router-dom";
import Card from "../ui/components/card";
import CardContent from "../ui/components/card-content";
import Input from "../ui/components/input";
import Checkbox from "../ui/components/checkbox";
import Button from "../ui/components/button";

export const Signup: FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [working, setWorking] = useState(false);

  const submit = async () => {
    if (working) {
      return;
    }

    try {
      setWorking(true);
      await signUp(name, email, password, terms);
      navigate("/library");
    } catch (error) {
      toast.error(error.message);
      setWorking(false);
    }
  };

  return (
    <>
      <div className="signup">
        <Card>
          <CardContent>
            <h1 className="logo">{pkg.displayName}</h1>
            <p className="version">Version {pkg.version}</p>
            <form onSubmit={(e) => e.preventDefault()}>
              <Input
                label="Name"
                type="text"
                value={name}
                onChange={(val) => setName(val)}
                margin
              />
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(val) => setEmail(val)}
                margin
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(val) => setPassword(val)}
                margin
              />

              <div className="checkbox" onClick={() => setTerms((s) => !s)}>
                <Checkbox value={terms} />
                <p>
                  <span>I agree to the </span>
                  <Link
                    className="link"
                    to="/terms-and-conditions"
                    onClick={(e) => e.stopPropagation()}
                    target="_blank"
                  >
                    terms and conditions
                  </Link>
                  <span> of service</span>
                </p>
              </div>

              <div className="buttons">
                <Link to="/login" className="link">
                  Back
                </Link>
                <Button primary onClick={submit} className="login-button">
                  Signup
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      <style jsx>{`
        .signup {
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
        .signup :global(.ui-card) {
          width: 100%;
          max-width: 420px;
          color: var(--black);
        }
        .logo {
          font-size: 28px;
          margin-bottom: 4px;
          text-align: center;
        }
        .version {
          margin-bottom: 30px;
          text-align: center;
        }
        .signup :global(.link) {
          display: inline-block;
          color: rgb(var(--primary));
          text-align: center;
          cursor: pointer;
        }
        .signup :global(.link:hover) {
          text-decoration: underline;
        }
        .annotation {
          margin-bottom: 20px;
          font-size: 12px;
        }
        .checkbox {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          cursor: pointer;
        }
        .buttons {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      `}</style>
    </>
  );
};
