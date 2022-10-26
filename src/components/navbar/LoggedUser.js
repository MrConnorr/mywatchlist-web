import React, {useEffect, useState} from 'react';
import Cookies from "js-cookie";
import styles from '../../css/LoggedUser.module.css'
import Button from "../../utilities/Button";

function LoggedUser(props)
{
    const {user} = props;
    const [isUserIconClicked, setIsUserIconClicked] = useState(false);

    const handleLoginOut = () =>
    {
        Cookies.remove('token');
        Cookies.remove('username');
        window.location.reload(true);
    }

    const handleUserIconClicked = () =>
    {
        if(Object.keys(user).length !== 0) setIsUserIconClicked(current => !current);
    }

    return (
        <>
            <div className={styles.user_icon} onClick={handleUserIconClicked}>
                <img src={user.userProfilePic} alt="Profile picture" />
            </div>

            {isUserIconClicked &&
                <div className={styles.user_info}>
                    <div className={styles.username}>
                        <a href={`/user/${user.username}`}><img src={`https://mywatchlist-apiv2.herokuapp.com/${user.userProfilePic}`} alt={user.username + " profile picture"} /></a> {user.username}
                    </div>
                    <div className={styles.user_control}>
                        <Button justifyContent="flex-start" state="tertiary" icon="user" href={`/user/${user.username}`}>Profile</Button>
                        <Button justifyContent="flex-start" state="tertiary" icon="gear" href='/settings'>Settings</Button>
                        <Button justifyContent="flex-start" state="tertiary" icon="logout" onClick={handleLoginOut}>Logout</Button>
                    </div>
                </div>
            }
        </>
    );
}

export default LoggedUser;
