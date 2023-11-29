const assert = require('assert');

const Environment = require('./Environment');

class Eva {

    constructor(global = new Environment()) {
        this.global = global;
    }    

    eval(exp, env = this.global) {
        if (isNumber(exp)) {
            return exp;
        }
        if (isString(exp)) {
            return exp.slice(1, -1);
        }
        // math operation
        if (exp[0] === '+') {
            return this.eval(exp[1], env) + this.eval(exp[2], env);
        }
        if (exp[0] === '-') {
            return this.eval(exp[1], env) - this.eval(exp[2], env);
        }
        if (exp[0] === '/') {
            return this.eval(exp[1], env) / this.eval(exp[2], env);
        }
        if (exp[0] === '*') {
            return this.eval(exp[1], env) * this.eval(exp[2], env);
        }

        if(exp[0] === 'begin') {
            const blockEnv = new Environment({}, env)
            return this._evalBlock(exp, blockEnv);
        }

        // variable declaration
        if (exp[0] === 'var') {
            const [_, name, value] = exp;
            // evaluate before assign to variable
            return env.define(name, this.eval(value, env));
        }

        // variable update
        if(exp[0] == 'set') {
            const [_, name, value] = exp;
            return env.assign(name, this.eval(value, env));
        }

        // variable access
        if (isVariableName(exp)) {
            return env.lookup(exp);
        }
        throw `Unimplemented: ${JSON.stringify(exp)}`;
    }

    _evalBlock(block, blockEnv) {
        let result;

        const [_tag, ...expressions] = block;

        expressions.forEach(exp => {
            result = this.eval(exp, blockEnv);
        });

        return result;
    }
}

function isNumber(exp) {
    return typeof exp === 'number';
}

function isString(exp) {
    return typeof exp === 'string' && exp[0] === '"' && exp.slice(-1) === '"';
}

function isVariableName(exp) {
    return typeof exp === 'string' && /^[a-zA-Z][a-zA-Z0-9_]*$/.test(exp);
}


// -------------------------------------------------
// Tests:

const eva = new Eva(new Environment({
    null: null,
    true: true,
    false: false,

    VERSION: '0.1'
}));

assert.strictEqual(eva.eval(1), 1);
assert.strictEqual(eva.eval('"Hello"'), 'Hello');

// Math:
assert.strictEqual(eva.eval(['+', 1, 5]), 6);
assert.strictEqual(eva.eval(['*', 4, 5]), 20);
assert.strictEqual(eva.eval(['+', 1, ['*', 3, 5]]), 16);
assert.strictEqual(eva.eval(['-', 1, ['/', 4, 2]]), -1);

// Variables:
assert.strictEqual(eva.eval(['var', 'x', 10]), 10);
assert.strictEqual(eva.eval('x'), 10);

assert.strictEqual(eva.eval('VERSION'), '0.1');


assert.strictEqual(eva.eval(
    ['begin',
        ['var', 'x', 10],
        ['var', 'y', 20],

        ['+', ['*', 'x', 'y'], 30]
    ]
), 230);

assert.strictEqual(eva.eval(
    ['begin',
        ['var', 'x', 10],
        ['begin', ['var', 'x', 20], 'x'],
        'x'
    ]
), 10);

assert.strictEqual(eva.eval(
    ['begin',
        ['var', 'value', 10],
        ['var', 'result', ['begin', ['var', 'x', ['+', 'value', 10]], 'x']],
        'result'
    ]
), 20);

assert.strictEqual(eva.eval(
    ['begin',
        ['var', 'data', 10],
        ['begin', ['set', 'data', 100], ],
        'data'
    ]
), 100);

console.log('All Expression passed')