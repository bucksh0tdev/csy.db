const encryptor = require('cryptr');

module.exports = function(SECRET_KEY) {
  const cipher = new encryptor(SECRET_KEY);
  
  this.encrypt = function(value) {
    let ciphertext = cipher.encrypt(value).toString();
    return ciphertext;
  }
  
  this.decrypt = function(value) {
    try {
      let ciphertext = cipher.decrypt(value).toString();
      return (ciphertext) ? ciphertext : null;
    } catch (err) {
      return null
    }
  }
}
