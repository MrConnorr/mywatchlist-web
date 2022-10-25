import React, {useEffect, useState} from 'react';
import SearchBar from "./SearchBar";
import styles from '../../css/Navbar.module.css'
import Button from "../../utilities/Button";
import logo from "../../assets/Logo.png";
import LoggedUser from "./LoggedUser";
import Cookies from 'js-cookie';
import {useNavigate} from "react-router-dom";

function NavBar(props)
{
    const {isLoggedIn, setIsLoggedIn} = props;

    const [user, setUser] = useState({});

    const navigate = useNavigate();

    useEffect(() =>
    {
        if(Cookies.get('token') !== undefined)
        {
            fetch(`https://mywatchlist-apiv2.herokuapp.com/user/checkToken/${Cookies.get('token')}`)
                .then(response => response.json())
                .then(data =>
                {
                    if (data.error) throw new Error(data.error);

                    setIsLoggedIn(true);
                })
                .catch(err =>
                {
                    if (err.message === "jwt malformed" || err.message === "jwt expired") return Cookies.remove('token');
                    console.log(err.message);
                })
        }

    }, [])

    useEffect(() =>
    {
        if(isLoggedIn !== false)
        {
            fetch(`https://mywatchlist-apiv2.herokuapp.com/user/`,
                {
                    headers: {'Authorization': `Bearer ${Cookies.get('token')}`}
                })
                .then(response => response.json())
                .then(data =>
                {
                    setUser({_id: data._id, username: data.username, userProfilePic: data.userProfilePic});
                })
        }

    }, [isLoggedIn])

    return (
        <div className={styles.navbar}>
            <div className={styles.navbar_container}>
                <a href="/" className={styles.logo} ><img src={logo} alt="My Watch List logo"/></a>

                <ul className={styles.navigation}>
                    <li><a href="/">Home</a></li>
                    <li><a href="/movies">Movies</a></li>
                    <li><a href="/tvSeries">Series</a></li>
                </ul>

                <div className={styles.user_controls}>
                    <div className={styles.search_container}><SearchBar apiKey={props.apiKey} /></div>
                    {!isLoggedIn &&
                        <div className={styles.auth_container}>
                            <Button width="60px" onClick={() => navigate("/auth/login")} state="secondary">Login</Button>
                            <Button width="60px" onClick={() => navigate("/auth/login")} >Sign Up</Button>
                        </div>
                    }

                    {isLoggedIn &&
                        <LoggedUser setIsLoggedIn={setIsLoggedIn} user={user}/>
                    }
                </div>
            </div>
        </div>
    );
}

export default NavBar;