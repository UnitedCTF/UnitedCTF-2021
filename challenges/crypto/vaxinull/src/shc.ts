import { IJWKAlg, JWK, JWS } from "./jws";
import { Base64, Gzip } from "./utils";

interface IHeader {
    "zip": "DEF",
    "alg": IJWKAlg,
    "kid": string
}

interface IBody {
    "iss": string,
    "name": {
        "given": string,
        "family": string
    },
    "vaccinated": boolean
}

export class SHC {
    private static readonly OFFSET = 45;

    public header: IHeader;
    public body: IBody;
    public signature?: string;

    public constructor(header: IHeader, body: IBody, signature?: string) {
        this.header = header;
        this.body = body;
        this.signature = signature;
    }

    public static fromJWT(jwt: string): SHC {
        let jwtSplit = jwt.split(".");

        if(jwtSplit.length != 3) throw `Invalid JWT section length of ${jwtSplit.length}.`;
        
        let parsedHeader = JSON.parse(Base64.decode(jwtSplit[0]));
        let parsedBody = JSON.parse(Gzip.decompress(jwtSplit[1]));
        let parsedSignature: string | undefined = jwtSplit[2];

        if(parsedSignature === '') parsedSignature = undefined;

        return new SHC(parsedHeader, parsedBody, parsedSignature);
    }

    public static fromString(shc: string): SHC {
        if(!shc) throw "No `shc`.";

        if(shc.startsWith("shc:/")) shc = shc.split("/")[1];

        let matches = shc.match(/(..?)/g);

        if(!matches) throw "Unable to parse SHC";

        let shcDecoded = matches.map(n => String.fromCharCode(parseInt(n, 10) + SHC.OFFSET)).join("");

        return SHC.fromJWT(shcDecoded);
    }

    public toJWTData(): string {
        let encodedHeader = Base64.encode(JSON.stringify(this.header));
        let encodedBody = Gzip.compress(JSON.stringify(this.body));

        return `${encodedHeader}.${encodedBody}`;
    }

    public toJWT(): string {
        let encodedSignature = "";
        if(this.signature) encodedSignature = this.signature;

        return `${this.toJWTData()}.${encodedSignature}`;
    }
    
    public toString(): string {
        let jwt = this.toJWT();
        let jwtEncoded = jwt.split("").map(char => (char.charCodeAt(0) - SHC.OFFSET).toString().padStart(2, "0")).join("");

        return `shc:/${jwtEncoded}`;
    }

    public sign(key: JWK) {
        this.header.kid = key.kid;
        this.signature = new JWS(key).sign(this.toJWTData());
    }

    public verify(key: JWK): boolean {
        return new JWS(key).verify(this.toJWTData(), this.signature || "");
    }
}