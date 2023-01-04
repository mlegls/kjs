// util
const a= x=> null==x || !x.length || typeof x=="string";                 // atom?
const b= x=> +x;                                                         // bool to int
const c= x=> typeof x=="string"? x.charCodeAt(0): x;                     // char arithmetic
const cmp= (x,y)=> (x>y)-(x<y)                                           // compare
const cp2= (x,y)=> [].concat(...x.map(a=> y.map(b=>[].concat(a,b))));    // pairwise cartesian product
const cp= (x,y,...z)=> (y? cp(cp2(x,y),...z): x);                        // cartesian product
const t= x=> x[0].map((c,i)=> x.map(r=>r[i]));                           // transpose
const vv= x=> a(x)? [x]: x;                                              // vectorize
const vv2= x=> a(x)? [[x]]: x.map(e=>vv(e));                             // vectorize 2 layers
const bv1= (f,x)=> a(x)? f(x): x.map(n=>bv1(f,n));                       // broadcast monadic
const bv= (f,x,y)=>                                                      // broadcast
  a(x)&&a(y)? f(x,y):
    a(x)? y.map(n=>bv(f,x,n)):
    a(y)? x.map(n=>bv(f,n,y)):
    x.length==1? y.map(n=>bv(f,x[0],n)):
    y.length==1? x.map(n=>bv(f,n,y[0])): 
    x.length==y.length? x.map((n,i)=>bv(f,n,y[i])):
    (()=> {throw new Error("length")})()
const str = x=> {                                                         // consecutive chars to strings
  let res=[], buf=[], pb= ()=>buf.length&&res.push(buf.join("")),
    pe= e=>{pb(); buf=[]; res.push(e);}
  x.forEach(e=> !e.length || typeof e=="string"&&e.length>1? pe(e): 
    e.length==1? buf.push(e): pe(str(e))); pb(); return res;
}
const eq= (x,y)=> x===y || !a(x) && x.length==y.length                    // deep equality
  && vv(x).every((e,i)=> eq(e, y[i]));
const fl= x=> a(x)? x: [].concat(...x.map(e=> a(e)? e: fl(e)));           // flatten

// operators
const rd= f=> (x,y=undefined)=> y===undefined? x.reduce(f): x.reduce(f, y)  // /
const sc= f=> (x,y=undefined)=> x.map(e=>y=y===undefined? e: f(y,e));       // \

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
const dm= (x,y)=> x<0? Math.floor(y/x): y%x;                                        // i!I, div or mod
const wh= x=> [].concat(...vv(x).map((e,i)=> e.length? [wh(e)]: Array(e).fill(i))); // &
const min= (x,y)=> bv((x,y)=>Math.min(x,y), x, y);                                  // &
const rev= x=> vv(x).reverse();                                                     // |
const max= (x,y)=> bv((x,y)=>Math.max(x,y), x, y);                                  // |
const asc= x=> [...vv(x).keys()].sort((a,b)=> cmp(x[a],x[b]));                      // <
const lt= (x,y)=> bv((x,y)=>b(x<y), x, y);                                          // <
const dsc= x=> [...vv(x).keys()].sort((a,b)=> -cmp(x[a],x[b]));                     // >
const gt= (x,y)=> bv((x,y)=>b(x>y), x, y);                                          // >
// nyi < and > as open & close http handles
const umt= x=> [...Array(x).keys()]                                                 // =i, unit matrix
  .map(i=> [].concat(Array(i).fill(0), 1, Array(x-i-1).fill(0)));
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
  let s=vv(x).slice(), l=rd((x,y)=>!y? x: x*y)(vv(s)), 
    a=fl(vv(y)), ll=a.length, r=Array(l), t, i=s.indexOf(null);
  if (i>=0) {s[i]=Math.ceil(ll/(l=l||1)); l*=s[i];}
  for (let c=0; c<l; c++) r[c]=a[c%ll];
  for (let i=s.length-1; i>=0; i--) {
    const j=s[i]; t=[];
    for (let k=0; k<r.length/(j||1); k++) t.push(r.slice(k*j,(k+1)*j)); r=t;
  } return r[0] || [];
}
const rep= (f,y)=> {                                                                // #
  let x=f(y), s=x.length===y.length? x: bv1(f, y);                                  
  return [].concat(...s.map((e,i)=> Array(b(e)).fill(y[i])));
}
const flr= x=> bv1(x=>Math.floor(x), x);                                            // _
const lcs= x=> bv1(x=>x.toLowerCase(), x);                                          // _
const drp= (x,y)=> x>0? y.slice(x): y.slice(0,x)                                    // _
const del= (x,y)=> x.slice(0,y).concat(x.slice(y+1||x.length));                     // _, like tk, drp for y<0
const cut= (x,y)=> x.map((e,i)=>y.slice(e,x[i+1]||y.length));                       // _
const flt= (f,y)=> y.filter(!f);                                                    // _

const assert = require("assert");
assert.deepStrictEqual(s([1, 2, 3]), [1, 2, 3]);
assert.deepStrictEqual(r([1, 2, 3], [4, 5, 6]), [4, 5, 6]);
assert.deepStrictEqual(add([1, 2, 3], [4, 5, 6]), [5, 7, 9]);
assert.deepStrictEqual(add([1, 2, 3], [4]), [5, 6, 7]);
assert.deepStrictEqual(add([1], [4, 5, 6]), [5, 6, 7]);
assert.throws(() => add([1, 2, 3], [4, 5]), Error)
assert.deepStrictEqual(neg([1, 2, 3]), [-1, -2, -3]);
assert.deepStrictEqual(flp([1, 2, 3]), [[1, 2, 3]]);
assert.deepStrictEqual(flp([[1, 2], [3, 4]]), [[1, 3], [2, 4]]);

module.exports = {
  s, r, flp, neg, add, sub, fst, mul, srt, div, 
  od, k, nsk, d, dm, wh, min, rev, max, asc, lt, dsc, gt,
  grp, umt, eql, not, mch, enl, cat, nul, fll, wo, l, tk, dtk, rs, rep,
  flr, lcs, drp, del, cut, flt
};
