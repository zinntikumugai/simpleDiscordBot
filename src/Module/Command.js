const fs = require('fs');
const path = require('path');

class Command {
    constructor(ops = {}) {
        this.opstions = ops;
        if(ops.name)
            this.name = ops.name;
        else
            throw new Error("Command Not set Name.");

        if(ops.call)
            this.call = ops.call
        else
            (msg, ops) => {return};
        
        if (ops.description)
            this.description = ops.description;
    }
}

module.exports = class Commands {
    constructor() {
        this.Commands = [];
    }

    get CommandList() {
        let list = [];
        this.Commands.forEach(command => {
            list.push(command.name);
        });
        return list;
    }

    add(name, call, ops = {}) {
        let command = new Command({
            name: name,
            call: 
                (typeof call === 'function') ? call
                : () => {return call},
            description: ops.description ? ops.description : ""
        });
        if(this.search(name) === -1)
            this.Commands.push(command);
        else
            throw new Error("Bad Command.");
        return true;
    }

    del(name) {
        if(this.search(name) === -1)
            return null;
        let list = [];
        this.Commands.forEach(command => {
            if(command.name !== name)
                list.push(command);
        });
        this.Commands = list;
        return true;
    }

    search(name) {
        let index = -1;
        this.Commands.forEach((command, idx) => {
            if(command.name === name)
                index = idx;
        });
        return index;
    }

    do(message, name = null, ops = {}) {
        let resp = null;
        this.Commands.forEach(command => {
            if(command.name === name)
                resp = command.call(message, ops);
        });
        return resp;
    }

    loader(folderPath = "") {
        let loaded = [];
        const readSubDirSync = (folderPath) => {
            let result = [];
            const readTopDirSync = ((folderPath) => {
                let items = fs.readdirSync(folderPath);
                items = items.map((itemName) => {
                    return path.join(folderPath, itemName);
                });
                items.forEach((itemPath) => {
                    if (fs.statSync(itemPath).isDirectory())
                        readTopDirSync(itemPath);
                    else
                        result.push(itemPath);
                });
            });
            readTopDirSync(folderPath);
            return result;
        }
        let list = readSubDirSync(folderPath);
        list = list.map(item => {
            return /.*\.js$/.test(item) ? item : null;
        });
        list.forEach(js => {
            if (js === null)
                return;
            let tmp = require(js);
            if (!tmp.name && !tmp.ops)
                tmp = new tmp;
            this.add(tmp.name, tmp.call, tmp.ops);
            loaded.push(tmp.name);
        })
        return loaded;
    }
}