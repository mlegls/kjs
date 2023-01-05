// eval
import {s} from "./v.js";
import {execSync} from "node:child_process";
import fs from "node:fs";
const tr= f=> {try{return f()}catch(e){return e}};                  // try
const ft= async p=> await                                           // fetch text
  p.startsWith("http")? fetch(p).then(r=>r.text()): 
    fs.readFileSync(p, "utf8");
const sft= (p,f)=> fs.readFileSync(p, "utf8");                      // sync fetch text

const sym= /([~`!@#$%^&*()_\-+={}[\]|\\:;"'<,>?/\s])/g;             // symbols
const nl= /(\r?\n)/g;                                               // new line
const l= x=> x.split(sym).filter(e=>e!=="");                        // lex
const g= (t,c=0,b="")=> {                                           // group
  const m={"[":"]","(":")","{": "}",'"':'"'}, q=b==='"'; let r=[]
  while(c<t.length){
    let e=t[c]; if(e in m && !q){
      let [s,n]=g(t,c+1,m[e]); r.push([e,...s]); c=n;
    } else if(e===b){
      if(q&&t[c+1]==='"'){r.push('"');c+=2;continue;} return [r,c+1];
    } else{(b||q||!nl.test(e))&&r.push(t[c]); c++};} return r;
}
const sbd = x=> x.slice(1).join("");                                // string body

const e= async (t,ctx)=> {                                          // eval in context
  let l, lt;
  if(t[0]==="\\"){switch(t[1]){
    case "\\": return tr(()=>execSync(t.slice(2)                    // \\.. shell
      .join(""),(e,so,se)=>so??se??e).toString());
    default: return tr(()=>eval(t.slice(1).join("")));              // \.. js eval
  }}
/*
  if(t[1]===":")switch(t[0]){
    case "0": let o=await tr(()=>ft(sbd(t[2])));                       // 0:.. fetch lines
      return o instanceof Error? o: o.split(nl); break;
    case "1": return await tr(()=>ft(sbd(t[2])));                      // 1:.. fetch bytes
    default: return ctx[t[0]]= await e(t.slice(2),ctx); break;         // x:.. assign
  }
*/
  console.log(t); return "ok";
}

export const gk= async x=> await e(g(l(x)),globalThis);                                      // global
export const nk= async x=> await e(g(l(x)),{});                                              // new context
export const k= async (x,y)=> await e(g(l(x)),y);                                            // specific context

