const encrypt = require('password-hash');

class Auth {
  static async getHash(plainPassword) {
    const hash = await encrypt.generate(plainPassword);
    return hash;
  }

  static async isPasswordValid(plainPassword, hash) {
    const isValid = await encrypt.verify(plainPassword, hash);
    return isValid;
  }
}

module.exports = Auth;
