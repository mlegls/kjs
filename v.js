// util
const a= x=> null==x || !x.length || typeof x=="string";                            // atom?
const b= x=> +x;                                                                    // bool to int
const c= x=> typeof x=="string"? x.charCodeAt(0): x;                                // char arithmetic
const cmp= (x,y)=> (x>y)-(x<y)                                                      // compare
const cp2= (x,y)=> [].concat(...x.map(a=> y.map(b=>[].concat(a,b))));               // pairwise cartesian product
const cp= (x,y,...z)=> (y? cp(cp2(x,y),...z): x);                                   // cartesian product
const t= x=> x[0].map((c,i)=> x.map(r=>r[i]));                                      // transpose
const vv= x=> a(x)? [x]: x;                                                         // vectorize
const vv2= x=> a(x)? [[x]]: x.map(e=>vv(e));                                        // vectorize 2 layers
const bv1= (f,x)=> a(x)? f(x): x.map(n=>bv1(f,n));                                  // broadcast monadic
const bv= (f,x,y)=>                                                                 // broadcast
  a(x)&&a(y)? f(x,y):                                                               //
    a(x)? y.map(n=>bv(f,x,n)):                                                      //
    a(y)? x.map(n=>bv(f,n,y)):                                                      //
    // x.length==1? y.map(n=>bv(f,x[0],n)):   //unbased
    // y.length==1? x.map(n=>bv(f,n,y[0])):
    x.length==y.length? x.map((n,i)=>bv(f,n,y[i])):                                 //
    (()=> {throw new Error("length")})();                                           //
const sv= (f,x)=>                                                                   // js string op
  bv1(x=>typeof x=="string"? x.split(""): x, f(x.join("")));                        //
const c2s = x=> {                                                                   // consecutive chars to strings
  let res=[], buf=[], pb= ()=>buf.length&&res.push(buf.join("")),                   //
    pe= e=>{pb(); buf=[]; res.push(e);}                                             //
  x.forEach(e=> !e.length || typeof e=="string"&&e.length>1?                        //
    pe(e): e.length==1? buf.push(e): pe(c2s(e))); pb();                             //
  return res.map(e=> e.length==1&&typeof e[0]=="string"? e[0]: e);                  //
}
const eq= (x,y)=> x===y || !a(x) && x.length==y.length                              // deep equality
  && vv(x).every((e,i)=> eq(e, y[i]));                                              //
const fl= x=> a(x)? x: [].concat(...x.map(e=> a(e)? e: fl(e)));                     // flatten
const z= (x,y)=> x.map((e,i)=> [e,y[i]]);                                           // zip

// adverbs
const ec= f=> x=> x.map(f);                                                         // '
const ec2= f=> y=> x=> x.map(e=>f(e,y));                                            // '
const bin= x=> y=> bv1(e=>{                                                         // X'
  for(let i=0; i<x.length; i++){if(e<x[i])return i-1;} return x.length-1;           //
},y);                                                                               //
const rd= f=> y=> x=> y===undefined? x.reduce(f): x.reduce(f, y)                    // /
const jn= (x,y)=> sv(y=>y.join(x), y);                                              // /
const dec= (x,y) => {                                                               // /
  let r=0, n=1;                                                                     //
  for (let i=x.length-1; i>=0; i--) {r+=y[i]*n; n*=x[i];} return r;                 //
}
const fr= f=> n=> x=> {for(let i=0; i<n; i++)x=f(x); return x;}                     // i f/
const wl= f=> g=> x=> {while(g(x))x=f(x); return x;}                                // f f/
const cvg= f=> x=> {                                                                // f/
  let a=f(x), b; while (!eq(a,b)&&!eq(a,x)) {b=a; a=f(a);} return a;                //
}                                                                                   //
const sc= f=> y=> x=> x.map(e=>y=y===undefined? e: f(y,e));                         // \
const sp= (x,y)=> sv(y=>y.split(x), y);                                             // \
const enc= (x,y)=> x.reverse()                                                      // \
  .reduce((a,b)=>{a.unshift(y%b);y=Math.floor(y/b);return a;},[]);                  //
const fsc= f=> n=> x=> {                                                            // i f\
  let a=[x]; for(let i=0; i<n; i++){x=f(x);a.push(x)}; return a;                    //
}                                                                                   //
const wsc= f=> g=> x=> {                                                            // f f\
  let a=[x]; while(g(x)){x=f(x);a.push(x);} return a;                               //
}                                                                                   //
const csc= f=> x=> {                                                                // f\
  let a=f(x), r=[x,a], b; while(!eq(a,b)&&!eq(a,x)){b=a; a=f(a); r.push(a);}        //
  return r;                                                                         //
}                                                                                   //
const ecr= f=> (x,y)=> y.map(e=>f(e,x));                                            // /:
const ecl= f=> (x,y)=> x.map(e=>f(e,y));                                            // \:
const st= f=> n=> x=> x.reduce((a,_,i,r)=> i+n>r.length? a:                         // i f':
  a.concat([f(r.slice(i,i+n))]),[]);                                                //
const wd= n=> x=> st(x=>x)(n)(x);                                                   // i':
const ecp= f=> y=> x=>                                                              // ':
  z(x, [y===undefined? null: y,...x]).map(e=>f(e[0],e[1]));

// verbs
const s= x=> x;                                                                     // ::
const r= (x,y)=> y;                                                                 // :
const flp= x=> t(vv2(x))                                                            // +
const add= (x,y)=> bv((x,y)=>c(x)+c(y), x, y);                                      // +
const neg= x=> x.map(n => -n);                                                      // -
const sub= (x,y)=> bv((x,y)=>c(x)-c(y), x, y);                                      // -
const fst= x=> x[0];                                                                // *
const mul= (x,y)=> bv((x,y)=>x*y, x, y);                                            // iI*iI, not defined for chars
const srt= x=> bv1(x=>Math.sqrt(x), x)                                              // %
const div= (x,y)=> bv((x,y)=>x/y, x, y);                                            // iI%iI, not defined for chars
const od= v=> cp(...vv(v).map(n => [...Array(n).keys()]));                          // !iI, would be +! in ngn/k
const k= Object.keys;                                                               // !
const nsk= x=> x.map(e=> Object.keys(e));                                           // !, ns
const d= (x,y)=> Object.fromEntries(x.map((k,i)=> [k,y[i]]));                       // !
const dm= (x,y)=> x>0? y%x: Math.floor(y/x);                                        // i!I, div or mod
const wh= x=> [].concat(...vv(x).map((e,i)=> e.length? [wh(e)]: Array(e).fill(i))); // &
const min= (x,y)=> bv((x,y)=>Math.min(x,y), x, y);                                  // &
const rev= x=> vv(x).reverse();                                                     // |
const max= (x,y)=> bv((x,y)=>Math.max(x,y), x, y);                                  // |
const asc= x=> [...vv(x).keys()].sort((a,b)=> cmp(x[a],x[b]));                      // <
const lt= (x,y)=> bv((x,y)=>b(x<y), x, y);                                          // <
// nyi file/web open & close
const dsc= x=> [...vv(x).keys()].sort((a,b)=> -cmp(x[a],x[b]));                     // >
const gt= (x,y)=> bv((x,y)=>b(x>y), x, y);                                          // >
const umt= x=> [...Array(x).keys()]                                                 // =i, unit matrix
  .map(i=> [].concat(Array(i).fill(0), 1, Array(x-i-1).fill(0)));                   //
const grp= x=> vv(x).reduce((t,e)=>{t[e]? t[e]++: t[e]=1; return t;}, {});          // =
const eql= (x,y)=> bv((x,y)=>b(x===y), x, y);                                       // =
const not= x=> bv1(x=>b(!x), x);                                                    // ~
const mch= (x,y)=> b(eq(x,y));                                                      // ~
const enl= x=> [x];                                                                 // ,
const cat= (x,y)=> x.concat(...y);                                                  // ,
const nul= x=> bv1(x=>b(null==x), x);                                               // ^
const fll= (x,y)=> bv1(y=> null==y? x: y, y);                                       // ^
const wo = (x,y)=> x.filter(e=> !vv(y).includes(e))                                 // ^
const l= x=> x.length;                                                              // #
const tk= (x,y)=> x>0? y.slice(0,x): y.slice(x);                                    // #
const dtk= (x,y)=> bv1(x=> y[x], x);                                                // #
const rs= (x,y)=> {                                                                 // #
  let s=vv(x).slice(), l=rd((x,y)=>!y? x: x*y)(vv(s)),                              //
    a=fl(vv(y)), ll=a.length, r=Array(l), t, i=s.indexOf(null);                     //
  if(i>=0){s[i]=Math.ceil(ll/(l=l||1)); l*=s[i];}                                   //
  for(let c=0; c<l; c++)r[c]=a[c%ll];                                               //
  for(let i=s.length-1; i>=0; i--){                                                 //
    const j=s[i]; t=[];                                                             //
    for(let k=0; k<r.length/(j||1); k++)t.push(r.slice(k*j,(k+1)*j)); r=t;          //
  } return r[0]||[];                                                                //
}                                                                                   //
const rep= (f,y)=> {                                                                // #
  let x=f(y), s=x.length===y.length? x: bv1(f, y);                                  //
  return [].concat(...s.map((e,i)=> Array(b(e)).fill(y[i])));                       //
}
const flr= x=> bv1(x=>Math.floor(x), x);                                            // _
const lcs= x=> bv1(x=>x.toLowerCase(), x);                                          // _
const drp= (x,y)=> x>0? y.slice(x): y.slice(0,x)                                    // _
const del= (x,y)=> x.slice(0,y).concat(x.slice(y+1||x.length));                     // _, like tk, drp for y<0
const cut= (x,y)=> x.map((e,i)=>y.slice(e,x[i+1]||y.length));                       // _
const flt= (f,y)=> y.filter(!f);                                                    // _
const str= x=> bv1(x=>x.toString(), x);                                             // $
const pad= (x,y)=> sv(x=>x>0? y.padEnd(x): y.padStart(-x),x)                        // $
const cst= (x,y)=>                                                                  // $
  x==="c"? String.fromCharCode(y):                                                  //
    x==="i"? sv(parseInt, y): x==="f"? sv(parseFloat, y):                           //
    x==="`"? y.join(""): x==="s"? y.split(""):                                      //
    (()=> {throw new Error("invalid type")})();                                     //
const unq= x=> [...new Set(vv(x))];                                                 // ?
const fnd= (x,y)=> bv1(x=>y.indexOf(x), x);                                         // ?
const uni= x=> {let r=[]; while(r.length<x)r.push(Math.random()); return r;}        // ?
const rnd= (x,y)=> {                                                                // ?
  let r=[]; while(r.length<Math.abs(x)){                                            //
    let n=Math.floor(Math.random()*y); if(x>0||!r.includes(n))r.push(n);            //
  } return r;                                                                       //
}                                                                                   //
const cal= (x,y)=> typeof x==="function"?x(y): x[y];                                // @
const apl= (x,y)=> typeof x==="function"?x(...y): x(...y);                          // .
const vls= x=> Object.values(x);                                                    // .
const get= (x,y)=> x[y];                                                            // .
const typ= x=> typeof x;                                                            // .

// multi-adic
const amd= (x,y,f)=> {let r=x.slice();r[y]=f(r[y]);return r}                        // @
const am2= (x,y,f,z)=> {let r=x.slice();r[y]=f(r[y],z);return r}                    // @
const drl= (x,y,f)=> {                                                              // .
  let r=x.slice(), a=y.slice(0,-1).reduce((e,i)=>e[i],r);                           //
  a[y[y.length-1]]=f(a[y[y.length-1]]); return r;                                   //
}                                                                                   //
const dr2= (x,y,f,z)=> {                                                            // .
  let r=x.slice(), a=y.slice(0,-1).reduce((e,i)=>e[i],r);                           //
  a[y[y.length-1]]=f(a[y[y.length-1]],z); return r;                                 //
}                                                                                   //
const tr= (f,y,g)=> {try {return f(y)} catch(e) {return g(e)}}                      // .
const spl= (x,y,z)=> x.slice(0,y[0]).concat(z).concat(x.slice(y[1]))                // ?


export {
  ec, rd, jn, dec, sc, sp, enc, ecp, ecr, ecl, 
  fr, fsc, wl, wsc, cvg, csc, wd, st, bin,
  s, r, flp, neg, add, sub, fst, mul, srt, div, od, k, nsk, d, dm, 
  wh, min, rev, max, asc, lt, dsc, gt, grp, umt, eql, not, mch, enl, cat, 
  nul, fll, wo, l, tk, dtk, rs, rep, flr, lcs, drp, del, cut, flt, 
  str, pad, cst, unq, rnd, fnd, cal, apl, amd, am2, drl, dr2, tr, spl
}
