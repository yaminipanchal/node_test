const bcrypt = require("bcrypt");
const saltRounds = 10;
class Common {
    bcryptText(plainText) {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(saltRounds, (err, salt) => {
                if (salt)
                    bcrypt.hash(plainText, salt, (err, hash) => {
                        if (hash) {
                            resolve(hash);
                        } else reject(false);
                    });
                else reject(false);
            });
        });

    }

    compareBcryptText(plainText, hashText) {
        return new Promise((resolve) => {
            bcrypt.compare(plainText, hashText, function (err, res) {
                if (res) resolve(true);
                else resolve(false);
            });
        });

    }
}
module.exports = new Common()