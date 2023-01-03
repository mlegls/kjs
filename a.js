// alt, js string as k string ; js Symbol as k symbol?
const a = x => null == x || !x.length || typeof x == "string" && x.length == 1;  // atom
const vv = x => !a(x) ? typeof x == "string" ? x.split("") : x : [x];            // vectorize
const bv1 = (f, x) => a(x) ? f(x) : vv(x).map(n => bv1(f, n));                   // broadcast monadic
const bv = (f, x, y) =>                                                          // broadcast
  a(x) && a(y) ? f(x, y) :
    a(x) ? vv(y).map(n => bv(f, x, n)) :
    a(y) ? vv(x).map(n => bv(f, n, y)) :
    x.length == 1 ? vv(y).map(n => bv(f, x[0], n)) :
    y.length == 1 ? vv(x).map(n => bv(f, n, y[0])) : 
    x.length == y.length ? vv(x).map((n, i) => bv(f, n, y[i])) :
    (() => {throw new Error("length")})()
