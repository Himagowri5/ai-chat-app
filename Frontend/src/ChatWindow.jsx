import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext,useState,useEffect } from "react";
import{ScaleLoader} from "react-spinners";
import { v1 as uuidv1 } from "uuid";
function ChatWindow(){
    const{prompt,setPrompt,reply,setReplay,currThreadID,prevChats,setPrevChats,setNewChat,isLoggedIn,setIsLoggedIn,authPage,setAuthPage,setCurrThreadID,setAllThreads}=useContext(MyContext);
    const [loading,setLoading]=useState(false);
    const [isOpen,setIsOpen]=useState(false);
    const getReply=async()=>{
        
        setLoading(true);
        setNewChat(false);
        const options={
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                message:prompt,
                threadID:currThreadID
            }),credentials: "include"
        }
        try{
           const response= await fetch("https://ai-chat-app-b4vm.onrender.com/api/chat",options);
           const res = await response.json();
            console.log(res);
            setReplay(res.reply);
        }catch(err){
            console.log(err);
        }
        setLoading(false);
       
    }


    //append new chat to exixting chat
    useEffect(()=>{
        if(prompt && reply){
            setPrevChats(prevChats=>(
                [...prevChats,{
                    role:"user",
                    content:prompt
                },{
                    role:"assistant",
                    content:reply
                }]
            ))
        }

        setPrompt("");
    },[reply]);

    const handleProfileClick=()=>{
        setIsOpen(!isOpen);
    }
    return(
        <div className="chatWindow">
            <div className="navbar">
                <span>GPT<i className="fa-solid fa-angle-down"></i></span>
                <div className="userIconDiv" onClick={handleProfileClick}>
                    <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                </div>
            </div>
            {
    isOpen &&
    <div className="dropDown">

        <div className="dropDownItem">
            <i className="fa-solid fa-gear"></i>
            Settings
        </div>

        <div className="dropDownItem">
            <i className="fa-solid fa-thumbtack"></i>
            Pin chat
        </div>

        {!isLoggedIn ? (
            <>
                <div className="dropDownItem"onClick={() => {setAuthPage("login");setIsOpen(false);} }><i className="fa-solid fa-right-to-bracket"></i>Login</div>
                <div className="dropDownItem" onClick={() => {setAuthPage("signup");setIsOpen(false);}}><i className="fa-solid fa-user-plus"></i>Signup</div>
            </>
        ) : (
            <div
                className="dropDownItem"
                onClick={async () => {
                try {
                const response = await fetch(
                    "https://ai-chat-app-b4vm.onrender.com/api/auth/logout",
                    {
                        method: "POST",
                        credentials: "include"
                    }
                );

                if (response.ok) {
                    setIsLoggedIn(false);
                    setAuthPage(null);
                    setIsOpen(false);
                    //to set the chat winodw wmpty after logut
                     setPrevChats([]);
                     setReplay(null);
                    setPrompt("");
                    setAllThreads([]);
                    setNewChat(true);
                    setCurrThreadID(uuidv1());
                }
            } catch (err) {
                console.log(err);
            };setIsOpen(false);
        }}
    ><i className="fa-solid fa-arrow-right-from-bracket"></i>Logout</div>
        )}

    </div>
}
            <Chat></Chat>
            <ScaleLoader color="#ffffff" loading={loading}>

            </ScaleLoader>
            <div className="chatInput">
                <div className="inputBox">
                    <input placeholder="ask anything"
                    value={prompt}
                    onChange={(e)=>setPrompt(e.target.value)}
                    onKeyDown={(e)=>e.key==='Enter'?getReply():''}>
                    
                    </input>
                    <div id="submit" onClick={getReply}><i className="fa-solid fa-arrow-up"></i></div>
                </div>
                <p className="info">
                    This GPT can make mistake.Check Inmportant info.
                </p>
            </div>
        </div>
    )
}

export default ChatWindow;