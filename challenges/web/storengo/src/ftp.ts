import { FtpSrv } from "ftp-srv";
import * as redis from "redis";
import * as fs from "fs";
import * as path from "path";

import { md5 } from "./utils/crypto";
import { exists as redis_exists } from "./utils/redis";

const rclient = redis.createClient({
  host: "127.0.0.1",
  port: 6379,
});

const ftpServer = new FtpSrv({
  url: `ftp://0.0.0.0:${process.env.FTP_PORT || 5001}`,
  // Disable directory creation
  blacklist: ["MKD", "XMKD", "RMD", "XRMD"],
  greeting: [
    "Store'N'Go",
    "Unless you are not behind a NAT, don't forget to run the `passive` command",
  ],
  anonymous: false,
  pasv_url: `ftp://${process.env.FTP_PASV_IP || "127.0.0.1"}`,
  pasv_min: Number(process.env.FTP_PASV_MIN || 5002),
  pasv_max: Number(process.env.FTP_PASV_MAX || 5100),
});

ftpServer.on("login", async (data, resolve, reject) => {
  const username = data.username.trim();
  const password = data.password.trim();

  if (
    !/^[A-z0-9]{8,32}$/.test(username) ||
    !/^[A-z0-9]{8,32}$/.test(password)
  ) {
    reject(
      new Error(
        "Both username and password must match the /^[A-z0-9]{8,32}$/ regex"
      )
    );
  } else {
    try {
      const hash = md5(
        `${username}_${password}_${
          process.env.SECRET || "store'n'go"
        }`
      );
      const is_admin = await redis_exists(rclient, hash + "_admin");
      const userpath = path.join(
        __dirname,
        "userdata",
        is_admin ? "admin" : hash
      );

      // I hate that there are no easy async exists
      if (!fs.existsSync(userpath)) {
        await fs.promises.mkdir(userpath);
      }

      resolve({
        cwd: "/",
        root: userpath,
      });
    } catch (e) {
      reject(e);
    }
  }
});

ftpServer
  .listen()
  .then(() =>
    console.log("ftp server listening on port", process.env.FTP_PORT || 5001)
  );
