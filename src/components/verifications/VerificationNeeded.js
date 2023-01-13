import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import styles from '../../css/Verification.module.css';
import Button from "../../utilities/Button";
import Input from "../../utilities/Input";

function VerificationNeeded(props)
{
    const {setMessage, setState} = props;

    const location = useLocation();
    const navigate = useNavigate();

    const [isInputDisabled, setIsInputDisabled] = useState(true);
    const [isVerifyResendClicked, setIsVerifyResendClicked] = useState(false);
    const [currentEmail, setCurrentEmail] = useState(location.state !== null ? location.state.user : "");
    const [oldEmail, setOldEmail] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [password, setPassword] = useState("");

    const emailValidation = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    useEffect(() =>
    {
        if(!currentEmail.length)
        {
            return navigate('/', {replace: true});
        }

        if(!currentEmail.toLowerCase().match(emailValidation))
        {
            fetch(`https://mywatchlistapi.onrender.com/user/getEmail/${currentEmail}`)
                .then(response => response.json())
                .then(data => setCurrentEmail(data.email))
                .catch(err => console.log(err))
        }
    }, []);

    useEffect(() =>
    {
        if (oldEmail !== "")
        {
            if(currentEmail !== oldEmail && currentEmail.trim().length && currentEmail.toLowerCase().match(emailValidation)) setNewEmail(currentEmail);
        }
        if(oldEmail === currentEmail) setNewEmail("");

    }, [currentEmail]);

    const handleEmailInputChange = () =>
    {

        if (!currentEmail.trim().length || !currentEmail.toLowerCase().match(emailValidation))
        {
            setMessage("Please enter a valid email address.");
            setState("error");
            return;
        }

        if(!password.trim().length && newEmail.trim().length)
        {
            setMessage("Please enter your password.");
            setState("error");
            return;
        }

        setIsInputDisabled(current => !current);
        setOldEmail(currentEmail);

        if(newEmail.trim().length && oldEmail !== newEmail && password.trim().length) return handleEmailChange();
    }

    const handleEmailChange = () =>
    {
        fetch("https://mywatchlistapi.onrender.com/user/verify/changeEmail",
            {
                method: "PATCH",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(
                    {
                        "email": oldEmail,
                        "newEmail": newEmail,
                        "password": password
                    })
            })
            .then(response => response.json())
            .then(data =>
            {
                if (data.error) throw new Error(data.error);

                fetch(`https://mywatchlistapi.onrender.com/user/verifyResend`,
                    {
                        method: "POST",
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify(
                            {
                                "email": data,
                            })
                    })
                    .then(response => response.json())
                    .then(() =>
                    {

                        setMessage("Email was changed successfully. Verification email was sent to new email.");
                        setState("success");
                        navigate('/verification', {state: {user: currentEmail, replace: true}})
                    })
                    .catch(err => console.log(err))
            })
            .catch(err =>
            {
                setMessage(err.message);
                setState("error");

                setCurrentEmail(oldEmail);
                setNewEmail("");
                setOldEmail("");
                setPassword("");
                setIsInputDisabled(false);
            })
    }


    const handleVerifyResend = () =>
    {
        setIsVerifyResendClicked(true);
        fetch(`https://mywatchlistapi.onrender.com/user/verifyResend`,
            {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(
                    {
                        "email": currentEmail
                    })
            })
            .then(response => response.json())
            .then(data =>
            {
                if (data.error) throw new Error(data.error);
                setMessage(data.message);
                setState("success");
            })
            .catch(err =>
            {
                setMessage(err.message);
                setState("error");
            })
            .finally(() => setIsVerifyResendClicked(false));
    }

    return (
        <div className={styles.verification_needed_container}>
            <h1>Please verify your email</h1>
            Verification email has been sent to:
            <div className={styles.email_input}>
                <Input type="email" disabled={isInputDisabled} value={currentEmail} placeholder="Email" onChange={e => setCurrentEmail(e.target.value)} />
                <Button onClick={handleEmailInputChange} icon={isInputDisabled ? "edit" : "check"} state={(password.trim().length && newEmail.trim().length && oldEmail !== newEmail) || isInputDisabled ? isVerifyResendClicked ? "disabled" : "tertiary" : "disabled"} />
                {!isInputDisabled && <Button onClick={() => setIsInputDisabled(true)} icon="close" state="tertiary" />}
            </div>
            {!isInputDisabled && <Input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
            }

            <div className={styles.resent_controls}>
                <Button width="300px" onClick={handleVerifyResend} state={isVerifyResendClicked ? "disabled" : "primary"}>Resend verification email</Button>
            </div>
        </div>
    );
}

export default VerificationNeeded;