const ws = new WebSocket("wss://cctamcc.site");

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);

  if (msg.type === "recovery_update") {
    console.log("Real-time Recovery Update:", msg.data);
  }
};
