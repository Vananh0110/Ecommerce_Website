const bcrypt = require('bcrypt');

async function hashPassword(password) {
    const saltRounds = 10;
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log('Hashed password:', hashedPassword);
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
    }
}

hashPassword('12345678').then(hashedPassword => {
    console.log('Use this hashed password in your SQL INSERT statement.');
});