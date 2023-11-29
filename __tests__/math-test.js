const assert = require('assert');

module.exports = eva => {
    assert.strictEqual(eva.eval(['+', 1, 5]), 6);
    assert.strictEqual(eva.eval(['*', 4, 5]), 20);
    assert.strictEqual(eva.eval(['+', 1, ['*', 3, 5]]), 16);
    assert.strictEqual(eva.eval(['-', 1, ['/', 4, 2]]), -1);
}