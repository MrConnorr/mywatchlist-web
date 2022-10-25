import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import Button from "../../utilities/Button";
import styles from "../../css/ForgotPassword.module.css";
import Input from "../../utilities/Input";

function ForgotPasswordChange(props)
{
    const {setMessage, setState} = props;

    const [newPassword, setNewPassword] = useState("");
    const [repeatNewPassword, setRepeatNewPassword] = useState("");
    const [isTokenValid, setIsTokenValid] = useState(false);
    const [tokenMessage, setTokenMessage] = useState("");
    const [isPasswordChanged, setIsPasswordChanged] = useState(false);

    let {token} = useParams();

    useEffect(() =>
    {
        fetch(`https://mywatchlist-apiv2.herokuapp.com/user/checkToken/${token}`)
            .then(response => response.json())
            .then(data =>
            {
                if (data.error) throw new Error(data.error);
                setIsTokenValid(true);
            })
            .catch(err =>
            {
                if (err.message === "jwt malformed") return setTokenMessage("Token is invalid");
                if (err.message === "jwt expired") return setTokenMessage("Token expired");

                setMessage(err.message);
                setState("error");
            })
    }, [])


    const handlePasswordRecovery = e =>
    {
        e.preventDefault();

        fetch(`https://mywatchlist-apiv2.herokuapp.com/user/forgotPassword/${token}`,
            {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(
                    {
                        "newPassword": repeatNewPassword
                    })
            })
            .then(response => response.json())
            .then(data =>
            {
                if (data.error) throw new Error(data.error);

                setIsPasswordChanged(true);

            })
            .catch(err =>
            {
                setMessage(err.message);
                setState("error");
            })
    }

    const validation = e =>
    {
        e.preventDefault();

        if (!newPassword.trim().length)
        {
            setMessage("New password is required.");
            setState("error");
            return;
        }

        if (!repeatNewPassword.trim().length)
        {
            setMessage("Repeat new password is required.");
            setState("error");
            return;
        }

        if(!newPassword.match(repeatNewPassword))
        {
            setMessage("Passwords does not match!");
            setState("error");
            return;
        }

        handlePasswordRecovery(e);
    }

    return (
        <>
            {!isTokenValid &&
                <div className={styles.token_error_container}>
                    <h1 style={{color: "#ed5d68"}}>{tokenMessage}</h1>
                    <Button href="/forgotPassword">Forgot password</Button>
                </div>
            }

            {isTokenValid && !isPasswordChanged &&
                <div className={styles.forgot_password_change_container}>
                    <h1>Password Recovery</h1>
                    <form onSubmit={validation}>
                        <Input type="password" placeholder="New password" onChange={e => setNewPassword(e.target.value)}  />
                        <Input type="password" placeholder="Repeat new password" onChange={e => setRepeatNewPassword(e.target.value)} />
                        <Input type="submit" value="Change password" />
                    </form>
                </div>
            }

            {isPasswordChanged &&
                <div className={styles.password_status_container}>
                    <h1>Your password has been changed!</h1>
                    <Button width="150px" href="/auth/login">Login</Button>
                </div>
            }
        </>
    );
}

export default ForgotPasswordChange;