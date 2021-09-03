/**
 * Wrapper for writeup ts.
 */

import { Solution } from "./utils";

const SOLUTIONS: { [key: string]: Solution } = {
    '1': new (require('./1/index') as any).Solve(),
    '2': new (require('./2/index') as any).Solve(),
    '3': new (require('./3/index') as any).Solve(),
    '4': new (require('./4/index') as any).Solve()
}

const TARGET_WRITEUP = process.argv[2];

if(!(TARGET_WRITEUP in SOLUTIONS)) throw `Unknown writeup "${TARGET_WRITEUP}".`;

let solution = SOLUTIONS[TARGET_WRITEUP];

solution.solve();
