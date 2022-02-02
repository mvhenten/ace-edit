// alert("hello");

const ace = require("ace-builds/src-noconflict/ace");

require("ace-builds/webpack-resolver");


const main = () => {
    const el = document.querySelector("#editor");


    console.log("Editor:", el);

    var editor = ace.edit(el);
    editor.setTheme("ace/theme/twilight");
    editor.session.setMode("ace/mode/javascript");

}

main();