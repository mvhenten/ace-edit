// alert("hello");

// const ace = require("ace-builds/src-noconflict/ace");

// require("ace-builds/webpack-resolver");

import { createLayout } from "./component/layout";
// import { createEditor } from "./component/ace-editor";

const hostElement = () => {
    const el = document.querySelector("body");

    if (!el) throw new Error("Missing dom element!");
    return el;
}



const main = () => {


    createLayout(hostElement);


    // console.log("Editor:", el);

    // var editor = ace.edit(el);
    // editor.setTheme("ace/theme/twilight");
    // editor.session.setMode("ace/mode/javascript");

}

main();