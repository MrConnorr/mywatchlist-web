import React from 'react';
import {useParams} from "react-router-dom";
import ForgotPasswordEmail from "./ForgotPasswordEmail";
import ForgotPasswordChange from "./ForgotPasswordChange";
import styles from "../../css/ForgotPassword.module.css";
import {Helmet} from "react-helmet-async";

function ForgotPassword(props)
{
   const {setMessage, setState} = props;

    let {token} = useParams();

    return (
        <div className={styles.forgot_password_container}>
            <Helmet>
                <title>Forgot password | My Watch List</title>
            </Helmet>
            {!token && <ForgotPasswordEmail setMessage={setMessage} setState={setState} />}
            {token && <ForgotPasswordChange setMessage={setMessage} setState={setState} />}
        </div>
    );
}

export default ForgotPassword;