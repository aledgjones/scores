import React from "react";
import CardContent from "../ui/components/card-content";
import Button from "../ui/components/button";
import { FC } from "react";
import Avatar from "../ui/components/avatar";
import { stringToColor } from "../ui/utils/string-to-color";
import {
  revokeLibraryAccess,
  updateLibraryUserPermissions,
  useLibraryMember,
} from "../services/libraries";
import Switch from "../ui/components/switch";
import { wait } from "../ui/utils/wait";
import toast from "react-hot-toast";
import BottomSheet from "../ui/components/bottom-sheet";

interface Props {
  libraryKey?: string;
  uid?: string;
  onClose: () => void;
}

const ManageLibraryMember: FC<Props> = ({ libraryKey, uid, onClose }) => {
  const { user, mutate } = useLibraryMember(libraryKey, uid);
  const initial = user?.name?.slice(0, 1).toLocaleUpperCase();
  const color = stringToColor(user?.email || "");

  const revoke = async () => {
    await revokeLibraryAccess(libraryKey, uid);
    onClose();
    await wait(200);
    mutate();
  };

  const updatePermissions = async (read: boolean, write: boolean) => {
    try {
      await updateLibraryUserPermissions(libraryKey, user, read, write);
      mutate();
    } catch (error) {
      toast.error("Something went wrong, please try again");
    }
  };

  return (
    <>
      <CardContent>
        <div className="center">
          <Avatar color={color} large>
            {initial}
          </Avatar>
          <h2 className="title">{user?.name}</h2>
          <p className="subtitle">{user?.email}</p>
          <Button onClick={revoke} compact error>
            Revoke Access
          </Button>
        </div>
      </CardContent>
      <div className="options">
        <div
          className="option"
          onClick={() => updatePermissions(!user.read, user.write)}
        >
          <div className="text">
            <p>View scores</p>
            <p className="small">
              This user {user?.read ? "can" : "cannot"} view scores in this
              library.
            </p>
          </div>
          <Switch value={user?.read} />
        </div>
        <div
          className="option"
          onClick={() => updatePermissions(user.read, !user.write)}
        >
          <div className="text">
            <p>Create/Edit scores</p>
            <p className="small">
              This user {user?.write ? "can" : "cannot"} create and edit scores
              in this library.
            </p>
          </div>
          <Switch value={user?.write} />
        </div>
      </div>
      <style jsx>{`
        .center {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .title {
          font-size: 24px;
          margin: 12px 0 4px 0;
        }
        .subtitle {
          margin-bottom: 20px;
        }
        .options {
          margin-bottom: 30px;
        }
        .option {
          padding: 12px 30px;
          display: flex;
          align-items: center;
          cursor: pointer;
        }
        .option:hover {
          background-color: rgb(245, 245, 245);
        }
        .text {
          flex-grow: 1;
          margin-right: 20px;
        }
        .small {
          opacity: 0.6;
          font-size: 0.8em;
        }
      `}</style>
    </>
  );
};

export default BottomSheet(ManageLibraryMember);
