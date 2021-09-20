import * as express from "express";
import * as session from "express-session";
import * as connectRedis from "connect-redis";
import * as redis from "redis";
import * as multer from "multer";
import * as fs from "fs";
import * as path from "path";

import { md5 } from "./utils/crypto";
import { exists as redis_exists } from "./utils/redis";

const app = express();
const rstore = connectRedis(session);
const rclient = redis.createClient({
  host: "127.0.0.1",
  port: 6379,
});

const cleanPath = (path: string): string => {
  let lastpath: string = "";
  let currpath: string = path;
  while (currpath !== lastpath) {
    lastpath = currpath;
    currpath = currpath.replace(/\.\./g, ".");
  }
  return currpath;
};

app.use(
  session({
    store: new rstore({ client: rclient, db: 1 }),
    secret: process.env.SECRET || "store'n'go",
    saveUninitialized: false,
    resave: false,
  })
);

app.use(express.urlencoded({ extended: true }));

app.post(
  "/api/login",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      if (
        !/^[A-z0-9]{8,32}$/.test(req.body.username) ||
        !/^[A-z0-9]{8,32}$/.test(req.body.password)
      ) {
        res
          .status(400)
          .send(
            "Both username and password must match the /^[A-z0-9]{8,32}$/ regex"
          );
      } else {
        const session = req.session as any;
        session.hash = md5(
          `${req.body.username}_${req.body.password}_${process.env.SECRET}`
        );

        const is_admin = await redis_exists(rclient, session.hash + "_admin");
        if (is_admin) session.hash = "admin";

        const userpath = path.join(__dirname, "userdata", session.hash);
        // I hate that there are no easy async exists
        if (!fs.existsSync(userpath)) {
          await fs.promises.mkdir(userpath);
        }

        res.redirect("/upload.html");
      }
    } catch (e) {
      next(e);
    }
  }
);

app.post(
  "/api/logout",
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      req.session.destroy(() => res.redirect("/"));
    } catch (e) {
      next(e);
    }
  }
);

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 4 * 1024 * 1024,
  },
});
app.post(
  "/api/upload",
  upload.single("file"),
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const session = req.session as any;
      if (!session.hash) {
        res.status(403).send("please login");
      } else {
        const userpath = path.join(__dirname, "userdata", session.hash);
        await fs.promises.writeFile(
          path.join(userpath, cleanPath(req.file.originalname)),
          req.file.buffer
        );

        res.redirect("/upload.html");
      }
    } catch (e) {
      next(e);
    }
  }
);

app.get(
  "/api/files",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const session = req.session as any;
      if (!session.hash) {
        res.status(403).send("please login");
      } else {
        const userpath = path.join(__dirname, "userdata", session.hash);
        res.json(await fs.promises.readdir(userpath));
      }
    } catch (e) {
      next(e);
    }
  }
);

app.get(
  "/api/files/:filename",
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const session = req.session as any;
      if (!session.hash) {
        res.status(403).send("please login");
      } else {
        const userpath = path.join(__dirname, "userdata", session.hash);
        res.sendFile(
          path.join(userpath, cleanPath(req.params.filename))
        );
      }
    } catch (e) {
      next(e);
    }
  }
);

app.delete(
  "/api/files/:filename",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const session = req.session as any;
      if (!session.hash) {
        res.status(403).send("please login");
      } else {
        const userpath = path.join(__dirname, "userdata", session.hash);
        await fs.promises.unlink(
          path.join(userpath, cleanPath(req.params.filename))
        );
        res.status(204).send();
      }
    } catch (e) {
      next(e);
    }
  }
);

app.get(
  "/api/is_admin",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const session = req.session as any;
      if (!session.hash) {
        res.status(403).send("please login");
      } else {
        res.json({
          [session.hash]: await redis_exists(rclient, session.hash + "_admin"),
        });
      }
    } catch (e) {
      next(e);
    }
  }
);

app.use(express.static(`${__dirname}/static`));

app.use(function (
  err: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  res.status(500).send(err.message);
});

app.listen(Number(process.env.HTTP_PORT || 5000), () =>
  console.log("http server listening on", process.env.HTTP_PORT || 5000)
);
