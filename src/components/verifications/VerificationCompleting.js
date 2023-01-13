import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import Button from "../../utilities/Button";
import styles from '../../css/Verification.module.css';

function VerificationCompleting(props)
{
    const [isVerified, setIsVerified] = useState(false);
    const [isAlreadyVerified, setIsAlreadyVerified] = useState(false);
    const [isTokenValid, setIsTokenValid] = useState(true);
    let {token} = useParams();

    useEffect(() =>
    {
        fetch(`https://mywatchlistapi.onrender.com/user/verify/${token}`,
            {
                method: "POST"
            })
            .then(response =>
            {
                if(!response.ok) throw new Error(response.status);

                return setIsVerified(true);
            })
            .catch(err =>
            {
                if(err.message === "409") setIsAlreadyVerified(true);
                if(err.message === "500") setIsTokenValid(false);
            })
    }, [])

    return (
        <div className={styles.verification_completing_container}>
            {isTokenValid &&
                <div className={styles.verification_status_container}>
                    {isVerified && <h1>Verification successful</h1>}
                    {isAlreadyVerified && <h1>User already verified!</h1>}

                    <Button width="150px" href="/auth/login">Login</Button>
                </div>
            }

            {!isTokenValid &&
                <h1 style={{color: "#C6394A"}}>Verification token is not valid!</h1>
            }

        </div>
    );
}

export default VerificationCompleting;