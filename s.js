// scratch

var cond= x=> {
  for (let i=0; i<x.length; i+=2) {
    if (x[i]) return x[i+1]
  } return x[x.length-1]
}

cond([false,3,true,2,false,1,5])
