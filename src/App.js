import { useState } from "react";
import "./App.css";

function App() {
  const [sessRef, setSessRef] = useState("");
  const [sessID, setSessID] = useState("");

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
    fetch("https://uat.alrajhitadawul.com.sa/MDF/api/v1/authentication", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: headers,
    })
      .then((res) => {
        return res.text();
      })
      .then((resText) => console.log("authentication:", resText))
      .catch(() => {});
  };
  const connect = () => {
    const url = "https://uat.alrajhitadawul.com.sa/MDF/api/v1/WebSocket-PDS";

    let headers = {};

    headers["Upgrade"] = `websocket`;
    headers["Connection"] = `Upgrade`;
    headers["Sec-WebSocket-Key"] = `dGhlIHNhbXBsZSBub25jZQ==`;
    headers["Sec-WebSocket-Version"] = `13`;
    headers["cookie"] = `${sessID}`;
    headers["Origin"] = "https://uat.alrajhitadawul.com.sa"

    const ws = new WebSocket(`${url}`, null, {
      headers,
    });
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
