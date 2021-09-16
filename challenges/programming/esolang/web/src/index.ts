import express from 'express';
import fs from 'fs';
// import { Interpreter } from '../../interpreters/js/src/webpack';
import { Interpreter } from '../interpreter/src/webpack';

const PORT = process.env.PORT || 1476;

const app = express();
app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

function testCode(code: string, input: string): boolean {
    const MAX_ITER = 10000;

    let fedInput = input;
    let interpreter = new Interpreter(code, () => {
        let nextChar = fedInput.charAt(0);
        fedInput = fedInput.substring(1);
        return nextChar;
    });

    let count = 0;
    while(interpreter.step() && count < MAX_ITER) { count++ }

    if(count == MAX_ITER) return false;

    return interpreter.output.split("").reverse().join("") === input.substring(0, input.length - 1);
}

function randomString(length: number): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const charactersLength = chars.length;
    let result = "";

    for(let i = 0; i < length; i++) result += chars.charAt(Math.floor(Math.random() * charactersLength));

    return result;
}

app.get('/challenge', (req, res) => {
    let code = "";
    let solution = "";
    if(req.query.code) {
        code = req.query.code as string;

        try {
            if(testCode(code, randomString(16) + "0")) {
                solution = fs.readFileSync("./challenges/3/FLAG").toString();
            } else {
                solution = "The supplied program is not a solution.";
            }
        } catch(e) {
            solution = `The program failed: ${e}`;
        }

    }

    res.render('challenge', { code, solution });
});

function base64url(data: Buffer | string): string {
    return Buffer.from(data).toString('base64').replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function loadCTF(file: string): string {
    return base64url(fs.readFileSync(file));
}

app.get('/gallery', (req, res) => {
    res.render('gallery', { programs: [
        {
            "name": "Challenge",
            "description": "Program for debugging challenge.",
            "program": loadCTF("./challenges/2/challenge.ctf")
        },
        {
            "name": "Alphabet",
            "description": "Program to display the whole alphabet.",
            "program": loadCTF("./tests/alphabet.ctf")
        },
        {
            "name": "Delay",
            "description": "Program to slow down an \"@\".",
            "program": loadCTF("./tests/delay.ctf")
        },
        {
            "name": "Generator",
            "description": "Program to generate \"@\"s forever.",
            "program": loadCTF("./tests/generator.ctf")
        },
        {
            "name": "Hello World",
            "description": "Program to display \"Hello World\" using parallelism.",
            "program": loadCTF("./tests/hello.ctf")
        },
        {
            "name": "Input",
            "description": "Program to display user input until \"0\".",
            "program": loadCTF("./tests/input.ctf")
        },
        {
            "name": "Meta",
            "description": "Program to demo meta construction of CTFLang symbols.",
            "program": loadCTF("./tests/meta.ctf")
        },
        {
            "name": "One",
            "description": "Program that takes one \"@\" from many.",
            "program": loadCTF("./tests/one.ctf")
        },
    ]});
});

app.get('/playground', (req, res) => {
    let code = "";
    try {
        code = Buffer.from(req.query.code as string, 'base64').toString('ascii');
    } catch {}

    let input = "";
    try {
        input = Buffer.from(req.query.input as string, 'base64').toString('ascii');
    } catch {}

    res.render('playground', { code, input });
});

app.listen(PORT, () => {
    console.log(`CTFL listening at http://localhost:${PORT}`)
});
