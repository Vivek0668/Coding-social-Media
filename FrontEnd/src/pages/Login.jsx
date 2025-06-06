import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from '../store/user-slice';
import { initSocket } from '../socket'; // Import socket module

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
                initSocket(response.data._id); // Initialize socket after login
                navigate("/");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

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