let subfix = ". For help: https://discord.gg/gkmwaAZQBu";

class ShowError extends Error {
    constructor(message) {
        super(`${message}${subfix}`);
    }
}

module.exports = ShowError
