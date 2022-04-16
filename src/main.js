'use strict';
const paths = require("path");
const fs = require("fs");
const fse = require('fs-extra');
const { set, get, unset } = require("lodash");
const ErrorShow = require("./error.js");
const multiple = require("./multiple.js");
const cipher = require("./cipher.js");
const mongodb = require("./mongodb.js");

class create {
    constructor() {
        this.create = multiple;
        this.cipher = cipher;
        this.mongodb = mongodb;
      
        var maxlimit = 0;
        this.setup = function() {
            this.path = paths.join(process.cwd(), "datas.json");

            if(!String(this.path).endsWith(".json")) throw new ErrorShow("End With .json Data Json File");
            if(!fs.existsSync(this.path)) {
                fse.outputFileSync(this.path, "{}")
            }
        }

        this.toJSON = function(limit) {
            this.setup();
            const allData = this.all(limit);
            const json = {};
            for (const element of allData) {
                json[element.ID] = element.data;
            }
            return json;
        }

        this.set = function(key, value) {
            this.setup();
            if (key === "" || typeof key !== "string") throw new ErrorShow("Unapproved key");
            if (value === "" || value === undefined || value === null) throw new ErrorShow("Unapproved value");
            if(maxlimit != 0 && this.size() >= maxlimit) throw new ErrorShow("Data limit exceeded");
            let jsonData = this.toJSON();
            set(jsonData, key, value);
            fs.writeFileSync(this.path, JSON.stringify(jsonData, null, 4));
            return value;
        }

        this.add = function(key, value) {
            this.setup();
            if (key === "" || typeof key !== "string") throw new ErrorShow("Unapproved key");
            if (value === "" || value === undefined || value === null || isNaN(Number(value))) throw new ErrorShow("Unapproved value");
            let data = Number(this.get(key)) || 0;
            if(data == null) return false;
            if (isNaN(data)) throw new ErrorShow("Unapproved value");
            let res = (data + Number(value))
            this.set(key, res)
            return res;
        }

        this.push = function(key, value) {
            this.setup();
            if (key === "" || typeof key !== "string") throw new ErrorShow("Unapproved key");
            if (value === "" || value === undefined || value === null) throw new ErrorShow("Unapproved value");
            let data = this.get(key) || [];

            var result;
            if(data) {
                if (!Array.isArray(data)) throw new ErrorShow('Target is not an array');
                try {
                    data.push(value);
                    result = data;
                } catch (err) {
                    throw new ErrorShow("Pushing Problem");
                }
            }
            this.set(key, result)
            return result;
        }

        this.get = function(key) {
            this.setup();
            if (key === "" || typeof key !== "string") throw new ErrorShow("Unapproved key");
            let jsonData = this.toJSON();
            if(!jsonData) return null;
            let control = get(jsonData, key);
            if(!control) return null;

            return control;
        }

        this.fetch = function(key) {
            this.setup();
            let control = this.get(key);
            return control;
        }

        this.has = function(key) {
            this.setup();
            if (key === "" || typeof key !== "string") throw new ErrorShow("Unapproved key");
            let control = this.get(key);
            return Boolean(control);
        }

        this.all = function(limit = 0) {
            this.setup();
            if (typeof limit !== "number") throw new ErrorShow("Must be of limit number type");
            let jsonData;
            try {
                jsonData = JSON.parse(fs.readFileSync(this.path, "utf-8"));
            } catch (err) {
                throw new ErrorShow("Json File Problem");
            }
            const arr = [];
            for (const key in jsonData) {
                arr.push({
                    ID: key,
                    data: jsonData[key]
                });
            }
            return limit > 0 ? arr.splice(0, limit) : arr;
        }

        this.size = function() {
            this.setup();
            let all = this.toJSON();
            if(!all) return Number(0);
            let alls = Object.keys(all);
            if(!alls || !alls.length || isNaN(alls.length) != false) return Number(0);
            return Number(alls.length);
        }

        this.delete = function(key) {
            this.setup();
            if (key === "" || typeof key !== "string") throw new ErrorShow("Unapproved key");
            let jsonData = this.toJSON();
            if(!jsonData) return false;
            unset(jsonData, key)
            fs.writeFileSync(this.path, JSON.stringify(jsonData, null, 4))
            return;
        }
    }
}

module.exports = create
