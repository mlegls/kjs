// k
{
const arrp= x=> Array.isArray(x);
const arrm= (h,t)=> arrp(t)? [h,...t]: [h,t]
}

E=e";"E/e
e=x:n f:v y:e {return {t:"vap2", f, x, y}}/t e/_
t=n/v
t1="{"E"}"/"("E")"/N/V // consuming
v=t1 A+/V
n=t1("["E"]")+/"{"arg?E"}"/"("E")"/N
arg="["h:N t:(";"v:N {return v})*"]" {return [h,...t]}
A=[\'/\\]/"':"/"/:"/"\:"
V=V1":"/V1
V1=[:+\-*%!&|<>=~,^#_$?@.]/D":"
N=Ss/St/Nms/Nums
Nms=Nm"."Nms/Nm
Nm=L(L/D)* {return {t:"name", v:text()}}
St='"'e:Cs'"' {return e} 
	/"0x"Bs {return parseInt(text(),16)}
Cs=h:C t:Cs {let o=arrm(h,t); return o.length===1? o[0]: o}/_
C="\\0"/"\\t"/"\\r"/'\\"'/"\\\\"/[^"]
Bs=H H Bs /_
Ss=h:S _ t:Ss {return arrm(h,t)}/S
S="`"v:Nm {return {t:"sym", v}}
	/ "`"v:St {return {t:"sym",v:v.join("") }}
	/ "`" {return {t:"sym",v:null}}
Nums=h:Num _ t:Nums {return arrm(h,t)} / Num
Num="-"?D+"."?D*("e""-"?D+)? {return +text()}

D=[0-9]
H=D/[a-f]
L=[A-Za-z]
_=[ \t\n\r]*
