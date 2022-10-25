import React, {useState} from 'react';
import Cookies from 'js-cookie'
import {useNavigate} from "react-router-dom";
import styles from '../../css/Authorization.module.css';
import Button from "../../utilities/Button";
import Input from "../../utilities/Input";

function Login(props)
{
    const {setMessage, setState, setIsLoggedIn} = props;

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [isRememberMe, setIsRememberMe] = useState(false);

    const navigate = useNavigate();

    const handleLogin = e =>
    {
        fetch("https://mywatchlist-apiv2.herokuapp.com/user/login",
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(
                    {
                        "user": login,
                        "password": password,
                        "rememberMe": isRememberMe
                    })
            })
            .then(response => response.json())
            .then(data =>
            {
                if(data.verifyError) return navigate('/verification', {state: {user: login}});

                if (data.error) throw new Error(data.error);

                isRememberMe ? Cookies.set('token', data.token, {expires: 365}) : Cookies.set('token', data.token, {expires: 2/48});
                isRememberMe ? Cookies.set('username', data.username, {expires: 365}) : Cookies.set('username', data.username, {expires: 2/48});

                setIsLoggedIn(true);
                navigate('/');
            })
            .catch(err =>
            {
                setMessage(err.message);
                setState("error")
            })
    }

    const validation = e =>
    {
        e.preventDefault();

        if(!login.trim().length)
        {
            setMessage("Username or email is required.");
            setState("error");
            return;
        }

        if(!password)
        {
            setMessage("Password is required.");
            setState("error");
            return;
        }

        handleLogin(e);
    }

    return (
        <div className={styles.login_container}>

            <h1>Login</h1>
            <form className={styles.form}>
                <Input type="text" onChange={e => setLogin(e.target.value)}
                       placeholder="Username or email"/>
                <Input type="password" onChange={e => setPassword(e.target.value)}
                       placeholder="Password" />
                <div className={styles.remember_me_container}>
                    <label className={styles.remember_me}>
                        <input type="checkbox" onChange={e => setIsRememberMe(e.target.checked)} /> Remember me
                    </label>
                    <div className={styles.forgot_password}>
                        <a href="/forgotPassword">Forgot password</a>
                    </div>
                </div>
                <Button width="300px" fontSize="24px" padding="15px" onClick={validation}>Login</Button>
            </form>

            <div className={styles.signup_prompt_container}>
                New here? <b onClick={() => navigate('/auth/signup')}>Create an Account</b>
            </div>

        </div>
    );
}

export default Login;