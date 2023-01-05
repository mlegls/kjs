// eval
const p = x=> x.split(/([~`!@#$%^&*()_\-+={}[\]|\\:;"'<,>.?/\s])/g)
  .filter(e=>e!=="");
const e= x=>`nyi; cmd: ${p(x)}`;

module.exports = e;
