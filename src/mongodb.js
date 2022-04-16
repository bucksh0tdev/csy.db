'use strict';
const ErrorShow = require("./error.js");
const mongoose = require("mongoose");
const DatasSchema = new mongoose.Schema({
    dataname: { type: String, required: true },
    data: { type: String, required: true}
});
let datasget = mongoose.model('csydb', DatasSchema);

class multiplemongodb {
    constructor(connect, logger = false, timeout = 30000) {
        if(!connect) throw new ErrorShow("Mongodb Creating Settings Problem");

        let logined = false;

        let loginpromise = new Promise(async(res, rej) => {
            let connecturl = (!connect.endsWith("?retryWrites=true&w=majority")) ? connect + "?retryWrites=true&w=majority" : connect;
            const conn = await mongoose.connect(`${connecturl}`, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }).catch(err => {
                throw new ErrorShow("Mongodb Connect Problem");
            });
            if(logger == true) {
                console.log("[csy.db] Mongodb Connected!");
            }

            logined = true;
        });

        loginpromise;

          let gpromises = new Promise(async(res, rej) => {
             if(logined == true) {
                 res(true);
             } else {
                let timeoutg = setTimeout(function() {
                    if(logined != true) {
                        throw new ErrorShow("Mongodb Connect Set Waited Problem");
                    }
                }, (timeout < 29000) ? 30000 : timeout);

                let interval = setInterval(function() {
                    if(logined == true) {
                        clearInterval(interval);
                        clearTimeout(timeoutg);
                        res(true);
                    }
                }, 1000);
             }
          });


        this.toJSON = async function(limit) {
            const allData = await this.all(limit);
            const json = {};
            for (const element of allData) {
                json[element.ID] = element.data;
            }
            return json;
        }

        this.set = async function(key, value) {
            await gpromises;
            if (key === "" || typeof key !== "string") throw new ErrorShow("Unapproved key");
            if (value === "" || value === undefined || value === null) throw new ErrorShow("Unapproved value");
            
            let updating = await datasget.findOneAndUpdate({ dataname: { $eq: key } }, { data: value }).lean();
            if (!updating) {
              let creating = await datasget.create({
                dataname: key,
                data: value,
              });
            }
            return value;
        }

        this.add = async function(key, value) {
            await gpromises;
            if (key === "" || typeof key !== "string") throw new ErrorShow("Unapproved key");
            if (value === "" || value === undefined || value === null || isNaN(Number(value))) throw new ErrorShow("Unapproved value");
            let datag = await this.get(key);
            if(!datag || isNaN(datag)) return false;
            let data = Number(datag);
            let res = (data + Number(value))

            await this.set(key, res);
            return res;
        }

        this.push = async function(key, value) {
            await gpromises;
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
            await this.set(key, result);
            return result;
        }

        this.get = async function(key) {
            await gpromises;
            if (key === "" || typeof key !== "string") throw new ErrorShow("Unapproved key");

            const doc = await datasget.findOne({ dataname: { $eq: key } }).lean();
            if(doc) { 
                return doc.data
             } else { 
                 return null; 
            }
        }

        this.fetch = async function(key) {
            let control = await this.get(key);
            return control;
        }

        this.has = async function(key) {
            await gpromises;
            if (key === "" || typeof key !== "string") throw new ErrorShow("Unapproved key");

            let control = await this.get(key);
            return Boolean(control);
        }

        this.all = async function(limit = 0) {
            await gpromises;
            if (typeof limit !== "number") throw new ErrorShow("Must be of limit number type");
            
            const arr = [];
            const cursor = await datasget.find().cursor();
            for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
                arr.push({
                    ID: doc.dataname,
                    data: doc.data
                });
            }

            return limit > 0 ? arr.splice(0, limit) : arr;
        }

        this.delete = async function(key) {
            await gpromises;
            if (key === "" || typeof key !== "string") throw new ErrorShow("Unapproved key");

            await datasget.deleteOne({ dataname: { $eq: key } });
            return;
        }
    }
}

module.exports = multiplemongodb
