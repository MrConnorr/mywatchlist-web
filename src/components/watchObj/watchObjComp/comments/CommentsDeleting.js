import React, {useEffect, useState} from 'react';
import Cookies from "js-cookie";
import Button from "../../../../utilities/Button";

function CommentsDeleting(props)
{
    const {mediaType, watchObjId, setMessage, setState, commentId, setComments} = props;

    const [userCommentsId, setUserCommentsId] = useState([]);
    const [isDeleteVisible, setIsDeleteVisible] = useState(false);

    useEffect(() =>
    {
        if(Cookies.get(`token`))
        {
            fetch(`${process.env.API_LINK}/comments/userComments/${mediaType}/${watchObjId}`,
                {
                    headers: {'Authorization': `Bearer ${Cookies.get('token')}`}
                })
                .then(response => response.json())
                .then(data =>
                {
                    if(data.error) throw new Error(data.error);
                    setUserCommentsId(data.comments);
                })
                .catch(err =>
                {
                    setMessage(err.message);
                    setState("error");
                })
        }
    }, [])

    useEffect(() =>
    {
        userCommentsId.map(comment =>
        {
            if (comment.commentId === commentId)
            {
                setIsDeleteVisible(true);
            }
        })

    }, [userCommentsId])

    const handleCommentDelete = () =>
    {
        fetch(`${process.env.API_LINK}/comments/${mediaType}/${watchObjId}/${commentId}`,
            {
                method: 'DELETE',
                headers: {'Authorization': `Bearer ${Cookies.get('token')}`}
            })
            .then(response => response.json())
            .then(data =>
            {
                if(data.error) throw new Error(data.error);
                setComments(data.commentsArr);
            })
            .catch(err =>
            {
                setMessage(err.message);
                setState("error");
            })
    }

    return (
        <>
            {isDeleteVisible &&
                <Button onClick={handleCommentDelete} state="tertiary" icon="delete" />
            }
        </>
    );
}

export default CommentsDeleting;