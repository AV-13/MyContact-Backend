const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createUser = async (userData) =>  {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = new User({
        ...userData,
        password: hashedPassword
    })
    return user.save();
}

const authenticateUser = async (email, password) => {
    const user = await User.findOne({
        email: email
    });
    if(!user) {
        console.error("Il n'existe aucun utilisateur avec cet email");
        throw new Error("Il n'existe aucun utilisateur avec cet email");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
        console.error("Mot de passe incorrect");
        throw new Error("Mot de passe incorrect");
    }
    const token = jwt.sign(
        {
            userId: user._id,
            email: user.email
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
    console.log("Utilisateur authentifié avec succès : ", user, token);
    return { user, token };
}
module.exports = { createUser, authenticateUser };