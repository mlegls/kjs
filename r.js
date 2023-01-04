#!/usr/bin/env node
// repl
const ev= require("./e.js");
const f = require("fs");
const rl= require("readline").createInterface({
  input: process.stdin, output: process.stdout,
});
const r= i=> f.readFile(i,"utf8",(e,d)=> e? console.log(e): console.log(ev(d)));
const repl= ()=> rl.question("> ", i=>i==="\\\\"? 
  rl.close(): (console.log(ev(i)),repl()));

switch(process.argv.length){
  case 2: repl(); break;
  case 3: r(process.argv[2]); break;
  default: console.log("Usage: r.js [file]");
}
