import React, {useEffect, useState} from 'react';
import CommentsAdding from "./CommentsAdding";
import CommentsDeleting from "./CommentsDeleting";
import Likes from "./Likes";
import styles from "../../../../css/Comments.module.css";
import Button from "../../../../utilities/Button";
import Moment from "moment";
import Cookies from 'js-cookie';

function Comments(props)
{
    const {mediaType, watchObjId, setState, setMessage} = props;

    const [comments, setComments] = useState([]);
    const [isReplyClicked, setIsReplyClicked] = useState(false);
    const [replyCommentId, setReplyCommentId] = useState(null);
    const [secondSlice, setSecondSlice] = useState(10);

    const commentAddForm = (commentId, width) =>
    {
        return <CommentsAdding commentId={commentId} watchObjId={watchObjId} mediaType={mediaType}
                               setComments={setComments} setMessage={setMessage} setState={setState} setIsReplyClicked={setIsReplyClicked} isReplyClicked={isReplyClicked} width={width} />;
    }

    useEffect(() =>
    {
        fetch(`https://mywatchlist-apiv2.herokuapp.com/comments/${mediaType}/${watchObjId}`)
            .then(response => response.json())
            .then(data =>
            {
                if(data.error) throw new Error(data.error);
                setComments(data.commentsArr ? data.commentsArr : data);
            })
            .catch(err =>
            {
                setMessage(err.message);
                setState("error");
            })
    }, [watchObjId]);


    const handleReplyClick = (commentId) =>
    {
        setIsReplyClicked(current => !current);
        setReplyCommentId(commentId);
    }

    useEffect(() =>
    {

    }, [])

    return (
        <>
            <h2>Comments</h2>

            <div className={styles.comments_main_container}>

                <div className={styles.comments_container}>
                    {comments.length === 0 && <p>No comments were found. Be the first one to comment!</p>}
                    {commentAddForm()}

                    {comments.slice(0, secondSlice).map(comment =>
                        <div key={comment.id} className={styles.comment_container} style={{marginLeft: comment.replyToReply ? "75px" : comment.replyTo ? "37.5px" : null, borderLeft: comment.replyTo || comment.replyToReply ? "2px dashed" : null}}>
                            <div className={styles.comment_content}>
                                <img src={`https://mywatchlist-apiv2.herokuapp.com/usersProfilePics/${comment.deleted ? "default.jpg" : comment.createdBy.username + "-profilePic.png"}`} alt={`${comment.createdBy.username} profile picture`} />

                                <div className={styles.comment_info}>
                                    <div className={styles.user_info}>
                                        <a className={styles.username} href={`http://localhost:3000/user/${comment.createdBy.username}`}>{comment.createdBy.username}</a>
                                        <span style={{color: "rgba(255, 255, 255, 0.7)"}}>Created: {Moment(comment.createdDate).format("DD.MM.YYYY HH:mm")}</span>
                                    </div>

                                    {comment.replyToReply ?
                                        <span className={styles.comment} style={{display: "flex", gap: "10px"}}><a className={styles.username} style={{color: Cookies.get(`username`) === comment.replyTo.username ? "yellow" : null}} href={`/user/${comment.replyTo.username}`}>@{comment.replyTo.username}</a>{comment.comment}</span>
                                        : <span className={styles.comment}>{comment.comment}</span>}

                                    <div className={styles.comment_interaction}>
                                        {!comment.deleted &&
                                            <>
                                                <Likes likes={comment.likes} commentId={comment.id} watchObjId={watchObjId} mediaType={mediaType} setMessage={setMessage} setState={setState}/>
                                                <Button icon="reply" state="tertiary" onClick={() => handleReplyClick(comment.id)} />
                                                <CommentsDeleting commentId={comment.id} watchObjId={watchObjId} mediaType={mediaType} setComments={setComments} setMessage={setMessage} setState={setState} />
                                            </>
                                        }
                                    </div>
                                    {isReplyClicked && replyCommentId === comment.id && commentAddForm(comment.id, "455px")}

                                </div>
                            </div>
                        </div>
                    )}
                    {secondSlice < comments.length &&
                        <div className={styles.show_more_comments}><Button state="tertiary" onClick={() => setSecondSlice(secondSlice + 10)}>Show more</Button></div>
                    }
                </div>

            </div>
        </>
    );
}

export default Comments;