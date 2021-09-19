import axios from 'axios';
import qs from 'qs';
import { Solution } from "../utils";
import { SHC } from '../../src/shc';
import { JWK } from '../../src/jws';

const URL = "http://localhost:4200/samples/3";

export class Solve extends Solution {
    public async solve() {
        let jwks = (await axios.get(`${URL}/.well-known/jwks.json`)).data;
        let jwk = new JWK(jwks['keys'][0]);

        let shc = new SHC(
            {
                "alg": "ES256",
                "kid": jwk.kid,
                "zip": "DEF"
            }, 
            {
                "iss": URL,
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

        let regex = /(FLAG-.*?)</.exec(data);

        if(regex) {
            console.log(regex[1]);
        } else {
            console.log("FAIL:", data);
        }
    }
}
