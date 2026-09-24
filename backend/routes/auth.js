import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import passport from "passport";

const router = express.Router();

router.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 1. Check if all fields are provided
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // 2. Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        // 3. Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Create user
        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        // 5. Save user in MongoDB
        await user.save();

        res.status(201).json({
            message: "User registered successfully"
        });

    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Something went wrong"
        });
    }
});


router.post(
    "/login",
    passport.authenticate("local"),
    (req, res) => {
        res.json({
            message: "Login successful",
            user: {
                id: req.user._id,
                username: req.user.username,
                email: req.user.email
            }
        });
    }
);

router.get("/me", (req, res) => {

    if (!req.isAuthenticated()) {
        return res.status(401).json({
            message: "Not authenticated"
        });
    }

    res.json({
        user: {
            id: req.user._id,
            username: req.user.username,
            email: req.user.email
        }
    });
});



router.post("/logout", (req, res) => {

    req.logout((err) => {

        if (err) {
            return res.status(500).json({
                message: "Logout failed"
            });
        }

        req.session.destroy((err) => {

            if (err) {
                return res.status(500).json({
                    message: "Session destruction failed"
                });
            }

            res.json({
                message: "Logout successful"
            });
        });

    });

});
export default router;