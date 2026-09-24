import './App.css'
import Sidebar from "./Sidebar.jsx"
import ChatWindow from "./ChatWindow.jsx";
import { MyContext } from './MyContext.jsx';
import Signup from './signup.jsx';
import Login from './login.jsx';
import { useState } from 'react';
import {v1 as uuid} from "uuid";
function App() {
  const[prompt,setPrompt]=useState("");
  const[reply,setReplay]=useState(null);
  const [currThreadID,setCurrThreadID]=useState(uuid());
  const [prevChats,setPrevChats]=useState([]);
  const [newChat,setNewChat]=useState(true);
  const [allThreads,setAllThreads]=useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authPage, setAuthPage] = useState(null);
  const providerValues={
    prompt,setPrompt,
    reply,setReplay,
    currThreadID,setCurrThreadID,
    newChat,setNewChat,
    prevChats,setPrevChats,
    allThreads,setAllThreads,
    isLoggedIn,setIsLoggedIn,
    authPage,setAuthPage
  };

  return (
    <div className='app'>
      <MyContext.Provider value={providerValues}>
        <Sidebar></Sidebar>
        <ChatWindow></ChatWindow>   
        {/* <Login></Login> */}
         {authPage === "login" && <Login />}
      {authPage === "signup" && <Signup />}
        
      </MyContext.Provider> 
    </div>
  )
}

export default App
