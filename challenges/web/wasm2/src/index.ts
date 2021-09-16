import express from 'express';
import fileUpload from 'express-fileupload';
import fs from 'fs';

const PORT = process.env.PORT || 9696;
const FLAG = fs.readFileSync('./challenge/FLAG').toString();

function random_string(len: number) {
    return [...Array(len)].map(() => Math.random().toString(36)[2]).join('');
}

function send_success(res: any, msg: string) {
    res.render('index', { 'title': 'You Got It!', 'text': msg, 'gif': 'success.gif' });
}

function send_fail(res: any, msg: string) {
    res.render('index', { 'title': 'Something Went Wrong...', 'text': msg, 'gif': 'fail.gif' });
}

const app = express();

app.use(fileUpload());
app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index', { 'title': 'Give It To Me', 'text': 'Upload your WASM file.', 'gif': 'upload.gif' });
});

app.get('/healthcheck', (req, res) => {
    res.send('OK');
});

app.get('/src', (req, res) => {
    res.writeHead(200, {'Content-Type': 'text'});
    res.write(fs.readFileSync(`${__dirname}/index.ts`).toString('utf8'));
    res.end();
});

app.post('/', async (req, res) => {
    const data = (req?.files?.file as any)?.data;

    if (data == null) {
        send_fail(res, "No file.");
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

    try {
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
    
        await (instance.exports as any)?.main();

        if(solved) {
            send_success(res, FLAG);
        } else {
            send_fail(res, "Wrong answer.");
        }
    } catch(e) {
        send_fail(res, `${e}`);
    }
});

app.listen(PORT, () => {
    console.log(`WASM2 listening at http://localhost:${PORT}`)
});
