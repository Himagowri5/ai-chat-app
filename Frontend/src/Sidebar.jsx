import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";

function Sidebar() {

    const {
        allThreads,
        setAllThreads,
        currThreadID,
        setNewChat,
        setPrompt,
        setReplay,
        setCurrThreadID,
        setPrevChats,
        isLoggedIn
    } = useContext(MyContext);

    const getAllThreads = async () => {

        if (!isLoggedIn) {
            setAllThreads([]);
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:8080/api/thread",
                {
                    credentials: "include"
                }
            );

            const res = await response.json();

            if (!response.ok) {
                console.log(res);
                return;
            }

            const filteredData = res.map(thread => ({
                threadID: thread.threadID,
                title: thread.title
            }));

            setAllThreads(filteredData);

        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [isLoggedIn, currThreadID]);


    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReplay(null);
        setCurrThreadID(uuidv1());
        setPrevChats([]);
    };


    const changeThread = async (newThreadID) => {

        setCurrThreadID(newThreadID);

        try {

            const response = await fetch(
                `http://localhost:8080/api/thread/${newThreadID}`,
                {
                    credentials: "include"
                }
            );

            const res = await response.json();

            if (!response.ok) {
                console.log(res);
                return;
            }

            setPrevChats(res);
            setNewChat(false);
            setReplay(null);

        } catch (err) {
            console.log(err);
        }
    };


    const deleteThread = async (ThreadId) => {

        try {

            const response = await fetch(
                `http://localhost:8080/api/thread/${ThreadId}`,
                {
                    method: "DELETE",
                    credentials: "include"
                }
            );

            const res = await response.json();

            console.log(res);

            if (!response.ok) {
                return;
            }

            setAllThreads(prev =>
                prev.filter(thread => thread.threadID !== ThreadId)
            );

            if (ThreadId === currThreadID) {
                createNewChat();
            }

        } catch (err) {
            console.log(err);
        }
    };


    return (
        <section className="sidebar">

            {/* new chat button */}
            <button onClick={createNewChat}>
                <img
                    src={new URL(
                        "./assets/logo.jpeg",
                        import.meta.url
                    ).href}
                    alt="Logo"
                    className="logo"
                />

                <span>
                    <i className="fa-solid fa-pen-to-square"></i>
                </span>
            </button>


            {/* history */}
            <ul className="history">

                {
                    allThreads?.map((thread, idx) => (

                        <li
                            key={idx}
                            onClick={() =>
                                changeThread(thread.threadID)
                            }
                            className={
                                thread.threadID === currThreadID
                                    ? "highlighted"
                                    : ""
                            }
                        >

                            {thread.title}

                            <i
                                className="fa-solid fa-trash"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteThread(thread.threadID);
                                }}
                            ></i>

                        </li>

                    ))
                }

            </ul>


            {/* sign in */}
            <div className="sign">
                <p>By Hima</p>
            </div>

        </section>
    );
}

export default Sidebar;