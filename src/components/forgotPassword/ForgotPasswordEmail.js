import React, {useState} from 'react';
import styles from "../../css/ForgotPassword.module.css";
import Input from "../../utilities/Input";

function ForgotPasswordEmail(props)
{
    const {setMessage, setState} = props;

    const [user, setUser] = useState("");

    const handlePasswordRecoveryEmail = e =>
    {
        e.preventDefault();

        fetch(`${process.env.API_LINK}/user/forgotPassword`,
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(
                    {
                        "user": user
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
    }

    return (
        <div className={styles.forgot_password_email_container}>

            <h1>Forgot your password? You can reset it!</h1>
            <form onSubmit={handlePasswordRecoveryEmail}>
                <Input type="text" placeholder="Username or email" onChange={event => setUser(event.target.value)} />
                <Input type="submit" value="Send my password reset link" />
            </form>

        </div>
    );
}

export default ForgotPasswordEmail;