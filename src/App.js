import { useRef, useState } from "react";
import "./App.css";

function App() {
  const [sessRef, setSessRef] = useState("");
  const [sessID, setSessID] = useState("");
  const cookieRef = useRef("");

  const auth = () => {
    console.log("Auth", sessRef, sessID);
    const payload = {
      type: "auth",
      data: {
        sessref: sessRef,
        ID: sessID,
        "client-type": "jsonws",
      },
    };
    const headers = {
      "Content-Type": "application/json", //;charset=UTF-8
    };
    fetch("https://www.alrajhitadawul.com.sa/MDF/api/v1/authentication", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: headers,
    })
      .then((res) => {
        let cookie = res?.headers?.["set-cookie"];
        cookie?.[0]?.split(",")?.findIndex((item) => {
          if (item?.includes("JSESSIONID")) {
            cookieRef.current = item;
          }
        });
        return res.text();
      })
      .then((resText) => console.log("authentication:", resText))
      .catch(() => {});
  };
  const connect = () => {
    console.log("cookie", cookieRef.current);
    const url = "wss://www.alrajhitadawul.com.sa/MDF/api/v1/WebSocket-PDS";
    const ws = new WebSocket(url, ["wss"]);
    ws.onmessage = (data) => {
      console.log("Getting message from server " + data);
    };

    ws.onopen = (e) => {
      console.log("Socket Open", e);
    };
    ws.onerror = (e) => {
      console.log("Socket error", e);
    };
  };

  return (
    <div className="App">
      <header className="App-header">
        <>
          <input
            placeholder="SessRef"
            value={sessRef}
            onChange={(e) => setSessRef(e.target.value)}
          />
          <input
            placeholder="SessID"
            value={sessID}
            onChange={(e) => setSessID(e.target.value)}
          />

          <button onClick={auth}>Auth</button>
          <button onClick={connect}>Connect</button>
        </>
      </header>
    </div>
  );
}

export default App;
