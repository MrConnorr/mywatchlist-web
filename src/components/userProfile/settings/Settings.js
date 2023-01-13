import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import Cookies from 'js-cookie'
import AccountOption from "./AccountOption";
import SecurityOption from "./SecurityOption";
import DeleteOption from "./DeleteOption";
import styles from '../../../css/Settings.module.css';
import Button from "../../../utilities/Button";
import {Helmet} from "react-helmet-async";


function Settings(props)
{
    const {setMessage, setState} = props;

    const {option} = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState({});

    useEffect(() =>
    {
        if(!Cookies.get('token')) return navigate('/auth/login');

        if (!option) navigate('/settings/account', {replace: true});
    }, []);

    useEffect(() =>
    {
        fetch(`${process.env.API_LINK}/user/`,
            {
                headers: {'Authorization': `Bearer ${Cookies.get('token')}`}
            })
            .then(response => response.json())
            .then(data =>
            {
                if(data.error) throw new Error(data.error);
                setUser(data);

            })
            .catch(err =>
            {
                if(err.message === "Auth failed") return navigate('/auth/login');
                setMessage(err.message)
                setState("error");
            })

    }, [])

    const renderSwitch = () =>
    {
        switch (option)
        {
            case "account":
                return <AccountOption user={user} setMessage={setMessage} setState={setState} />
            case "security":
                return <SecurityOption password={user.password} setMessage={setMessage} setState={setState} />
            case "delete":
                return <DeleteOption id={user._id} password={user.password} setMessage={setMessage} setState={setState} />
        }
    }

    return (
        <div className={styles.settings_container}>
            <Helmet>
                <title>{option !== undefined ? option.charAt(0).toUpperCase() + option.slice(1) + " settings | My Watch List" : ""}</title>
            </Helmet>
            <div className={styles.settings_content_container}>
                <div className={styles.controls_container}>
                    <Button width="300px" fontSize="30px" state={option !== "account" ? "ghost" : null} onClick={() => navigate('/settings/account')}>Account</Button>
                    <Button width="300px" fontSize="30px" state={option !== "security" ? "ghost" : null} onClick={() => navigate('/settings/security')}>Security</Button>
                    <Button width="300px" fontSize="30px" state={option !== "delete" ? "ghost" : null} onClick={() => navigate('/settings/delete')}>Delete</Button>
                </div>

                    <div className={styles.settings_content}>
                        {renderSwitch()}
                    </div>
            </div>
        </div>
    );
}

export default Settings;