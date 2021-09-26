import dotenv from "dotenv";
dotenv.config();

import net from "net";

let data = Buffer.from("");
const socket = net
  .connect({
    host: "127.0.0.1",
    port: Number(process.env.PORT || 5000),
  })
  .on("data", (b) => (data = Buffer.concat([data, b])));

setTimeout(() => {
  try {
    const healthy = data.toString().slice(-2).trim() === ">" ? true : false;
    socket.write("healthcheck " + (healthy ? "Y" : "N"), () => {
      socket.destroy();
      process.exit(healthy ? 0 : 1);
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}, 2500);
