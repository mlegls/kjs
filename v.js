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
const eq= (x,y)=> x===y || !a(x) && x.length==y.length                   // deep equality
  && vv(x).every((e,i)=> eq(e, y[i]));

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
  grp, umt, eql, not, mch
};
