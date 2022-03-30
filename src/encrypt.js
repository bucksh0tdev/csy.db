const encryptor = require('cryptr');

module.exports = function(SECRET_KEY) {
  const cipher = new encryptor(SECRET_KEY);
  
  this.json = function(str) {
    try {
      JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
  }

  this.encrypt = function(value) {
    if (typeof value === "object") value = JSON.stringify(value);

    let ciphertext = cipher.encrypt(value).toString();
    return ciphertext;
  }
  
  this.decrypt = function(value) {
    try {
      let ciphertext = cipher.decrypt(value);
      let control = this.json(ciphertext);
      if(control == false) {
        return (ciphertext) ? ciphertext : null;
      } else {
        return (ciphertext) ? JSON.parse(ciphertext) : null;
      }
    } catch (err) {
      return null;
    }
  }
}
