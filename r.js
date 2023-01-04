#!/usr/bin/env node

// repl
const rl = require("readline").createInterface({
  input: process.stdin, output: process.stdout,
});
const repl= ()=> rl.question("> ", i=>i==="\\\\"? 
  rl.close(): (console.log(`"cmd ${i}"`),repl()));

repl();
