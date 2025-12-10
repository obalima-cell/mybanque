const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// REGISTER
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Email déjà utilisé" });
        }

        const user = await User.create({ name, email, password });

        res.status(201).json({
            message: "Inscription réussie",
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// LOGIN
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Identifiants invalides" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Mot de passe incorrect" });
        }

        res.json({
            message: "Connexion réussie",
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { register, login };
