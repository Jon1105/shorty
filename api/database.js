const { readFile, writeFile } = require("fs").promises

class Database {
    constructor(path) {
        this.path = path
    }

    async __read() {
        return JSON.parse(await readFile(this.path))
    }

    async get_url(key) {
        const contents = await this.__read()
        return contents[key]
    }

    async write_url(url) {
        const key = await this.__new_key()
        const contents = await this.__read()
        contents[key] = url
        await writeFile(this.path, JSON.stringify(contents))
        return key
    }

    __randInt(low, high) {
        return Math.floor((Math.random() * (high - low)) + low)
    }

    isValidURL(str) {
        var pattern = new RegExp('^(https?:\\/\\/)?' +
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
            '((\\d{1,3}\\.){3}\\d{1,3}))' +
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
            '(\\?[;&a-z\\d%_.~+=-]*)?' +
            '(\\#[-a-z\\d_]*)?$', 'i');
        return !!pattern.test(str);
    }

    async __new_key() {
        const chars = 'abcdefghijklmnopqrstuvwxyz1234567890'
        let key = ''
        for (let i = 0; i < 6; i++) {
            key += chars.charAt(this.__randInt(0, chars.length))
        }
        if (await this.get_url(key) != undefined) { return await this.__new_key() }
        return key
    }
}

module.exports = Database