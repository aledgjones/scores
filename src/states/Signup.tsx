import { FC } from "react";
import pkg from "../../package.json";
import { Link } from "react-router-dom";
import Card from "../ui/components/card";
import CardContent from "../ui/components/card-content";

export const Signup: FC = () => {
  return (
    <>
      <div className="signup">
        <Card>
          <CardContent>
            <h1 className="logo">{pkg.displayName}</h1>
            <p className="version">Version {pkg.version}</p>
            <p className="info">
              Thanks for your interest in {pkg.displayName}, we are currently in
              testing and hope to be available soon.
            </p>
            <div className="buttons">
              <Link to="/login" className="link">
                Back
              </Link>
            </div>
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
        .info {
          margin-bottom: 20px;
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
