import fs from 'fs';
import vm from 'vm';
import sqlite from 'sqlite3';
import express from 'express';
// @ts-ignore
import cookieParser from 'cookie-parser';
import { Brainfuck } from './brainfuck';

const ADMIN_USER = {
    username: "k1dd13",
    password: "k1dd13_pr00f_passw0rd_1234"
};
const LOGIN_PATH = "/super_secret_login_do_not_look_plz";
const AUTH_TOKEN = "SUPER_SAFE_AUTH_TOKEN";
const TEMP_FLAG = "CTF{PLACEHOLDER_FLAG}";

const PORT = process.env.PORT || 1337;
const app = express();

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));
app.set('view engine', 'ejs');

function getFlag(index: number): string {
    let path = `/app/flags/FLAG_${index}`;

    if(!fs.existsSync(path)) return TEMP_FLAG;

    return fs.readFileSync(path).toString('utf8');
}

function pathPrefixedWith(path: string, prefix: string): boolean {
    return path.toLowerCase() == prefix || path.toLowerCase().startsWith(`${prefix}/`);
}

function pathPrefixIn(path: string, prefixes: string[]): boolean {
    return prefixes.some(prefix => pathPrefixedWith(path, prefix));
}

/**
 * Auth Middleware.
 */
app.use((req, res, next) => {
    if(!pathPrefixIn(req.path, ["/api", "/app"])) {
        next(); return;
    }

    try {
        if(!req.cookies) throw "No cookies.";
        if(!req.cookies.AUTH_TOKEN) throw "No Auth Token.";
        if(req.cookies.AUTH_TOKEN !== AUTH_TOKEN) throw "Invalid Auth Token.";

        next();
    } catch(err) {
        res.status(403).send("Unauthorized. Begone hacker.");
    }
});

/**
 * Validator Middleware.
 */
 app.use((req, res, next) => {
    if(!pathPrefixIn(req.path, ["/api"])) {
        next(); return;
    }

    try {
        if(!req.body.data) throw "No data.";

        next();
    } catch(err) {
        res.send(`Error: ${err}`);
    }
});

/**
 * Challenge 1.
 */
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/security.txt', (req, res) => {
    res.setHeader("content-type", "text/plain");
    res.send(`${getFlag(1)}\n\nWe moved the login page for security reasons. You can find it at: ${LOGIN_PATH}.`);
});

/**
 * Challenge 2.
 */
app.get(`${LOGIN_PATH}`, (req, res) => {
    res.render('login');
});

app.post(`${LOGIN_PATH}`, async (req, res) => {
    let db = new sqlite.Database(":memory:");

    db.serialize(() => {
        db.run(`CREATE TABLE users(
            user_id INTEGER PRIMARY KEY,
            username TEXT NOT NULL,
            password TEXT NOT NULL
        )`);

        db.run(`INSERT INTO users(username, password) VALUES ("${ADMIN_USER.username}", "${ADMIN_USER.password}")`);

        db.get(`SELECT username, password FROM users WHERE ((username="${req.body.username}") AND (password="${req.body.password}"))`, [], (err, row) => {
            if(err) {
                res.render('login', { alert: "Login Failed." });
            } else if(row) {
                res.cookie("AUTH_TOKEN", AUTH_TOKEN);
                res.redirect("/app");
            } else {
                res.render('login', { alert: "Login Failed." });
            }
        });
    });

    db.close();
});

/**
 * Challenge 3.
 */
app.get(`/app`, (req, res) => {
    res.render('app', { flag: getFlag(2) });
});

interface ITool {
    name: string,
    description: string
}

const TOOLS: { [key: string ]: ITool } = {
    "base64": {
        name: "Base64 Encoder",
        description: "Converts text to base64."
    },
    "bf": {
        name: "BrainFuck Sandbox",
        description: "Runs BrainFuck safely."
    },
    "js": {
        name: "JavaScript Sandbox",
        description: "Runs JavaScript safely."
    },
    "rot13": {
        name: "ROT13",
        description: "Applies ROT13 on text."
    },
}

app.get(`/healthcheck`, (req, res) => {
    res.send("OK");
});

app.get(`/app/tools`, (req, res) => {
    res.render('tools', { tools: Object.entries(TOOLS).sort(([k1, v1], [k2, v2]) => k1.localeCompare(k2)).map(([k, v]) => ({ id: k, ...v })) });
});

app.get(`/app/tools/:id`, (req, res) => {
    if(!(req.params.id in TOOLS)) {
        res.redirect("/app/tools");
        return;
    }

    let tool = TOOLS[req.params.id];

    res.render('tool', { id: req.params.id, ...tool });
});

app.post(`/api/tools/base64`, (req, res) => {
    try {
        res.send(Buffer.from(req.body.data).toString("base64"));
    } catch(err) {
        res.send(`Error: ${err}`);
    }
});

app.post(`/api/tools/bf`, (req, res) => {
    try {
        let [code, input] = req.body.data.split("|");

        let bf = new Brainfuck();

        res.send(bf.go(code, input));
    } catch(err) {
        res.send(`Vm Error: ${err}`);
    }
});

app.post(`/api/tools/js`, (req, res) => {
    try {
        let vmResult = vm.runInContext(req.body.data, vm.createContext({}));

        res.send(`${vmResult}`);
    } catch(err) {
        res.send(`Vm Error: ${err}`);
    }
});

app.post(`/api/tools/rot13`, (req, res) => {
    try {
        let data: string = req.body.data;

        let rotData = data.split("").map(char => char.charCodeAt(0)).map(charInt => { 
            if(charInt >= 65 && charInt <= 90) return (charInt + 13) % 90;
            else if(charInt >= 97 && charInt <= 122) return (charInt + 13) % 122;
            else return charInt;
        }).map(charInt => String.fromCharCode(charInt)).join("");
    
        res.send(rotData);
    } catch(err) {
        res.send(`Error: ${err}`);
    }
});

app.listen(PORT, () => {
    console.log(`HackerTools listening at http://localhost:${PORT}`);
});
