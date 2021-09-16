function too_slow() {
    document.querySelector('.gif').src = "./public/too_slow.gif";
    document.querySelector('.title').innerHTML = "Too Slow";
    document.querySelector('.text').innerHTML = "The flag is gone. Refresh the page and try again."
}

WebAssembly.instantiateStreaming(
    fetch('/challenge.wasm'), 
    { 
        imports: { 
            too_slow 
        }
    }
).then(obj => { 
    obj.instance.exports.main();
});