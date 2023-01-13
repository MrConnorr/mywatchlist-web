import React, {useState} from 'react';
import Cookies from "js-cookie";
import styles from '../../../css/Settings.module.css';
import Button from "../../../utilities/Button";
import Input from "../../../utilities/Input";

function DeleteOption(props)
{
    const {setMessage, setState} = props;

    const [password, setPassword] = useState("");
    const [isConformationVisible, setIsConformationVisible] = useState(false);

    const handleDeleteAccount = () =>
    {
        fetch(`https://mywatchlistapi.onrender.com/user`,
            {
                method: "DELETE",
                headers: {'Authorization': `Bearer ${Cookies.get('token')}`, 'Content-Type': 'application/json'},
                body: JSON.stringify({
                        "password": password
                    })
            })
            .then(response => response.json())
            .then(data => {

                if(data.error) throw new Error(data.error);

                Cookies.remove('token');
                window.location.reload(true);
            })
            .catch(err => {
                setMessage(err.message);
                setState("error");
            })
    }

    return (
        <>
            <h1>Account deletion</h1>
            <Button width="120px" onClick={() => setIsConformationVisible(true)}>Delete Account</Button>

            {isConformationVisible &&
                <div className={styles.deletion_conformation_container}>
                    <div className={styles.deletion_info}>
                        <h2>Are you sure you want to delete your account?</h2>
                            <ul>
                                You will lose access to:
                                <li>Your account</li>
                                <li>Your watchlist</li>
                            </ul>
                        <form className={styles.deletion_form}>
                            <Input type="password" onChange={e => setPassword(e.target.value)} placeholder="Password" />
                            <div className={styles.deletion_controls}>
                                <Button state="tertiary"  onClick={() => setIsConformationVisible(false)}>Cancel</Button>
                                <Button state="delete" onClick={handleDeleteAccount}>Confirm deletion</Button>
                            </div>
                        </form>
                    </div>
                </div>
            }
        </>
    );
}

export default DeleteOption;