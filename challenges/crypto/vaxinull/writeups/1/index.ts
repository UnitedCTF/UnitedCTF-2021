import axios from 'axios';
import jsQR from 'jsqr';
import Jimp from 'jimp';
import { Solution } from "../utils";
import { SHC } from '../../src/shc';

const URL = "http://localhost:4200/samples/1";

export class Solve extends Solution {
    public async solve() {
        let data = (await axios.get(URL)).data;
        
        let qrcodeRegex = /alt="qrcode" src="(.*?)"/.exec(data);

        if(!qrcodeRegex) throw "Unable to find QRCode.";

        let qrcodeUri = qrcodeRegex[1];
        let qrcodeImg = await Jimp.read(Buffer.from(qrcodeUri.split(',')[1], 'base64'));
        let qrcodeRaw = new Uint8ClampedArray(qrcodeImg.bitmap.data.buffer);

        let qrcode = jsQR(qrcodeRaw, qrcodeImg.bitmap.width, qrcodeImg.bitmap.height);

        if(!qrcode) throw "Unable to decode QRCode.";

        let shc = SHC.fromString(qrcode.data);

        console.log(shc.body.name.given);
    }
}
