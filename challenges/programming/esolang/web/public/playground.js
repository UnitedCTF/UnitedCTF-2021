let loop = null;
let code = null;
let input = null;

function setPlayIcon(buttonObj, isSet) {
    if(isSet) {
        buttonObj.classList.add("bi-play-fill");
        buttonObj.classList.remove("bi-stop-fill");
    } else {
        buttonObj.classList.remove("bi-play-fill");
        buttonObj.classList.add("bi-stop-fill");
    }
}

function resetPlayground(buttonObj) {
    setPlayIcon(buttonObj, true);

    let codeObj = document.querySelector("#code");
    let inputObj = document.querySelector("#input");
    let delayObj = document.querySelector("#delay");
    let stackObj = document.querySelector("#stacks");

    clearInterval(loop);
    loop = null;

    codeObj.value = code;
    codeObj.removeAttribute("readonly");

    inputObj.value = input;
    inputObj.removeAttribute("readonly");

    delayObj.removeAttribute("readonly");

    stackObj.value = "";
}

function handlePlayground(event) {
    let buttonObj = event.target;
    let codeObj = document.querySelector("#code");
    let inputObj = document.querySelector("#input");
    let outputObj = document.querySelector("#output");
    let stackObj = document.querySelector("#stacks");
    let delayObj = document.querySelector("#delay");

    if(loop != null) {
        resetPlayground(buttonObj);
        return;
    } else {
        code = codeObj.value;
        codeObj.setAttribute("readonly", "");
        input = inputObj.value;
        inputObj.setAttribute("readonly", "");
        delayObj.setAttribute("readonly", "");

        setPlayIcon(buttonObj, false);
    }

    let interpreter = new CTFLang.Interpreter(code, () => {
        let input = inputObj.value[0];
        inputObj.value = inputObj.value.substring(1);
        return input;
    });

    loop = setInterval(() => {
        try {
            let raw = interpreter.raw();
            let grid = raw.grid;
            let pointers = raw.pointers;
    
            pointers.forEach(pointer => grid[pointer.position[1]][pointer.position[0]] = '@');
    
            outputObj.value = interpreter.output;
            stackObj.value = pointers.map((pointer, i) => `${i}: ${pointer.stack.reverse().toString()}`).join('\n');
            codeObj.value = grid.map(row => row.join('')).join('\n');
    
            if(!interpreter.step()) {
                resetPlayground(buttonObj);
            }
        } catch {
            resetPlayground(buttonObj);
        }
    }, parseFloat(delayObj.value));
}
