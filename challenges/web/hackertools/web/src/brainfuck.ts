/**
 * Code taken from: https://gist.github.com/meenie/6b9bdce4e6b12cf8362ce9deb8f82ed4
 */

/**
 * Brainfuck Interpreter.
 */
export class Brainfuck {
    ptr: number = 0
    cmdPtr: number = 0
    data: number[] = [0]
    output: any[] = []
    loops: number[] = []
    input: string = "";
    arg: string = "";
    argPtr: number = 0;

    go(input: string, arg: string) {
        this.input = input;
        this.arg = arg;
        this.output = [];

        while (this.cmdPtr < this.input.length) {
            this.command(this.input[this.cmdPtr]);
            this.cmdPtr++;
        }

        return this.output.join('');
    }

    private command(cmd: string) {
        switch (cmd) {
            case ',':
                this.data[this.ptr] = (this.arg.charCodeAt(this.argPtr) || -1);
                this.argPtr++;

                break;
            case '.':
                this.output.push(String.fromCharCode(this.data[this.ptr]))

                break;
            case '+':
                this.data[this.ptr]++;

                break;
            case '-':
                this.data[this.ptr]--;

                break;
            case '>':
                this.ptr++;

                if (typeof this.data[this.ptr] === 'undefined') {
                    this.data[this.ptr] = 0;
                }

                break;
            case '<':
                if (this.ptr > 0) {
                    this.ptr--;
                }

                break;
            case '[':
                if (this.data[this.ptr] === 0) {
                    let loopDepth = 0;
                    for (let i = this.cmdPtr; i < this.input.length; i++) {
                        if (this.input[i] === ']') {
                            if (--loopDepth === 0) {
                                this.cmdPtr = i;

                                break;
                            }
                        } else if (this.input[i] === '[') {
                            loopDepth++;
                        }
                    }
                } else {
                    this.loops.push(this.cmdPtr);
                }

                break;
            case ']':
                if (this.data[this.ptr] === 0) {
                    this.loops.pop();
                } else {
                    this.cmdPtr = this.loops[this.loops.length - 1];
                }

                break;
        }
    }
}
