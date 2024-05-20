require('dotenv').config()
const bcrypt = require('bcrypt');
const saltRounds = 10; // Number of salt rounds, a higher value is more secure but slower

// Hash a password
const hashPassword = async (password) => {
    try {
        // Generate a salt
    const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (err) {
        throw new Error(`Error hashing password , ${err}`);
    }
};

// Check a password against its hash
const checkPassword = async (password, hashedPassword) => {
    try {
        const match = await bcrypt.compare(password, hashedPassword);
        if(match){
            return true ;
        }else{
            return false ;
        }
    } catch (err) {
        throw new Error(`Error checking password, ${err}`);
    }
};

module.exports = {hashPassword, checkPassword}