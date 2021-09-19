import fs from 'fs';
import express from 'express';
import qrcode from 'qrcode';
import { JWK, privateJWKS, publicJWKS } from './jws';
import { SHC } from './shc';
import axios from 'axios';

interface IChallengeJWKS {
    [key: string]: {
        visibility: "public" | "private",
        jwk: JWK
    }
}

const CHALLENGE_JWKS: IChallengeJWKS = {
    '1': {
        visibility: "public",
        jwk: JWK.generate("EC", "P-256")
    },
    '2': {
        visibility: "public",
        jwk: JWK.generate("EC", "P-256")
    },
    '3': {
        visibility: "private",
        jwk: JWK.generate("EC", "P-256")
    }
};

interface ISHCChallenges {
    [key: string]: {
        title: string,
        prompt: string
    }
}

const SHC_CHALLENGES: ISHCChallenges = {
    '2': {
        title: "Alg",
        prompt: "We offer multiple <code>alg</code> for JWS validation. This offers a wide range of valid key formats. You can request an SHC with a custom key and <code>alg</code> at <a href=\"mailto:todo@todo.todo\">todo@todo.todo</a>. You can try your SHC in the input box below."
    },
    '3': {
        title: "JWKS",
        prompt: "We offer a JWK key in <a href=\"/samples/3/.well-known/jwks.json\">/.well-known/jwks.json</a>. All JWKS we provide are <b>always only public</b> for safety. You can request a custom key at <a href=\"mailto:todo@todo.todo\">todo@todo.todo</a>. You can try your generated SHCs in the input box below."
    },
    '4': {
        title: "ISS",
        prompt: "We allow restricted external <code>iss</code> validation. This allows for a third-party like yourself to sign JWKs! You can request to be added to the list at <a href=\"mailto:todo@todo.todo\">todo@todo.todo</a>. You can try your generated SHCs in the input box below."
    }
};

const PORT = process.env.PORT || 4200;

const app = express();

app.use(express.urlencoded({
    extended: true
}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

function getISS(req: express.Request): string {
    return `${req.protocol}://${req.hostname}:${PORT}${req.path}`;
}

function readFlag(index: string | number): string {
    return fs.readFileSync(`./challenges/${index}/FLAG`).toString('utf8');
}

app.get('/', (req, res) => {
    res.render('index');
});

app.get(`/samples/:id/.well-known/jwks.json`, (req, res) => {
    if(!(req.params.id in CHALLENGE_JWKS)) throw "Unknown sample id.";
    
    let cjwk = CHALLENGE_JWKS[req.params.id];
    let func = cjwk.visibility === 'public' ? publicJWKS : privateJWKS;

    res.send(func(cjwk.jwk));
});

app.get('/samples/1/', async (req, res) => {
    let jwk = CHALLENGE_JWKS['1'].jwk;

    let shc = new SHC({
        alg: jwk.alg,
        kid: jwk.kid,
        zip: "DEF"
    }, {
        iss: getISS(req),
        name: {
            given: readFlag(1),
            family: ""
        },
        vaccinated: false
    });

    shc.sign(jwk);

    let qr = await qrcode.toDataURL(shc.toString());

    res.render('qr', { qrcode: qr });
});

app.get('/samples/:id/', async (req, res) => {
    if(!parseInt(req.params.id)) throw "Non-numeric index.";
    if(!('2' in SHC_CHALLENGES)) throw "Not a challenge.";

    res.render('shc', { ...SHC_CHALLENGES[req.params.id] });
})

function validateSHC(shc?: string): SHC {
    if(!shc) throw "No `shc` param.";
    if(!shc.startsWith("shc:/")) throw "No `shc:/` header.";
    if(!parseInt(shc.substring(5))) throw "Non-numeric SHC body.";
    if(shc.length % 2 == 0) throw "Incorrect SHC size.";

    let shcObj: SHC;

    try {
        shcObj = SHC.fromString(shc);
    } catch(err) {
        throw `Something went wrong when decoding your SHC: ${err}.`;
    }

    if(!shcObj.header.alg) throw "No `alg` field in header.";
    if(!shcObj.header.kid) throw "No `kid` field in header.";
    if(!shcObj.header.zip) throw "No `zip` field in header.";
    if(shcObj.header.zip !== 'DEF') throw "`zip` should be `DEF`";

    if(!shcObj.body.iss) throw "No `iss` field in body.";
    if(!shcObj.body.name) throw "No `name` field in body.";
    if(!shcObj.body.name.given) throw "No `name.given` in body.";
    if(!shcObj.body.name.family) throw "No `name.family` in body.";
    if(!shcObj.body.vaccinated) throw "No `vaccinated` field in body.";

    return shcObj;
}

function getMsgFormat(shc: SHC, index: string | number): string {
    return `${shc.body.name.given} ${shc.body.name.family} | ${readFlag(index)}`;
}

app.post('/samples/2/', async (req, res) => {
    let jwk = CHALLENGE_JWKS['2'].jwk;
    let iss = getISS(req);

    try {
        let shc = validateSHC(req.body.shc);

        if(shc.body.iss !== iss) throw `\`iss\` should be \`${iss}\`.`;
        if(shc.header.alg !== 'none' && !shc.verify(jwk)) throw "Invalid SHC signature.";
        if(!shc.body.vaccinated) throw "Not vaccinated.";

        res.render('shc', { ...SHC_CHALLENGES['2'], type: 'success', msg: getMsgFormat(shc, 2) });
    } catch(err) {
        res.render('shc', { ...SHC_CHALLENGES['2'], type: 'error', msg: err })
    }
});

app.post('/samples/3/', async (req, res) => {
    let jwk = CHALLENGE_JWKS['3'].jwk;
    let iss = getISS(req);

    try {
        let shc = validateSHC(req.body.shc);

        if(shc.body.iss !== iss) throw `\`iss\` should be \`${iss}\`.`;
        if(shc.header.kid !== jwk.kid) throw `\`kid\` not found in JWKS.`;
        if(shc.header.alg !== 'ES256') throw "\`alg\` should be \`ES256\`.";
        if(!shc.verify(jwk)) throw "Invalid SHC signature.";
        if(!shc.body.vaccinated) throw "Not vaccinated.";

        res.render('shc', { ...SHC_CHALLENGES['3'], type: 'success', msg: getMsgFormat(shc, 3) });
    } catch(err) {
        res.render('shc', { ...SHC_CHALLENGES['3'], type: 'error', msg: err })
    }
});

app.post('/samples/4/', async (req, res) => {
    try {        
        let shc = validateSHC(req.body.shc);

        let jwks = (await axios.get(shc.body.iss + '/.well-known/jwks.json')).data;

        if(jwks instanceof String) throw "Invalid response type.";
        if(!jwks.keys) throw "Invalid JWKS format.";

        let jwkRaw = jwks.keys.find((key: any) => key.kid === shc.header.kid);

        if(!jwkRaw) throw `\`kid\` not found in JWKS.`;

        let jwk = new JWK(jwkRaw);

        if(jwk.isPrivate()) throw "JWK is private.";
        if(shc.header.alg !== 'ES256') throw "\`alg\` should be \`ES256\`.";
        if(!shc.verify(jwk)) throw "Invalid SHC signature.";
        if(!shc.body.vaccinated) throw "Not vaccinated.";

        res.render('shc', { ...SHC_CHALLENGES['4'], type: 'success', msg: getMsgFormat(shc, 4) });
    } catch(err) {
        res.render('shc', { ...SHC_CHALLENGES['4'], type: 'error', msg: err })
    }
});

app.listen(PORT, () => {
    console.log(`VaxiNull listening at http://localhost:${PORT}`);
});
