// k
{
// util
const nump= x=> typeof x==='number'
const strp= x=> typeof x==='string'
const arrp= x=> Array.isArray(x)
const funp= x=> typeof x==='function'

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
    // x.length==1? y.map(n=>bv(f,x[0],n)):   // unbased
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
const ecr= f=> y=> x=> y.map(e=>f(e,x));                                            // /:
const ecl= f=> y=> x=> x.map(e=>f(e,y));                                            // \:
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
const neg= x=> bv1(x=>-x, x);                                                       // -
const sub= (x,y)=> bv((x,y)=>c(x)-c(y), x, y);                                      // -
const fst= x=> Array.isArray(x)? x[0]: x;                                                                // *
const mul= (x,y)=> bv((x,y)=>x*y, x, y);                                            // iI*iI, not defined for chars
const srt= x=> bv1(x=>Math.sqrt(x), x)                                              // %
const div= (x,y)=> bv((x,y)=>x/y, x, y);                                            // iI%iI, not defined for chars
const od= v=> cp(...vv(v).map(n => [...Array(n).keys()]));                          // !iI, would be +! in ngn/k
const k= Object.keys;                                                               // !
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
const cat= (x,y)=> x.concat(y);                                                  // ,
const nul= x=> bv1(x=>b(null==x), x);                                               // ^
const fll= (x,y)=> bv1(y=> null==y? x: y, y);                                       // ^
const wo = (x,y)=> x.filter(e=> !vv(y).includes(e))                                 // ^
const l= x=> a(x)? 1: x.length;                                                     // #
const tk= (x,y)=> x>0? y.slice(0,x): y.slice(x);                                    // #
const dtk= (x,y)=> bv1(x=> y[x], x);                                                // #
const rs= (x,y)=> {                                                                 // #
  let s=vv(x).slice(), l=rd((x,y)=>!y? x: x*y)()(vv(s)),                            //
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
const apl= (x,y)=> typeof x==="function"?x(...y): vv(y).map(e=>x[e]);               // .
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

const vbs= {
  "+": [flp, add], "-": [neg, sub], "*": [fst, mul], "%": [srt, div],
  "&": [wh, min], "|": [rev, max], "<": [asc, lt], ">": [dsc, gt],
  "~": [not, mch], ",": [enl, cat], 
  "=": [x=>nump(x)? umt(x): grp(x), eql],
  "!": [x=>nump(x)||arrp(x)? od(x): k(x), (x,y)=>nump(x)&&nump(y)? dm(x,y): d(x,y)],
  "^": [nul,(x,y)=>arrp(x)&&arrp(y)? wo(x,y): fll(x,y)],
  "#": [l,(x,y)=>funp(x)? rep(x,y): arrp(x)||x>=0? rs(x,y): x<=0? tk(x,y): dtk(x,y)],
  "_": [x=>nump(x)? flr(x): lcs(x), (x,y)=> nump(x)&&arrp(y)? drp(x,y): 
    nump(y)&&arrp(x)? del(y,x): arrp(x)? cut(x,y): flt(x,y)],
  "$": [str,(x,y)=>nump(x)&&strp(y)?pad(x,y):cst(x,y)], 
  "?": [x=>nump(x)?uni(x):unq(x),(x,y)=>nump(x)? rnd(x,y): fnd(x,y)],
  "@": [typ,cal], ".": [vls,(x,y)=>funp(x)?apl(x,y):get(x,y)],
}
const advs = {
  "'": ec, "/": rd, "\\": sc, "/:": ecr, "\\:": ecl, "':": ecp
}

const ctx={v:1};
const lst= x=> x[x.length-1];
const udfp= x=> x===undefined;
const bd= x=> arrp(x)&&udfp(lst(x))? x.slice(0,-1): x
const arrm= (h,t)=> arrp(t)? [h,...t]: [h,t];
const atmz= x=> x.length===1? x[0]: x

const name= Symbol("name")
const exp= Symbol("exp")
const asgn = Symbol(":")
const namp= x=> x.t===name
const expp= x=> x.t===exp
const resp= x=> !namp(x)&&!expp(x) // resolved

const gfn= (x,y)=> x.t=="vb"? vbs[x.v][y]:
	x.t="e"? gfn(x.v, y): x;
const tev2= (f,x,y)=> {
	if (f===asgn) return ctx[x.v]=bd(y)
	return resp(y)?
	f.t==="drv"? f.v(x)(y): f[1](x,y):
	{t:"dyad", f: (arrp(f)? f[1]: f.v), x, y:bd(y)}
}
const tev1= (f,x)=> {
  if (f===asgn) return x
  return resp(x)?
  f.t==="drv"? f.v()(x): f[0](x):
  {t:"monad", f: (arrp(f)? f[0]: f.v), x}
}

const sarr= x=> {let r=[]; for(let i=0;!udfp(x.tl);i++)
	r.push(x.h),(x=x.tl); return r.push(x.v),r;}

const bapl= (f,v)=> {
	if (arrp(f)) return apl((x,y)=>udfp(y)?f[0](x):f[1](x,y),sarr(v[0]))
}
}
P= 	a:(v:E Cmt?"\n" {return v})+ {return lst(a).v}
E= 	h:e ";" tl:E {return {t:";", h, tl}}
	/ v:e {return {t:"e", v:bd(v)}} 
e=	x:n _ f:v _ y:e {return tev2(f,x,y)}
	/ h:n _ tl:e {return udfp(tl)? h: {t:"monad", h, tl}}
	/ h:v _ tl:e {return udfp(tl)? h: tev1(h,tl)}
    / _ {return undefined}
nt=	"{"(a:arg? {return a??["x","y","z"]})E"}"
	/"("v:E")" {return v}
    /N // consuming
v=	x:V f:A+ {return {t:"drv", v:f.reduce((f,a)=>a(f), x[1])}}
	/ x:nt f:A+ {return {t:"drv", f, x}}
	/ V
n=	f:(nt/v) v:("["e:E"]" {return e})+ {return {t:"argl", f, vs:sarr(v[0]), v:bapl(f,v)}}
	/ "{"a:arg?v:E"}" {return {t:"lamd", a, v}}
    / "("v:E")" {return {t:"paren", v}}
    / N
arg="["h:N t:(";"v:N {return v.v})*"]" {return [h.v,...t]}

A=	v:(a:[/\'\\]!":" {return a} 
	/ "':" / "/:" / "\\:") {return advs[v]}
V=	v:V1":" {return v[0]} 
	/ v:V1 {return strp(v)? vbs[v]: v} 
    / ":" {return asgn}
V1=	D":" {return {t:"opcode", v:text()}} 
	/ v:[+\-*%!&|<>=~,^#_$?@.] {return vbs[v]}

N=	Ss/St/Nms/Ns
Nms=h:(v:Nm"." {return v})+t:Nms {return {t:".", x:h, y:t}} / Nm
Nm=	L(L/D)* {let v=text(); return !udfp(ctx[v])? ctx[v]: {t:name, v}}
St=	'"'e:Cs'"' {return bd(e)} 
	/"0x"e:Bs {return bd(e)}
Cs=	h:C t:Cs {return atmz(arrm(h,t))} 
	/ _ {return undefined}
C=	"\\0"/"\\t"/"\\r"/'\\"'/"\\\\"/[^"]
Bs=	h:(H H {return parseInt(text(),16)}) t:Bs {return atmz(arrm(h,t))} 
	/_ {return undefined}
Ss=	h:S _ t:Ss {return arrm(h,t)} 
	/ S
S=	"`"v:(Nm {return text()}) {return {t:"sym", v}}
	/ "`"v:St {v=v.join(""); return {t:"sym", v}}
    / "`" {return {t:"sym", v:null}}
Ns=	h:Num _ t:Ns {return arrm(h,t)} 
	/ Num 
Num="-"?D!":"+"."?D*("e""-"?D+)? {return +text()}

D=[0-9]
H=D/[a-f]
L=[A-Za-z]
_=[ \t\r]* {return undefined}
Cmt="/"[^\n]* {return undefined}

