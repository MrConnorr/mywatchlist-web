import React, {useState} from 'react';
import Cookies from "js-cookie";
import styles from '../../../css/Settings.module.css';

function AccountOption(props)
{
    const [profilePic, setProfilePic] = useState(null);

    const {setMessage, setState} = props;

    const handleProfilePictureChange = e =>
    {
        e.preventDefault();

        if(profilePic !== null)
        {
            const body = new FormData();
            body.append('userProfilePic', profilePic);
            body.append('username', props.user.username);

            fetch("https://mywatchlist-apiv2.herokuapp.com/user/profilePic",
                {
                    method: "PATCH",
                    headers: {'Authorization': `Bearer ${Cookies.get('token')}`},
                    body: body
                })
                .then(response => response.json())
                .then(data =>
                {
                    if(data.error) throw new Error(data.error);

                    setMessage("Profile picture changed");
                    setState("success");
                })
                .catch(err => {
                    setMessage(err.message);
                    setState("error");
                })
        }
    }

    const profilePicInput =
    {
        all: "revert",
        width:" 380px",
        height: "150px",
        opacity: 0,
        position: "absolute",
        cursor: "pointer"
    }

    const submitBtn =
    {
        border: "none",
        width: "150px",
        borderRadius: "5px",
        padding: "5px",
        fontSize: "20px"
    }

    return (
        <>
            <h1>Account settings</h1>
            <div className={styles.account_container}>

                <h2>Profile picture</h2>

                <div className={styles.profile_pic_container}>

                    <div className={styles.profile_pic}>
                        <img src={profilePic ? URL.createObjectURL(profilePic) : `https://mywatchlist-apiv2.herokuapp.com/${props.user.userProfilePic}`} alt={`https://mywatchlist-apiv2.herokuapp.com/${props.user.username} profile`} />
                    </div>

                    <form className={styles.account_form} method="POST" encType="multipart/form-data" action="https://mywatchlist-apiv2.herokuapp.com/user/profilePic" onSubmit={handleProfilePictureChange}>
                        <label className={styles.drag_and_drop_info}>
                            Drag & Drop a file<br />
                            OR <br />
                            Click here to browse
                            <input style={profilePicInput} type="file" name="userProfilePic" onChange={event => setProfilePic(event.target.files[0])}
                                   accept="image/png, image/jpeg, image/gif" />
                        </label>
                        <input style={submitBtn} type="submit" value="Upload picture" />
                    </form>
                </div>

                <h2>Account info</h2>
                <div className={styles.account_info}>
                    <h4>Username: {props.user.username}</h4>
                    <h4>Email: {props.user.email}</h4>
                </div>

            </div>
        </>
    );
}

export default AccountOption;