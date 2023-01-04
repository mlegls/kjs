// tests
const assert = require("assert");
assert.deepStrictEqual(s([1, 2, 3]), [1, 2, 3]);
assert.deepStrictEqual(r([1, 2, 3], [4, 5, 6]), [4, 5, 6]);
assert.deepStrictEqual(add([1, 2, 3], [4, 5, 6]), [5, 7, 9]);
assert.deepStrictEqual(add([1, 2, 3], 4), [5, 6, 7]);
assert.deepStrictEqual(add(1, [4, 5, 6]), [5, 6, 7]);
assert.throws(() => add([1, 2, 3], [4, 5]), Error);
assert.deepStrictEqual(neg([1, 2, 3]), [-1, -2, -3]);
assert.deepStrictEqual(flp([1, 2, 3]), [[1, 2, 3]]);
assert.deepStrictEqual(flp([[1, 2], [3, 4]]), [[1, 3], [2, 4]]);
