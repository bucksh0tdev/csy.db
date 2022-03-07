module.exports = function(error) {
    console.log(error)
    let subfix = ". For help: https://discord.gg/gkmwaAZQBu";
    throw new TypeError(String(error + subfix));
    return false;
}