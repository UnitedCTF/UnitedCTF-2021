import { Interpreter } from './interpreter';
import fs from 'fs';
import readlineSync from 'readline-sync';
import argparse from 'argparse';

function getInput(): string {
    return readlineSync.question('Enter: ');
}

let parser = new argparse.ArgumentParser({description: "CTFLang Interpreter."});

parser.add_argument('file', {help: "File to interpret."});
parser.add_argument('--debug', {help: 'Displays interpreter memory.', action: 'store_true'});
parser.add_argument('--delay', {help: 'Delay for verbose mode.', default: 10});

let args = parser.parse_args();

let code = fs.readFileSync(args.file).toString();

let interpreter = new Interpreter(code, getInput);

let loop = setInterval(() => {
    if(args.debug) {
        interpreter.visualize();
    }
    
    if(!interpreter.step()) { 
        clearInterval(loop);
        console.log(interpreter.output);
    }
}, (args.debug) ? args.delay : 0);
