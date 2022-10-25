import React, {useState} from 'react';
import Cookies from "js-cookie";
import styles from '../../../css/Settings.module.css';
import Input from "../../../utilities/Input";

function SecurityOption(props)
{
    const {setMessage, setState} = props;

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordRepeat, setNewPasswordRepeat] = useState("");

    const handleChangePassword = e =>
    {
        e.preventDefault();

        fetch("https://mywatchlist-apiv2.herokuapp.com/user/password",
            {
                method: "PATCH",
                headers: {'Authorization': `Bearer ${Cookies.get('token')}`, 'Content-Type': 'application/json'},
                body: JSON.stringify(
                    {
                        "currentPassword": currentPassword,
                        "newPassword": newPasswordRepeat
                    })
            })
            .then(response => response.json())
            .then(data =>
            {
                if(data.error) throw new Error(data.error);

                setMessage("Password changed successfully");
                setState("success");
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

        if (!currentPassword.trim().length)
        {
            setMessage("Current password is required.");
            setState("error");
            return;
        }

        if (!newPassword.trim().length)
        {
            setMessage("New password is required.");
            setState("error");
            return;
        }

        if (!newPasswordRepeat.trim().length)
        {
            setMessage("Repeat new password is required.");
            setState("error");
            return;
        }

        if(!newPassword.match(newPasswordRepeat))
        {
            setMessage("New passwords does not match!");
            setState("error");
            return;
        }

        handleChangePassword(e);
    }

    return (
        <>
            <h1>Security settings</h1>
            <form onSubmit={validation} className={styles.security_form}>
                <h2>Change password</h2>
                <Input width="300px" type="password" placeholder="Current password" onChange={event => setCurrentPassword(event.target.value)} />
                <Input width="300px" type="password" placeholder="New password" onChange={event => setNewPassword(event.target.value)} />
                <Input width="300px" type="password" placeholder="Repeat new password" onChange={event => setNewPasswordRepeat(event.target.value)} />
                <Input width="334px" type="submit" value="Change password" />
            </form>
        </>
    );
}
export default SecurityOption;