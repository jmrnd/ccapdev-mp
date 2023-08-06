import bcrypt, { hash } from "bcrypt";

const saltRounds = 10;

const passwordUtils = {

    // Validate Password
    validatePassword(password, hash){
        const isValid = bcrypt.compareSync(password, hash);
        return isValid;
    },

    // Hashpassword
    generatePassword(password){
        // Generate Salt
        const salt = bcrypt.genSaltSync(saltRounds);

        // Hashing process
        const hashedPassword = bcrypt.hashSync(password, salt);

        return hashedPassword;
    }
}

export default passwordUtils;