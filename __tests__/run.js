const Eva = require('../Eva')
const Environment = require('../Environment');

const tests = [
    require('./self-eval-test'),
    require('./variable-test'),
    require('./math-test'),
    require('./block-test')
]

const eva = new Eva(new Environment({
    null: null,
    true: true,
    false: false,
    VERSION: '0.1'
}));

tests.forEach(test => test(eva))


console.log('All Expression passed')