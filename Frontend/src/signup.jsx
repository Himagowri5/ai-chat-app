import "./signup.css";
import { useContext, useState } from "react";
import { MyContext } from "./MyContext.jsx";

function Signup() {
    const { setIsLoggedIn, setAuthPage } = useContext(MyContext);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async () => {

        try {

            const response = await fetch(
                "http://localhost:8080/api/auth/signup",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username,
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            alert("Signup successful!");

            setUsername("");
            setEmail("");
            setPassword("");
            setAuthPage("login");

        } catch (err) {
            console.log(err);
            alert("Something went wrong");
        }
    };

    return (
        <div className="signup_tab">

            <h3>Signup</h3>

            <p>Username:</p>

            <input
                className="input"
                placeholder="Enter your user name here"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <p>Email:</p>

            <input
                className="input"
                placeholder="Enter your email here"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <p>Password:</p>

            <input
                className="input"
                placeholder="Enter the password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button
                className="register"
                onClick={handleSignup}
            >
                Register
            </button>

            <p>Already registered? Login here</p>

        </div>
    );
}

export default Signup;