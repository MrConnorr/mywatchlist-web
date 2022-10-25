import React, {useState} from 'react';
import Cookies from "js-cookie";
import styles from "../../../../css/CommentAdding.module.css";
import Button from "../../../../utilities/Button";

function CommentsAdding(props)
{
    const {mediaType, watchObjId, commentId, setMessage, setState, setComments, setIsReplyClicked, isReplyClicked} = props;

    const [comment, setComment] = useState("");
    const url = isReplyClicked ? `https://mywatchlist-apiv2.herokuapp.com/comments/${mediaType}/${watchObjId}/${commentId}` : `https://mywatchlist-apiv2.herokuapp.com/comments/${mediaType}/${watchObjId}`;

    const handleCommentAdding = e =>
    {
        e.preventDefault();

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