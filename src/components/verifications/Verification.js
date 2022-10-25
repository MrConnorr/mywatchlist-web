import React from 'react';
import {useParams} from "react-router-dom";
import VerificationNeeded from "./VerificationNeeded";
import VerificationCompleting from "./VerificationCompleting";
import styles from '../../css/Verification.module.css';
import {Helmet} from "react-helmet-async";

function Verification(props)
{
    const {redirectOnToken, setMessage, setState} = props;

    let {token} = useParams();

    redirectOnToken();

    return (
        <div className={styles.verification_container}>
            <Helmet>
                <title>Verification | My Watch List</title>
            </Helmet>
            {!token && <VerificationNeeded setMessage={setMessage} setState={setState} />}

            {token && <VerificationCompleting />}

        </div>
    );
}

export default Verification;