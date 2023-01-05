#!/usr/bin/env node
const {gk} = require("./e.js");
const f = require("fs");
const rl= require("readline").createInterface({
  input: process.stdin, output: process.stdout,
});
const r= i=> f.readFile(i,"utf8",(e,d)=> console.log(e ?? gk(d)), repl());
const repl= ()=> rl.question("> ", i=>i==="\\\\"? 
  rl.close(): (console.log(gk(i)),repl()));

switch(process.argv.length){
  case 2: repl(); break;
  case 3: r(process.argv[2]); break;
  default: console.log("Usage: r.js [file]"),process.exit(64);
}
