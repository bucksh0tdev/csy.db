'use strict';
const paths = require("path");
const fs = require("fs");
const fse = require('fs-extra');
const { set, get, unset } = require("lodash");
const ErrorShow = require("./error.js");
const encryptfun = require("./encrypt.js");
const DEFAULT_SECRET_KEY = "zBK6;@2~ZbQwG^D~fmes}TWgP";

class multipleCipher {
    constructor(path, maxlimit = 0, SECRET_KEY = DEFAULT_SECRET_KEY) {
        if(!path || !SECRET_KEY || (isNaN(maxlimit))) throw new ErrorShow("Cipher Creating Settings Problem");
        const encrypt = new encryptfun(SECRET_KEY);

        this.path = paths.join(process.cwd(), path);

        this.version = require("../package.json").version

        if(!String(this.path).endsWith(".json")) throw new ErrorShow("End With .json Data Json File");
        if(!fs.existsSync(this.path)) {
            fse.outputFileSync(this.path, "{}")
        }

        this.toJSON = function(limit) {
            const allData = this.all(limit);
            const json = {};
            for (const element of allData) {
                json[element.ID] = element.data;
            }
            return json;
        }

        this.set = function(key, value) {
            if (key === "" || typeof key !== "string") throw new ErrorShow("Unapproved key");
            if (value === "" || value === undefined || value === null) throw new ErrorShow("Unapproved value");
            if(maxlimit != 0 && this.size() >= maxlimit) throw new ErrorShow("Data limit exceeded");
            let realDatas = this.realall();
            if(!realDatas) return null;
            let encryptedvalue = encrypt.encrypt(value);
            
            let control = this.all().find(x => x.ID == key);
            if(control) {
                set(realDatas, control.realID, encryptedvalue);
                fs.writeFileSync(this.path, JSON.stringify(realDatas, null, 4));
                return value;
            } else {
                let encrypted = encrypt.encrypt(key);
                set(realDatas, encrypted, encryptedvalue);
                fs.writeFileSync(this.path, JSON.stringify(realDatas, null, 4));
                return value;
            }
        }

        this.add = function(key, value) {
            if (key === "" || typeof key !== "string") throw new ErrorShow("Unapproved key");
            if (value === "" || value === undefined || value === null || isNaN(Number(value))) throw new ErrorShow("Unapproved value");
            let jsonData = this.toJSON();
            if(!jsonData) return null;
            let data = Number(get(jsonData, key) || 0);
            if(value === "" || value === undefined || value === null) throw new ErrorShow("No key specified");
            if (isNaN(data)) throw new ErrorShow("Unapproved value");
            let res = (data + Number(value))

            this.set(key, res)
            return Number(res);
        }

        this.get = function(key) {
            if (key === "" || typeof key !== "string") throw new ErrorShow("Unapproved key");
            let jsonData = this.toJSON();
            if(!jsonData) return null;
            let control = get(jsonData, key);
            if(!control) return null;
          
            return control;
        }

        this.fetch = function(key) {
            let control = this.get(key);
            return control;
        }

        this.has = function(key) {
            if (key === "" || typeof key !== "string") throw new ErrorShow("Unapproved key");
            let jsonData = this.toJSON();
            if(!jsonData) return false;
            let control = get(jsonData, key);
            if(!control) return false;

            return true;
        }

        this.all = function(limit = 0) {
            if (typeof limit !== "number") throw new ErrorShow("Must be of limit number type");
            const jsonData = JSON.parse(fs.readFileSync(this.path, "utf-8"));
            const arr = [];
            for (const key in jsonData) {
                arr.push({
                    ID: encrypt.decrypt(key),
                    data: encrypt.decrypt(jsonData[key]),
                    realID: key
                });
            }
            return limit > 0 ? arr.splice(0, limit) : arr;
        }


        this.realall = function(limit = 0) {
            if (typeof limit !== "number") throw new ErrorShow("Must be of limit number type");
            const jsonData = JSON.parse(fs.readFileSync(this.path, "utf-8"));
            const arr = [];
            for (const key in jsonData) {
                arr.push({
                    ID: key,
                    data: jsonData[key]
                });
            }

            let realarr = limit > 0 ? arr.splice(0, limit) : arr;

            const json = {};
            for (const element of realarr) {
                json[element.ID] = element.data;
            }

            return json;
        }

        this.size = function() {
            let all = this.toJSON();
            if(!all) return Number(0);
            let alls = Object.keys(all);
            if(!alls || !alls.length || isNaN(alls.length) != false) return Number(0);
            return Number(alls.length);
        }

        this.delete = function(key) {
            if (key === "" || typeof key !== "string") throw new ErrorShow("Unapproved key");
            let realDatas = this.realall();
            if(!realDatas) return false;

            let control = this.all().find(x => x.ID == key);
            if(control) {
                unset(realDatas, control.realID);
                fs.writeFileSync(this.path, JSON.stringify(realDatas, null, 4));
                return true;
            } else {
                return false;
            }
        }

        this.encryptAll = function() {
            const jsonData = JSON.parse(fs.readFileSync(this.path, "utf-8"));
            const arr = [];
            for (const key in jsonData) {
                var control = encrypt.decrypt(key);
                if(control == null) {
                    arr.push({
                        ID: encrypt.encrypt(key),
                        data: encrypt.encrypt(jsonData[key])
                    });
                } else {
                    arr.push({
                        ID: key,
                        data: jsonData[key]
                    });
                }
            }

            const json = {};
            for (const element of arr) {
                json[element.ID] = element.data;
            }
            fs.writeFileSync(this.path, JSON.stringify(json, null, 4));

            return true;
        }

        this.decryptAll = function() {
            const jsonData = JSON.parse(fs.readFileSync(this.path, "utf-8"));
            const arr = [];
            for (const key in jsonData) {
                var control = encrypt.decrypt(key);
                if(control == null) {
                    arr.push({
                        ID: key,
                        data: jsonData[key]
                    });
                } else {
                    arr.push({
                        ID: encrypt.decrypt(key),
                        data: encrypt.decrypt(jsonData[key])
                    });
                }
            }

            const json = {};
            for (const element of arr) {
                json[element.ID] = element.data;
            }
            fs.writeFileSync(this.path, JSON.stringify(json, null, 4));

            return true;
        }
    }
}

module.exports = multipleCipher
