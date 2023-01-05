// eval

// lex
const l = x=> x.split(/([~`!@#$%^&*()_\-+={}[\]|\\:;"'<,>.?/\s])/g)
  .filter(e=>e!=="");
// eval in context
const k= (x,ctx)=>`nyi; cmd: ${l(x)}`;

const gk= x=> k(x,globalThis);
const nk= x=> k(x,{}); // new context

module.exports = {k, gk, nk};
