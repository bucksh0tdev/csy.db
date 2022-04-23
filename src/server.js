'use strict';
const ErrorShow = require("./error.js");
const { io } = require("socket.io-client");
const EventEmitter = require('events');
class Emitter extends EventEmitter {}

class server {
    constructor(connect, password, logger = false, timeout = 30000) {
        const serverEmitter = new Emitter();
        
        if(!connect || !password) throw new ErrorShow("[csy.db-server] Connection Settings Problem");

        let logined = false;

        const socket = io(connect);
        let loginpromise = new Promise(async(res, rej) => {
            
            if(logger == true) {
                console.log("[csy.db-server] Connected!");
            }
            socket.on("connect_error", (err) => {
                socket.disconnect();
                throw new ErrorShow("[csy.db-server] Connection Problem");
            });

            socket.on("connect", () => {
                logined = true;
            })
        });

        loginpromise;

          let gpromises = new Promise(async(res, rej) => {
             if(logined == true) {
                 res(true);
             } else {
                let timeoutg = setTimeout(function() {
                    if(logined != true) {
                        throw new ErrorShow("[csy.db-server] Connect Set Waited Problem");
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
            
            let control = await this.get(key);
            if(control) {
                if(control != value)
                serverEmitter.emit("update", { last: `${control}`, new: `${value}`, key: `${key}` });
            } else {
                serverEmitter.emit("create", { key: `${key}`, value: `${value}` });
            }

            await this.socket("set", key, value);
            return value;
        }

        this.socket = async function(method, key, value) {
            return new Promise(async(res, rej) => {
                await socket.emit('csydb', password, method, key, value, (result) => {
                    if(!result || !result.response || result.response != 200) throw new ErrorShow("[csy.db-server] Server Problem");
                    res(result.data);
                });
            });
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

        this.on = function(key, callback) {
            if(!key || typeof callback != "function" || (key != "create" && key != "delete" && key != "update")) throw new ErrorShow("Event emitter key not found");
            serverEmitter.on(key, callback);
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

            let result = await this.socket("get", key, null);
            if(result) { 
                return result;
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

            let arr = await this.socket("all", limit, null);
            return arr;
        }

        this.delete = async function(key) {
            await gpromises;
            if (key === "" || typeof key !== "string") throw new ErrorShow("Unapproved key");

            let control = await this.get(key);
            if(control) {
                serverEmitter.emit("delete", { key: `${key}`, value: `${control}` });
            }

            await this.socket("delete", key, null);
            return;
        }
    }
}

module.exports = server
