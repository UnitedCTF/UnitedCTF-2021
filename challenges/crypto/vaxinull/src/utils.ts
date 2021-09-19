import zlib from 'zlib';

export class Base64 {
    public static isBase64(data: string): boolean {
        return /[A-Za-z\-_]*/g.test(data);
    }

    public static toBase64Url(b64: string): string {
        return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
    }

    public static fromBase64Url(b64: string): string {
        b64 = b64.replace(/-/g, "+").replace(/_/g, "/");

        let missingPadding = b64.length % 4;

        return b64 + new Array(4 - missingPadding).fill("=").join("");
    }

    public static encode(data: string | Buffer): string {
        if(typeof data === 'string') data = Buffer.from(data);

        return Base64.toBase64Url(data.toString("base64"));
    }

    public static decode(data: string): string {
        if(/[-_]/.test(data)) data = Base64.fromBase64Url(data);

        return Buffer.from(data, "base64").toString("utf8");
    }
}

export class Gzip {
    public static compress(data: string): string {
        return Base64.toBase64Url(zlib.deflateRawSync(Buffer.from(data)).toString("base64"));
    }

    public static decompress(data: string): string {
        return zlib.inflateRawSync(Buffer.from(data, "base64")).toString("utf8");
    }
}
