import dotenv from "dotenv";
dotenv.config();

import express from "express";

import { decrypt, encrypt } from "./crypto";

const app = express();

app.set("view engine", "ejs");
app.set("views", require("path").join(__dirname, "views"));

app.get(
  "/decrypt",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const ciphertext = req.query.ciphertext;
      if (typeof ciphertext !== "string")
        return res.status(400).send("invalid request");
      const plaintext = await decrypt(ciphertext);
      if (plaintext.indexOf("FLAG") !== -1) return res.send(process.env.FLAG);
      res.send(plaintext);
    } catch (e) {
      next(e);
    }
  }
);

app.get(
  "/encrypt",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const plaintext = req.query.plaintext;
      if (typeof plaintext !== "string")
        return res.status(400).send("invalid request");
      if (plaintext.indexOf("FLAG") !== -1)
        return res.status(403).send("forbidden word detected");
      res.send(await encrypt(plaintext));
    } catch (e) {
      next(e);
    }
  }
);

app.get("/", (_: express.Request, res: express.Response) =>
  res.render("index")
);

app.use(function (
  err: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  res.status(400).send("error");
});

app.listen(Number(process.env.PORT || 5000));
