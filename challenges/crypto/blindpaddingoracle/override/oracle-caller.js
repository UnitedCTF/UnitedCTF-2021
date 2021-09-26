"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const got_1 = __importDefault(require("got"));
const ow_1 = __importDefault(require("ow"));
const lodash_1 = require("lodash");
const cache_1 = __importDefault(require("./cache"));
const util_1 = require("./util");
const constants_1 = require("./constants");
function getHeaders(headersArg, addPayload) {
    if (!headersArg)
        return {};
    const headersArr = (() => {
        if (Array.isArray(headersArg))
            return headersArg;
        if (typeof headersArg === 'object')
            return util_1.arrayifyHeaders(headersArg);
        return [headersArg];
    })();
    const headers = {};
    for (const _header of headersArr) {
        ow_1.default(_header, 'header', ow_1.default.string);
        const header = addPayload(_header);
        const index = header.indexOf(':');
        if (index < 1)
            throw TypeError(`Invalid header: ${header}`);
        const name = index > 0 ? header.slice(0, index).trim() : header;
        headers[name] = header.slice(index + 1).trimLeft();
    }
    return headers;
}
const POPAYLOAD = '{POPAYLOAD}';
const injectionRegex = new RegExp(POPAYLOAD, 'ig');
const OracleCaller = (options) => {
    const { url: _url, requestOptions = {}, transformPayload, isCacheEnabled = true } = options;
    ow_1.default(_url, 'url', ow_1.default.string);
    if (transformPayload)
        ow_1.default(transformPayload, ow_1.default.function);
    ow_1.default(requestOptions, ow_1.default.object);
    ow_1.default(requestOptions.method, ow_1.default.optional.string);
    if (requestOptions.headers)
        ow_1.default(requestOptions.headers, ow_1.default.any(ow_1.default.object, ow_1.default.string, ow_1.default.array));
    ow_1.default(requestOptions.data, ow_1.default.optional.string);
    const { method, headers, data } = requestOptions;
    const injectionStringPresent = !_url.includes(POPAYLOAD)
        && !String(typeof headers === 'object' ? JSON.stringify(headers) : headers).includes(POPAYLOAD)
        && !(data || '').includes(POPAYLOAD);
    const networkStats = { count: 0, lastDownloadTime: 0, bytesDown: 0, bytesUp: 0 };
    async function callOracle(payload) {
        const payloadString = transformPayload ? transformPayload(payload) : payload.toString('hex');
        const addPayload = str => (str ? str.replace(injectionRegex, payloadString) : str);
        const url = (injectionStringPresent ? _url + payloadString : addPayload(_url));
        const customHeaders = getHeaders(headers, addPayload);
        const body = addPayload(data);
        const cacheKey = [url, JSON.stringify(customHeaders), body].join('|');
        if (isCacheEnabled) {
            const cached = await cache_1.default.get(cacheKey);
            if (cached)
                return Object.assign({ url }, cached);
        }
        const response = await (require("node-fetch"))(url, {
            throwHttpErrors: false,
            method: "GET",
          }).then(async r => ({
            statusCode: r.status,
            headers: r.headers,
            body: await r.text()
          })); /*await got_1.default(url, {
            throwHttpErrors: false,
            method,
            headers: Object.assign({ 'user-agent': constants_1.DEFAULT_USER_AGENT }, customHeaders),
            body
        });*/
        networkStats.count++;
        /*networkStats.lastDownloadTime = response.timings.phases.total;
        networkStats.bytesDown += response.socket.bytesRead || 0;
        networkStats.bytesUp += response.socket.bytesWritten || 0;*/
        const result = lodash_1.pick(response, ['statusCode', 'headers', 'body']);
        if (isCacheEnabled)
            await cache_1.default.set(cacheKey, result);
        return Object.assign({ url }, result);
    }
    return { networkStats, callOracle };
};
exports.default = OracleCaller;
//# sourceMappingURL=oracle-caller.js.map