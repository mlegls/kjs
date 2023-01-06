// eval
import * as v from "./v.js";
import {execSync} from "node:child_process";
import fs from "node:fs";
const tr= f=> {try{return f()}catch(e){return e}};                  // try
const ft= async p=> await                                           // fetch text
  p.startsWith("http")? fetch(p).then(r=>r.text()): 
    fs.readFileSync(p, "utf8");
const sft= (p,f)=> fs.readFileSync(p, "utf8");                      // sync fetch text

const sym= /([~`!@#$%^&*()_\-+={}[\]|\\:;"'<,>?/\s])/g;            // symbols
const adv= /^[\\/']$/;
const vb= /^[~!@#$%^&*_+\-=|<,>.?]$/;
const nl= /^\r?\n$/;                                                // new line
const num= /^\d+.?\d*$/;
const lx= x=> x.split(sym).filter(e=>e!=="");                        // lex
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
const tca= x=> [].concat(...tl(x).map(x=>x.split(""))); // to char array
const sep= Symbol("sep"); // generic seperator
const mm= Symbol("mm"); // make matrix
const ms= Symbol("ms"); // matrix seperator
const mtx= x=> {
  let b=[], o=[]
  for (let e of x){
    Array.isArray(e)? b.push(e[0]==='"'? tca(e): stk(tl(e))):
      num.test(e)? b.push(+e):
      e===";"? o.push(b.length>1? b: b[0])&&(b=[]):
      e!==" "&&o.push(e);
  } return o.push(b.length>1? b: b[0])&&o;
}
const stk= (t)=>{
  let o=[], s=[], pa=()=>{while(s.length)o.push(s.pop())},
    pa2=()=>{while(s.length&&s[s.length-1]!==":")o.push(s.pop())};
  for (let e of t){
    if (Array.isArray(e)){
      switch (e[0]){
        case '"': o.push(tca(e)); break;
        case "(": e.includes(";")? o.push(mtx(tl(e))): o=o.concat(...stk(tl(e))); break;
      }
    } else {
      num.test(e)? o.push(+e):
        vb.test(e)? o.push(sep)&&pa2()||s.push(e):
        adv.test(e)? pa2()||s.push(e):
        e===":"? o.push(sep)&&s.push(":"):
        e===";"? pa()||o.push(";"):
        o.push(e);
    } } o.push(sep); pa(); return o;
}

const md= (f,g,x,y)=> y===undefined? f(x): g(x,y);                   // monadic/dyadic

const op= {
  "+": (x,y)=> md(v.flp,v.add,x,y),
  "-": (x,y)=> md(v.neg,v.sub,x,y),
  "*": (x,y)=> md(v.fst,v.mul,x,y),
  "%": (x,y)=> md(v.srt,v.div,x,y),
}
const e= async (x,cx,gcx=undefined,c=0)=> {                 // eval in context
  let st=[],ls=false,lst=()=>st[st.length-1], 
    ar=()=>{let b=[];if(ls){
      while(st.length&&lst()!==sep){b.unshift(st.pop());}
      st.pop();st.push(b);ls=false}},
    p=()=>{while(st.length&&lst()===sep)st.pop();return st.pop()};
  gcx=gcx??cx;
  if(x[0]==="\\"){switch(x[1]){
    case "\\": return tr(()=>execSync(x.slice(2)                    // \\.. shell
      ,(e,so,se)=>so??se??e).toString());
    default: return tr(()=>console.log(eval(x.slice(1))));              // \.. js eval
  }} let t=stk(g(lx(x)));
/*
  if(t[1]===":")switch(t[0]){
    case "0": let o=await tr(()=>ft(sbd(t[2])));                       // 0:.. fetch lines
      return o instanceof Error? o: o.split(nl); break;
    case "1": return await tr(()=>ft(sbd(t[2])));                      // 1:.. fetch bytes
    default: return cx[t[0]]= await e(t.slice(2),cx); break;           // x:.. assign
  }
*/
  for(const e of t){
    // console.log(st); // debug
    typeof e==="number"? st.push(e):
      e===sep? ar()||st.push(e):
      typeof e==="symbol"? st.push(e):
      e===" "? ls=true:
      vb.test(e)? st.push(op[e](p(),p())):
      st.push(e);
  }
  // console.log(t); 
  return p();
}

export const gk= async x=> await e(x,globalThis);                                      // global
export const nk= async x=> await e(x,{});                                              // new context
export const k= async (x,y)=> await e(x,y);                                            // specific context

