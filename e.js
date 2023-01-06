// eval
import {s} from "./v.js";
import {execSync} from "node:child_process";
import fs from "node:fs";
const tr= f=> {try{return f()}catch(e){return e}};                  // try
const ft= async p=> await                                           // fetch text
  p.startsWith("http")? fetch(p).then(r=>r.text()): 
    fs.readFileSync(p, "utf8");
const sft= (p,f)=> fs.readFileSync(p, "utf8");                      // sync fetch text

const sym= /([~`!@#$%^&*()_\-+={}[\]|\\:;"'<,>?/\s])/g;            // symbols
const adv= /^[\\/']$/;
const vb= /^[~!@#$%^&*_+\-=|;<,>.?]$/;
const nl= /^\r?\n$/;                                                // new line
const num= /^\d+.?\d*$/;
const l= x=> x.split(sym).filter(e=>e!=="");                        // lex
const g= (t,c=0,b="")=> {                                           // group
  const m={"[":"]","(":")","{": "}",'"':'"'}, q=b==='"'; let r=[]
  while(c<t.length){
    let e=t[c]; if(e in m && !q){
      let [s,n]=g(t,c+1,m[e]); r.push([e,...s]); c=n;
    } else if(e===b){
      if(q&&t[c+1]==='"'){r.push('"');c+=2;continue;} return [r,c+1];
    } else{(q||!b||!nl.test(e))&&r.push(t[c]); c++};} return r;
}
// 0: _    1:  `A   2:  `i,  3: `f 
// 4: `c   5:  `s   6:  `m   7: `o 
// 5: `p   6:  `q   7:  `r   8: `u 
// 9: `v   10: `w   11: `x   12: .
const tl= x=> x.slice(1);                                // tail
const stk= t=>{
  let o=[], s=[], ts=[]
  for (let e of t){
    if (Array.isArray(e)){
      switch (e[0]){
        case '"': o.push(tl(e).join("")); break;
        case "(": o=o.concat(...stk(tl(e))); break;
      }
    } else {
      num.test(e)? o.push(+e):
        vb.test(e)? s.push(e) && o.push("[SEP]"):
        adv.test(e)? s.push(e):
        o.push(e);
    } 
  } 
  while(s.length){o.push(s.pop());} return o;
}


const e= async (x,cx,gcx=undefined,c=0)=> {                 // eval in context
  let l,o; gcx=gcx??cx;
  if(x[0]==="\\"){switch(x[1]){
    case "\\": return tr(()=>execSync(x.slice(2)                    // \\.. shell
      ,(e,so,se)=>so??se??e).toString());
    default: return tr(()=>console.log(eval(x.slice(1))));              // \.. js eval
  }} let t=stk(g(x));
/*
  if(t[1]===":")switch(t[0]){
    case "0": let o=await tr(()=>ft(sbd(t[2])));                       // 0:.. fetch lines
      return o instanceof Error? o: o.split(nl); break;
    case "1": return await tr(()=>ft(sbd(t[2])));                      // 1:.. fetch bytes
    default: return cx[t[0]]= await e(t.slice(2),cx); break;           // x:.. assign
  }
*/
  console.log(t); return "ok";
}

export const gk= async x=> await e(x,globalThis);                                      // global
export const nk= async x=> await e(x,{});                                              // new context
export const k= async (x,y)=> await e(x,y);                                            // specific context

