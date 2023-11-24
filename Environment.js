class Environment {
    constructor(record = {}) {
        this.record = record;
    }

    // create variable name with given name and value
    define(name, value) {
        this.record[name] = value;
        return value;
    }

    lookup(name) {
        if (!this.record.hasOwnProperty(name)) {
            throw new ReferenceError(`Variable "${name}" is not defined. `)
        }
        return this.record[name];
    }
}

module.exports = Environment;