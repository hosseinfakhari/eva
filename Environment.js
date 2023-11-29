class Environment {
    constructor(record = {}, parent = null) {
        this.record = record;
        this.parent = parent;
    }

    // create variable name with given name and value
    define(name, value) {
        this.record[name] = value;
        return value;
    }

    assign(name, value) {
        return this.resolve(name).record[name] = value;
    }

    lookup(name) {
        return this.resolve(name).record[name];
    }

    resolve(name) {
        if (this.record.hasOwnProperty(name)) {
            return this;
        }
        if (this.parent == null) {
            throw new ReferenceError(`Variable "${name}" is not defined. `)
        }
        return this.parent.resolve(name);
    }
}

module.exports = Environment;