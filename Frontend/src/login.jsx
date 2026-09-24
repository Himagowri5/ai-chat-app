import "./login.css";
import { useContext, useState } from "react";
import { MyContext } from "./MyContext.jsx";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setIsLoggedIn, setAuthPage } = useContext(MyContext);

    const handleLogin = async () => {

        try {

            const response = await fetch(
                "http://localhost:8080/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Login failed");
                return;
            }

            console.log("Logged in user:", data.user);

            setIsLoggedIn(true);
            setAuthPage(null);

        } catch (err) {

            console.log(err);
            alert("Something went wrong");

        }
    };

    return (
        <div className="signup_tab">

            <h3>Login</h3>

            <p>Email:</p>

            <input
                className="input"
                placeholder="Enter your email here"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <p>Password:</p>

            <input
                className="input"
                placeholder="Enter the password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button
                className="register"
                onClick={handleLogin}
            >
                Login
            </button>

            <p>If not registered, register here</p>

        </div>
    );
}

export default Login;