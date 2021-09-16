import { ec as EC } from 'elliptic';
import { Base64 } from './utils';
import hashjs from 'hash.js';

export type IJWKAlg = "ES256" | "none";
export type IJWKCurve = "P-256"; 

export interface IBaseJWK {
    kty: "EC",
    kid: string,
    use: "enc" | "sig",
    crv: IJWKCurve,
    alg: IJWKAlg
}

export interface IPublicJWK extends IBaseJWK {
    x: string,
    y: string
}

export interface IPublicJWKS {
    keys: IPublicJWK[]
}

export interface IPrivateJWK extends IBaseJWK {
    d: string
}

export interface IPrivateJWKS {
    keys: IPublicJWK[]
}

export class JWK {
    private key: IPublicJWK | IPrivateJWK;

    public constructor(key: IPublicJWK | IPrivateJWK) {
        this.key = key;
    }

    public get x() {
        return Base64.toBase64Url(this.getKeyPair().getPublic().getX().toBuffer().toString("base64"));
    }

    public get y() {
        return Base64.toBase64Url(this.getKeyPair().getPublic().getY().toBuffer().toString("base64"));
    }

    public get kid() {
        return this.key.kid;
    }

    public get alg() {
        return this.key.alg;
    }

    public isPrivate(): boolean {
        return 'd' in this.key;
    }

    public raw() {
        let rawKey = {
            ...this.key,
            x: this.x,
            y: this.y
        }

        return JSON.parse(JSON.stringify(rawKey));
    }

    private static getKeyBase(crv: string): EC {
        return new EC(crv.replace('-', '').toLowerCase());
    }

    public getKeyPair(): EC.KeyPair {
        let key = JWK.getKeyBase(this.key.crv);

        if(this.isPrivate()) {
            return key.keyFromPrivate(
                Buffer.from(Base64.fromBase64Url((this.key as IPrivateJWK).d), 'base64')
            );
        } else {
            return key.keyFromPublic({
                x: Buffer.from(Base64.fromBase64Url((this.key as IPublicJWK).x), 'base64'),
                y: Buffer.from(Base64.fromBase64Url((this.key as IPublicJWK).y), 'base64'),
            } as any);
        }
    }

    public recalculateKid() {
        this.key.kid = Base64.toBase64Url(Buffer.from(hashjs.sha256().update(JSON.stringify({
            crv: this.key.crv,
            kty: this.key.kty,
            x: this.x,
            y: this.y
        })).digest()).toString("base64"));
    }

    public static generate(kty: "EC", crv: IJWKCurve): JWK {
        let key = JWK.getKeyBase(crv);

        let keyPair = key.genKeyPair();

        let jwk = new JWK({
            kty,
            kid: 'new',
            use: 'sig',
            crv,
            alg: 'ES256',
            d: Base64.toBase64Url(keyPair.getPrivate().toBuffer().toString("base64"))
        });

        jwk.recalculateKid();

        return jwk;
    }
}

export function publicJWKS(jwk: JWK): IPublicJWKS {
    let rawJWK = jwk.raw();

    delete rawJWK.d;

    return {
        keys: [
            rawJWK
        ]
    }
}

export function privateJWKS(jwk: JWK): IPrivateJWKS {
    return {
        keys: [
            jwk.raw()
        ]
    }
}

export class JWS {
    private key: JWK;

    public constructor(key: JWK) {
        this.key = key;
    }

    public sign(data: string): string {
        if(!this.key.isPrivate()) throw "Cannot sign with public key.";

        let keyPair = this.key.getKeyPair();

        let signature = keyPair.sign(data);

        let r = Base64.toBase64Url(signature.r.toBuffer().toString("base64"));
        let s = Base64.toBase64Url(signature.s.toBuffer().toString("base64"));

        return `${r}${s}`;
    }

    public verify(data: string, signature: string): boolean {
        let keyPair = this.key.getKeyPair();

        let r = signature.substring(0, 43);
        let s = signature.substring(43);

        return keyPair.verify(data, {
            r: Buffer.from(Base64.fromBase64Url(r), 'base64'),
            s: Buffer.from(Base64.fromBase64Url(s), 'base64')
        });
    }
}