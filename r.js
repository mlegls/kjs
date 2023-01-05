#!/usr/bin/env node
import {gk} from "./e.js";
import f from "fs";
import * as readline from "node:readline";
import {stdin as input,stdout as output} from "node:process";

const rl= readline.createInterface({input, output});
const r= async i=> f.readFile(i,"utf8",async (e,d)=>console.log(e ?? await gk(d)),await repl());
const repl= async ()=> rl.question("> ",async i=>i==="\\\\"? 
  rl.close(): (console.log(await gk(i)),await repl()));

switch(process.argv.length){
  case 2: await repl(); break;
  case 3: await r(process.argv[2]); break;
  default: console.log("Usage: r.js [file]"),process.exit(64);
}
