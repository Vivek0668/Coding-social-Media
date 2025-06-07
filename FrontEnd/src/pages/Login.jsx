import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from '../store/user-slice';
import { io } from 'socket.io-client';

export default function Login() {
    const [user, setUser] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentUser = useSelector(state => state?.user?.currentUser);

    const changeInputHandler = (e) => {
        setUser(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
    };

    const loginUser = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_Backend_api_url}/users/login`, user);
            console.log("Login response:", response.data);
            if (response.status === 200) {
                dispatch(userActions.changeCurrentUser(response?.data));
                localStorage.setItem("currentUser", JSON.stringify(response?.data));
                navigate("/");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    // Initialize socket after login
    useEffect(() => {
        if (!currentUser?._id) {
            console.log("No user ID yet, skipping socket init:", currentUser);
            return;
        }
        console.log("Initializing socket for user:", currentUser._id);
        const socket = io(`${import.meta.env.VITE_Backend_api_url}`, {
            query: { userId: currentUser._id?.toString() },
            transports: ['websocket'],
            withCredentials: true
        });
        socket.on("connect", () => {
            console.log("Socket connected successfully for user:", currentUser._id, "Socket ID:", socket.id);
        });
        socket.on("connect_error", (err) => {
            console.error("Socket connection error:", err.message);
        });
        dispatch(userActions.setSocket(socket));
        return () => {
            socket.disconnect();
            console.log("Socket disconnected for user:", currentUser._id);
        };
    }, [currentUser, dispatch]);

    return (
        <section className='register'>
            <div className='container register__container'>
                <h2>Sign In</h2>
                <form onSubmit={loginUser}>
                    {error && <p className='form__error-message'>{error}</p>}
                    <input
                        type="text"
                        name='email'
                        placeholder='Email'
                        onChange={changeInputHandler}
                    />
                    <div className='password__controller'>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder='Password'
                            name="password"
                            onChange={changeInputHandler}
                        />
                        <span onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    <p>New to Codera? <Link to="/register">Sign-Up</Link></p>
                    <button type='submit' className='btn primary'>Login</button>
                </form>
            </div>
        </section>
    );
}