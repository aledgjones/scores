import { mdiAlertCircle, mdiLightningBoltCircle } from "@mdi/js";
import Icon from "@mdi/react";
import { FC } from "react";
import { Cache, useCacheState } from "../services/cache";
import Spinner from "../ui/components/spinner";

interface Props {
  scoreKey: string;
}

const OfflineIndicator: FC<Props> = ({ scoreKey }) => {
  const { cache } = useCacheState();
  const state = cache[scoreKey] || Cache.Working;

  return (
    <>
      {(!state || state === Cache.Working) && (
        <Spinner size={24} color="rgb(235,235,235)" />
      )}
      {state === Cache.Failed && (
        <Icon path={mdiAlertCircle} size={1} color="tomato" />
      )}
      {state === Cache.Success && (
        <Icon
          path={mdiLightningBoltCircle}
          size={1}
          color="rgb(var(--primary))"
        />
      )}
    </>
  );
};

export default OfflineIndicator;
