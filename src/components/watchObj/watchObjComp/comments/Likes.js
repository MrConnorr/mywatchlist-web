import React, {useEffect, useState} from 'react';
import Cookies from "js-cookie";
import Button from "../../../../utilities/Button";
import styles from "../../../../css/Comments.module.css";

function Likes(props)
{
    const {mediaType, watchObjId, likes, commentId, setMessage, setState} = props;

    const [likeBtnIcon, setLikeBtnIcon] = useState("heart");
    const [isLikeHovered, setIsLikeHovered] = useState(false);
    const [likesArr, setLikesArr] = useState(likes);
    const [usersLikeCommentsId, setUsersLikeCommentsId] = useState([]);
    const [likeClicked, setLikedClicked] = useState(false);

    useEffect(() =>
    {
        if(Cookies.get(`token`)) {
            fetch(`${process.env.API_LINK}/comments/userLikes/${mediaType}/${watchObjId}`,
                {
                    headers: {'Authorization': `Bearer ${Cookies.get('token')}`}
                })
                .then(response => response.json())
                .then(data => {
                    if (data.error) throw new Error(data.error);
                    setUsersLikeCommentsId(data.likes);
                })
                .catch(err => {
                    setMessage(err.message);
                    setState("error");
                })
        }
    }, [likeClicked])

    useEffect(() =>
    {
        usersLikeCommentsId.map(comment =>
        {
            if (comment.commentId === commentId)
            {
                setLikeBtnIcon("fillHeart");
            }
        })

    }, [usersLikeCommentsId])

    const handleLikeClick = () =>
    {
        if(likeBtnIcon === "heart")
        {
            fetch(`${process.env.API_LINK}/comments/like/${mediaType}/${watchObjId}/${commentId}`,
                {
                    method: "POST",
                    headers: {'Authorization': `Bearer ${Cookies.get('token')}`}
                })
                .then(response => response.json())
                .then(data =>
                {
                    if(data.error) throw new Error(data.error);
                    setLikedClicked(current => !current);
                    setLikesArr(data);
                    setLikeBtnIcon("fillHeart");
                })
                .catch(err =>
                {
                    setMessage(err.message);
                    setState("error");
                })
        } else
        {
            fetch(`${process.env.API_LINK}/comments/like/${mediaType}/${watchObjId}/${commentId}`,
                {
                    method: "DELETE",
                    headers: {'Authorization': `Bearer ${Cookies.get('token')}`}
                })
                .then(response => response.json())
                .then(data =>
                {
                    if(data.error) throw new Error(data.error);
                    setLikedClicked(current => !current);
                    setLikesArr(data)
                    setLikeBtnIcon("heart");
                })
                .catch(err =>
                {
                    setMessage(err.message);
                    setState("error");
                })
        }
    }

    let openLikesTimer;
    let closeLikesTimer;

    const handleMouseHovering = e =>
    {
        if(e.type === "mouseenter")
        {
            openLikesTimer = setTimeout(() =>
            {
                setIsLikeHovered(true);
            }, 500);
        } else
        {
            clearInterval(openLikesTimer);

            closeLikesTimer = setTimeout(() =>
            {
                setIsLikeHovered(false);
            }, 500);
        }
    }

    return (
        <>
            <Button state="tertiary"
                    icon={likeBtnIcon}
                    onMouseEnter={e => handleMouseHovering(e)}
                    onMouseLeave={e => handleMouseHovering(e)}
                    onClick={handleLikeClick}>{likesArr.length > 0 ? likesArr.length : null}</Button>
            {isLikeHovered && likesArr.length > 0 &&
                <div className={styles.likes_container} onMouseEnter={() => clearInterval(closeLikesTimer)} onMouseLeave={e => handleMouseHovering(e)}>
                    {likesArr.map(like =>
                        <a key={like.userId} className={styles.like_content} href={`/user/${like.username}`}>
                            <img src={`https://res.cloudinary.com/hlzbzu7fj/image/upload/${like.username}-profilePic.png`} alt={like.username + " profile picture"}/>
                            {like.username.slice(0, 6)}...
                        </a>
                    )}

                </div>
            }
        </>
    );
}

export default Likes;