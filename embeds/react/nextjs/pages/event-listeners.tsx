import { useCallback, useEffect, useState } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";

export default function App() {
  const [CalApi, setCalApi] = useState<Awaited<ReturnType<typeof getCalApi>>>();
  const [counter, setCounter] = useState(0);
  const [linkReadyStatus, setLinkReadyStatus] = useState(false);

  // Must maintain the reference of onLinkReady same so that off can reuse that reference for removing the listener
  const onLinkReady = useCallback((e:any) => {
    setLinkReadyStatus(true);
  }, []);

  useEffect(() => {
    (async function () {
      const CalApi = await getCalApi();
      setCalApi(() => CalApi);
      CalApi("on", {
        action: "linkReady",
        callback: onLinkReady
      });
    })();
  }, [onLinkReady]);

  return (
    <div className="App">
      <h1>You will get link loading status below, powered by `linkReady` event listener</h1>
      <h3>{!linkReadyStatus ? "Loading" : "Loaded"}</h3>
      <button
        onClick={() => {
          CalApi!("off", {
            action: "linkReady",
            callback: onLinkReady
          });
        }}
      >
        Remove Link Ready Event Listener
      </button>
      <button
        onClick={() => {
          setCounter((c) => c + 1);
          setLinkReadyStatus(false);
        }}
      >
        Load calLink again
      </button>
      <Cal key={counter} calLink="rick"></Cal>
    </div>
  );
}
