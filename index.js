'use strict';
const datas = require("./src/main");
let indexing = new datas();

module.exports = {
    version: require("./package.json").version,
    set: function(key, value) {
        return indexing.set(key, value);
    },
    get: function(key) {
        return indexing.get(key);
    },
    delete: function(key) {
        return indexing.delete(key);
    },
    has: function(key) {
        return indexing.has(key);
    },
    toJSON: function(limit) {
        return indexing.toJSON(limit);
    },
    add: function(key, value) {
        return indexing.add(key, value);
    },
    fetch: function(key) {
        return indexing.fetch(key);
    },
    all: function(limit = 0) {
        return indexing.all(limit);
    },
    size: function() {
        return indexing.size();
    },
    push: function(key, value) {
        return indexing.push(key, value);
    },
    on: function(key, callback) {
        return indexing.on(key, callback);
    },

    create: function(path, maxlimit = 0) {
        const createuse = new indexing.create(path, maxlimit);
        this.set = function(key, value) {
            return createuse.set(key, value);
        }
        this.get = function(key) {
            return createuse.get(key);
        }
        this.delete = function(key) {
            return createuse.delete(key);
        }
        this.has = function(key) {
            return createuse.has(key);
        }
        this.toJSON = function(limit) {
            return createuse.toJSON(limit);
        }
        this.add = function(key, value) {
            return createuse.add(key, value);
        }
        this.fetch = function(key) {
            return createuse.fetch(key);
        }
        this.all = function(limit = 0) {
            return createuse.all(limit);
        }
        this.size = function() {
            return createuse.size();
        }
        this.push = function(key, value) {
            return createuse.push(key, value);
        }
        this.on = function(key, callback) {
            return createuse.on(key, callback);
        }
    },

    cipher: function(path, maxlimit = 0, SECRET_KEY) {
        const cipheruse = new indexing.cipher(path, maxlimit, SECRET_KEY);
        this.set = function(key, value) {
            return cipheruse.set(key, value);
        }
        this.get = function(key) {
            return cipheruse.get(key);
        }
        this.delete = function(key) {
            return cipheruse.delete(key);
        }
        this.has = function(key) {
            return cipheruse.has(key);
        }
        this.toJSON = function(limit) {
            return cipheruse.toJSON(limit);
        }
        this.add = function(key, value) {
            return cipheruse.add(key, value);
        }
        this.fetch = function(key) {
            return cipheruse.fetch(key);
        }
        this.all = function(limit = 0) {
            return cipheruse.all(limit);
        }
        this.size = function() {
            return cipheruse.size();
        }
        this.encryptAll = function() {
            return cipheruse.encryptAll();
        }
        this.decryptAll = function() {
            return cipheruse.decryptAll();
        }
        this.push = function(key, value) {
            return cipheruse.push(key, value);
        }
        this.on = function(key, callback) {
            return cipheruse.on(key, callback);
        }
    },

    mongodb: function(url, logger, timeout) {
        const mongodbuse = new indexing.mongodb(url, logger, timeout);
        this.set = async function(key, value) {
            return await mongodbuse.set(key, value);
        }
        this.get = async function(key) {
            return await mongodbuse.get(key);
        }
        this.delete = async function(key) {
            return await mongodbuse.delete(key);
        }
        this.has = async function(key) {
            return await mongodbuse.has(key);
        }
        this.toJSON = async function(limit) {
            return await mongodbuse.toJSON(limit);
        }
        this.add = async function(key, value) {
            return await mongodbuse.add(key, value);
        }
        this.fetch = async function(key) {
            return await mongodbuse.fetch(key);
        }
        this.all = async function(limit = 0) {
            return await mongodbuse.all(limit);
        }
        this.size = async function() {
            return await mongodbuse.size();
        }
        this.push = async function(key, value) {
            return await mongodbuse.push(key, value);
        }
        this.on = function(key, callback) {
            return mongodbuse.on(key, callback);
        }
    }

};
