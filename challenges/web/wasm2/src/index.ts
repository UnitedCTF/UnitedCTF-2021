import express from 'express';
import fileUpload from 'express-fileupload';
import fs from 'fs';

const app = express();
const FLAG = fs.readFileSync('./challenge/FLAG').toString();

app.use(fileUpload());

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index', {});
});

function random_string(len: number) {
    return [...Array(len)].map(() => Math.random().toString(36)[2]).join('');
}

app.post('/', async (req, res) => {
    const data = (req?.files?.file as any)?.data;

    if (data == null) {
        res.send("No file.");
    }

    let solved = false;
    let attempted = false;

    const challenge = random_string(36);
    const memory = new WebAssembly.Memory({ initial: 10, maximum: 100, shared: true });

    function put_challenge(address: number) {
        const u8mem = new Uint8Array(memory.buffer);

        for(let i = 0; i < challenge.length; i++) {
            u8mem[address + i] = challenge.charCodeAt(i);
        }
    }

    function verify_answer(address: number) {
        if(attempted) return;

        const u8mem = new Uint8Array(memory.buffer);

        let str = "";

        for(let i = 0; i < challenge.length; i++) {
            if(u8mem[address + i] == 0) break;

            str += String.fromCharCode(u8mem[address + i]);
        }

        solved = challenge === str.split('').reverse().join('');
        attempted = true;
    }

    const wasm = await WebAssembly.compile(data);
    const instance = await WebAssembly.instantiate(wasm, { 
        imports: { 
            put_challenge, 
            verify_answer 
        }, 
        env: { 
            put_challenge, 
            verify_answer 
        }, 
        js: { 
            memory 
        } 
    });

    if(instance.exports.main == undefined) {
        res.send("No main function.");
    }

    try {
        await (instance.exports as any)?.main();

        if(solved) {
            res.send(FLAG);
        } else {
            res.send("Wrong answer.");
        }
    } catch {
        res.send("WASM error.");
    }
});

app.listen(1337, () => {
    console.log(`WASM2 listening at http://localhost:${1337}`)
});