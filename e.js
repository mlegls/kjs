// eval
import {s} from "./v.js";
import {execSync} from "node:child_process";
import fs from "node:fs";
const tr= f=> {try{return f()}catch(e){return e}};                  // try
const ft= async p=> await                                           // fetch text
  p.startsWith("http")? fetch(p).then(r=>r.text()): 
    fs.readFileSync(p, "utf8");
const sft= (p,f)=> fs.readFileSync(p, "utf8");                      // sync fetch text

const l= x=> x.split(/([~`!@#$%^&*()_\-+={}[\]|\\:;"'<,>.?/\s])/g)  // lex
  .filter(e=>e!=="");
// group brackets, quotes
const g= (t,c=0,b="")=> {
  const m = {"[": "]", "(": ")", "{": "}", '"': '"'}; let r=[]
  while(c<t.length){
    if (t[c] in m && b!=='"'){
      let [s,n] = g(t,c+1,m[t[c]]); r.push([t[c],...s]); c=n;
    }else if(t[c]===b){
      if(b==='"'&&t[c+1]==='"'){r.push('"');c+=2;continue;}
      return [r,c+1];
    } else {r.push(t[c]); c++}; } return r;
}
const sbd = x=> x.slice(1).join("");                                // string body

const e= async (t,ctx)=> {                                          // eval in context
  if(t[0]==="\\"&&t[1]==="\\")return tr(()=>execSync(t.slice(2)       // \\.. shell
    .join(""),(e,so,se)=>so??se??e).toString());
  if(t[0]==="\\")return tr(()=>eval(t.slice(1).join("")));            // \.. js eval
/*
  if(t[1]===":")switch(t[0]){
    case "0": let o=await tr(()=>ft(sbd(t[2])));                       // 0:.. fetch lines
      return o instanceof Error? o: o.split(/\r?\n/); break;
    case "1": return await tr(()=>ft(sbd(t[2])));                      // 1:.. fetch bytes
    default: return ctx[t[0]]= await e(tk.slice(2),ctx); break;          // x:.. assign
  }
*/
  console.log(t); return "ok";
}

export const gk= async x=> await e(g(l(x)),globalThis);                                      // global
export const nk= async x=> await e(g(l(x)),{});                                              // new context
export const k= async (x,y)=> await e(g(l(x)),y);                                            // specific context

