import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import styles from '../../css/Authorization.module.css';
import {Icons} from '../../utilities/Icons';
import Input from "../../utilities/Input";

function SignUp(props)
{
    const {setMessage, setState} = props;

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [profilePic, setProfilePic] = useState(null);

    const [checkUsername, setCheckUsername] = useState("");
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);

    const navigate = useNavigate();
    const handleSignUp = e =>
    {
        e.preventDefault();

        const body = new FormData();
        body.append('username', username);
        body.append('email', email);
        body.append('password', repeatPassword);
        body.append('userProfilePic', profilePic);

        fetch(`${process.env.API_LINK}/user/signup`,
            {
                method: "POST",
                body: body
            })
            .then(response => response.json())
            .then(data => {

                if(data.error) throw new Error(data.error);

                navigate(`/verification`, {state: {user: data.createdUser.email}})

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

        if(!username.trim().length)
        {
            setMessage("Username is required.");
            setState("error");
            return;
        }

        if(!isUsernameAvailable)
        {
            setMessage("Username is not available.");
            setState("error");
            return;
        }

        if (!email.trim().length)
        {
            setMessage("Email is required.");
            setState("error");
            return;
        }

        if (!password.trim().length)
        {
            setMessage("Password is required.");
            setState("error");
            return;
        }

        if (!repeatPassword.trim().length)
        {
            setMessage("Repeat password is required.");
            setState("error");
            return;
        }

        if(!password.match(repeatPassword))
        {
            setMessage("Passwords does not match!");
            setState("error");
            return;
        }

        handleSignUp(e);
    }


    useEffect(() =>
    {
        const onChanged = setTimeout(() =>
        {
            setCheckUsername(username.trim());
        }, 500);
        return () => clearInterval(onChanged);

    }, [username])


    useEffect(() =>
    {
        if(checkUsername !== "")
        {
            fetch(`${process.env.API_LINK}/user/check/${checkUsername}`)
                .then(response => response.json())
                .then(data => {
                    setIsUsernameAvailable(data.available);
                })
                .catch(err => {
                    setMessage(err.message)
                    setState("error");
                })
        }
    }, [checkUsername])

    return (
        <div className={styles.signup_container}>
            <h1>Sign Up</h1>
            <form className={styles.form} method="POST" encType="multipart/form-data" action={`${process.env.API_LINK}/user/signup`} onSubmit={validation}>
                <div className={styles.username_container}>
                    <Input type="text" className={styles.username_input} placeholder="Username" maxLength="20" name="username" onChange={e => setUsername(e.target.value)} />
                    {checkUsername !== "" && <div className={styles.icon}>{Icons[isUsernameAvailable ? "check" : "close"]}</div>}
                </div>
                <Input type="email" placeholder="Email" name="email" onChange={e => setEmail(e.target.value)} />
                <Input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
                <Input type="password" placeholder="Repeat Password" name="password" onChange={e => setRepeatPassword(e.target.value)} />

                <label className={styles.profile_pic_container}>
                    <img src={profilePic ? URL.createObjectURL(profilePic) : null} alt={""} />
                    <Input type="file" name="userProfilePic" onChange={e => setProfilePic(e.target.files[0])}
                           accept="image/png, image/jpeg, image/gif" />
                    <div style={{visibility:  profilePic ? "hidden" : "visible"}} className={styles.drag_and_drop_info}>
                        Drag & Drop a file<br />
                        OR
                        <div><b>Click here</b> to browse</div>
                    </div>
                </label>

                <Input type="submit" value="Sign Up" />
            </form>

            <div className={styles.signup_prompt_container}>
                Already have an Account? <b onClick={() => navigate('/auth/login')}>Login</b>
            </div>
        </div>
    );
}

export default SignUp;