import express from "express";
import Thread from "../models/Thread.js";
import  getOpenRouterResponse from "../utils/openRouter.js";
const router=express.Router();

//test

router.post("/test",async(requestAnimationFrame,res)=>{
    try{
        const thread=new Thread({
            threadID:"xyz",
            title:"Testing the new thread"
        })
        const response=await thread.save();
        res.send(response);
    }catch(err){
        console.log(err);
        res.status(500).json({error:"failed to save in DB"
        });
    }
});


//get all threads

router.get("/thread", (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            error: "Please login first"
        });
    }

    next();
}, async (req, res) => {
    try {
        const threads = await Thread.find({
            user: req.user._id
        }).sort({ updateAt: -1 });

        res.json(threads);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: "failed to fetch thread"
        });
    }
});

router.get(
    "/thread/:threadId",
    (req, res, next) => {
        if (!req.isAuthenticated()) {
            return res.status(401).json({
                error: "Please login first"
            });
        }

        next();
    },
    async (req, res) => {
        const { threadId } = req.params;

        try {
            const thread = await Thread.findOne({
                threadID: threadId,
                user: req.user._id
            });

            if (!thread) {
                return res.status(404).json({
                    error: "Thread is not found"
                });
            }

            return res.json(thread.messages);

        } catch (err) {
            console.log(err);

            return res.status(500).json({
                error: "failed to fetch chat"
            });
        }
    }
);

router.post(
    "/chat",
    (req, res, next) => {
        if (!req.isAuthenticated()) {
            return res.status(401).json({
                error: "Please login first"
            });
        }

        next();
    },
    async (req, res) => {
        const { threadID, message } = req.body;

        if (!threadID || !message) {
            return res.status(400).json({
                error: "missing required fields"
            });
        }

        try {
            let thread = await Thread.findOne({
                threadID,
                user: req.user._id
            });

            if (!thread) {
                thread = new Thread({
                    user: req.user._id,
                    threadID,
                    title: message,
                    messages: [
                        {
                            role: "user",
                            content: message
                        }
                    ]
                });
            } else {
                thread.messages.push({
                    role: "user",
                    content: message
                });
            }

            const assistentReplay = await getOpenRouterResponse(message);

            thread.messages.push({
                role: "assistant",
                content: assistentReplay
            });

            thread.updateAt = new Date();

            await thread.save();

            return res.json({
                reply: assistentReplay
            });

        } catch (err) {
            console.log(err);
            return res.status(500).json({
                error: "something went wrong"
            });
        }
    }
);
router.delete(
    "/thread/:threadId",
    (req, res, next) => {
        if (!req.isAuthenticated()) {
            return res.status(401).json({
                error: "Please login first"
            });
        }

        next();
    },
    async (req, res) => {
        const { threadId } = req.params;

        try {
            const deletedThread = await Thread.findOneAndDelete({
                threadID: threadId,
                user: req.user._id
            });

            if (!deletedThread) {
                return res.status(404).json({
                    error: "Thread could not be deleted"
                });
            }

            return res.status(200).json({
                success: "Thread deleted!"
            });

        } catch (err) {
            console.log(err);

            return res.status(500).json({
                error: "failed to delete the thread"
            });
        }
    }
);
export default router;