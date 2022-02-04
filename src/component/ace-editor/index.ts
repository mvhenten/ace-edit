// alert("hello");

const ace = require("ace-builds/src-noconflict/ace");
require("ace-builds/webpack-resolver");

export const createEditor = (targetDomNode:HTMLElement) => {
    var editor = ace.edit(targetDomNode);
    editor.setTheme("ace/theme/twilight");
    editor.session.setMode("ace/mode/javascript");
}

main();