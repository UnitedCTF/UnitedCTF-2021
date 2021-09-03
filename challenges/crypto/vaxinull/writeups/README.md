# Writeups

Writeups are included part of the main `package.json`. You can run a writeup using:

```
npm run writeup #
```

Additionally, I recommend to look how I implemented the SHC `/src/shc.ts` and JWS `/src/jws.ts`. It is the bare-minimum required to get SHCs working.

## 1 - QR

You can read the QR code using any cellphone. For thoroughness, I used node.js libs to read the QR Code (definitely not worth the extra time). This will yield an `shc:/*`, which is an encoded/compressed JWT string. Given the large interest in SHC when the VaxiCode app was released, there are various PoCs that were released to read the content. You can skip to that directly, but you'll probably prefer writing your own to be able to reverse it.

### SHC Decode

You can decode the SHC data (any JS):

```javascript
let shc = "SHC_HERE";

let jwt = shc.split('/')[1].match(/(..)/g).map(h => String.fromCharCode(parseInt(h, 10) + 45)).join("");
```

This will give a string JWT, which follows a `header.body.signature` structure. The head is just base64 encoded (Web JS):

```javascript
let header = JSON.parse(atob(jwt.split(".")[0]));
```

The body is Gzip compressed. You can use `zlib` to decompress the data (Node JS):

```javascript
import zlib from 'zlib';

let body = JSON.parse(zlib.inflateRawSync(Buffer.from(jwt.split(".")[1], "base64url")).toString("utf8"));
```

### Solution

You can read the flag in `body.name.given`.

## 2 - Alg

If you look online, you will see mention of `"alg": "none"`. I implemented it in a way to just ignore the signature (in other words, you can pass literally anything and get a valid JWT). Therefore, it's just a matter of changing the header/body from the previous problem to `"iss": "http://url.to.challenge/path"`, `vaccinated": "true"`, and `"alg": "none"`. You can follow the reverse steps and not include the signature and SHC that will drop the flag.

## 3 - JWKS

The challenge provides the private key `d` in the `/.well-known/jwks.json`. This can be used to forge a signature. The following scripts can be used to sign data (where you would pass the `b64_head.b64_compressed_body`) (Node JS):

```javascript
import elliptic from 'elliptic';

function sign(data) {
    let key = new EC("p256");

    let keyPair = key.keyFromPrivate(
        Buffer.from("B64_D_HERE", 'base64url')
    );

    let signature = keyPair.sign(data);

    let r = signature.r.toBuffer().toString("base64url");
    let s = signature.s.toBuffer().toString("base64url");

    return `${r}${s}`;
}
```

If you append the previous as `b64_head.b64_compressed_body.signature` and convert to SHC, you get the flag.

## 4 - ISS

Same strategy as previous problem but now you have to host JWKS. You can point the JWT to your host with `"iss": "http://your.url"` and it will cause an "SSRF" to get the `/.well-known/jwks.json` (of course, not exposing the private key `d`). Given you know the `d`, you can "forge" a JWT then convert to SHC and submit it like last problem and get the flag.

If you managed to get here, you'd essentially be able to bypass the early version of `VaxiCode Verif`! 
   