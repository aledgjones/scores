import { useState } from "react";
import toast from "react-hot-toast";
import pkg from "../../package.json";
import Card from "../ui/components/card";
import CardContent from "../ui/components/card-content";
import Input from "../ui/components/input";
import Button from "../ui/components/button";
import { login } from "../services/auth";
import { Link, useNavigate } from "react-router-dom";

export const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [working, setWorking] = useState(false);

  const submit = async () => {
    try {
      setWorking(true);
      await login(email, password);
      navigate("/library");
    } catch (error) {
      toast.error(error.message);
      setWorking(false);
    }
  };

  return (
    <>
      <div className="login">
        <Card>
          <CardContent>
            <h1 className="logo">{pkg.displayName}</h1>
            <p className="version">Version {pkg.version}</p>
            <form onSubmit={(e) => e.preventDefault()}>
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
                onEnter={submit}
                autoComplete="current-password"
                margin
              />

              <Link to="/" className="link">
                Forgotten Password?
              </Link>
              <p className="annotation">Reset your password here</p>

              <div className="buttons">
                <Link to="/signup" className="link">
                  Create Account
                </Link>
                <Button
                  disabled={working}
                  primary
                  onClick={submit}
                  className="login-button"
                >
                  Login
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      <style jsx>{`
        .login {
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
        .login :global(.ui-card) {
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
        .login :global(.link) {
          display: inline-block;
          color: rgb(var(--primary));
          text-align: center;
          cursor: pointer;
        }
        .login :global(.link:hover) {
          text-decoration: underline;
        }
        .annotation {
          margin-bottom: 20px;
          font-size: 12px;
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
