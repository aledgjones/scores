import { useState } from "react";
import Modal from "../ui/components/modal";
import CardContent from "../ui/components/card-content";
import Button from "../ui/components/button";
import { FC } from "react";
import toast from "react-hot-toast";
import { sendInviteToLibrary, useLibraryInvites } from "../services/libraries";
import Input from "../ui/components/input";

interface Props {
  libraryKey?: string;
  onClose: () => void;
}

const InviteToLibrary: FC<Props> = ({ libraryKey, onClose }) => {
  const { mutate } = useLibraryInvites(libraryKey);
  const [email, setEmail] = useState("");

  const onInvite = async () => {
    try {
      await sendInviteToLibrary(libraryKey, email);
      mutate();
      onClose();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const onCancel = () => {
    onClose();
  };

  return (
    <>
      <CardContent>
        <h2 className="title">Invite to library</h2>
        <Input
          type="email"
          label="Email"
          value={email}
          onChange={setEmail}
          margin
        />
        <p className="description">
          The user will see a notification allowing them to accept your
          invitation.
        </p>
        <div className="buttons">
          <Button onClick={onCancel}>Cancel</Button>
          <Button onClick={onInvite} primary>
            Send Invite
          </Button>
        </div>
      </CardContent>

      <style jsx>{`
        .title {
          font-size: 24px;
          margin-bottom: 20px;
        }
        .description {
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

export default Modal(InviteToLibrary);
