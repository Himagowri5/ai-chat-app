import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import chatRoutes from "./routes/chat.js";
import session from "express-session";
import passport from "passport";
import "./config/passport.js";
const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors({
        origin: "http://localhost:5173",
        credentials: true
    }
));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    })
);

app.use(passport.initialize());
app.use(passport.session());
app.use("/api",chatRoutes);
app.use("/api/auth", authRoutes);
app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
    connectDB();
});

const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("connected ");
    }catch(err){
        console.log(err);
    }
}

// app.post("/test", async (req, res) => {

//     console.log(
//         "API key loaded:",
//         !!process.env.OPENROUTER_API_KEY
//     );

//     const options = {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
//         },
//         body: JSON.stringify({
//             model: "openrouter/free",
//             messages: [
//                 {
//                     role: "user",
//                     content: "which is the best indian food in veg"
//                 }
//             ],
//             max_tokens: 500
//         })
//     };

//     try {

//         const response = await fetch(
//             "https://openrouter.ai/api/v1/chat/completions",
//             options
//         );

//         const data = await response.json();

//         console.log(data);

//         if (!response.ok) {
//             return res.status(response.status).json(data);
//         }

//         res.json(data);

//     } catch (err) {

//         console.log(err);

//         res.status(500).json({
//             error: "Something went wrong",
//             message: err.message
//         });
//     }
// });