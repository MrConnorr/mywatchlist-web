import React, {useState} from 'react';
import Cookies from "js-cookie";
import styles from "../../../../css/CommentAdding.module.css";
import Button from "../../../../utilities/Button";
import {useNavigate} from "react-router-dom";

function CommentsAdding(props)
{
    const {mediaType, watchObjId, commentId, setMessage, setState, setComments, setIsReplyClicked, isReplyClicked} = props;

    const [comment, setComment] = useState("");
    const url = isReplyClicked ? `${process.env.API_LINK}/comments/${mediaType}/${watchObjId}/${commentId}` : `${process.env.API_LINK}/comments/${mediaType}/${watchObjId}`;

    const navigate = useNavigate();

    const handleCommentAdding = e =>
    {
        e.preventDefault();

        if(!Cookies.get('token')) return navigate(`/auth/login`);

        if(!comment.trim().length)
        {
            setMessage("Enter your comment first");
            setState("warning");
            return;
        }

        fetch(url,
            {
                method: 'POST',
                headers: {'Authorization': `Bearer ${Cookies.get('token')}`, 'Content-Type': 'application/json'},
                body: JSON.stringify(
                    {
                        "comment": comment
                    })
            })
            .then(response => response.json())
            .then(data =>
            {
                if(data.error) throw new Error(data.error);
                setComments(data.commentsArr);
                setComment("");
                setIsReplyClicked(false);
            })
            .catch(err =>
            {
                setMessage(err.message);
                setState("error");
            })
    }

    return (
        <div className={styles.comments_adding_container}>
            <textarea value={comment} onChange={e => setComment(e.target.value)} style={{width: props.width}}/>
            <div style={{display: "flex"}}><Button onClick={handleCommentAdding}>Leave a comment</Button></div>
        </div>
    );
}

export default CommentsAdding;