import React from 'react';
import { BsHeart, BsHeartFill, BsStarFill, BsStarHalf, BsReplyFill, BsTrashFill, BsFillFilePersonFill, BsFillExclamationTriangleFill, BsCheckLg, BsExclamationLg, BsFillPlayCircleFill, BsPlayFill, BsArchiveFill, BsFillCalendarEventFill, BsFillTrash2Fill, BsBoxArrowUpRight } from 'react-icons/bs';
import { FaUserCircle, FaCog, FaEdit, FaCheck, FaTimes, FaSistrix, FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight, FaAngleDown, FaUndo } from 'react-icons/fa';
import { BiLogOut, BiMoviePlay, BiHome, BiTv } from 'react-icons/bi';

export const Icons =
{
    heart: <BsHeart size={20} />,
    fillHeart: <BsHeartFill size={20} color={"#7f5af0"}/>,
    reply: <BsReplyFill size={25} />,
    user: <FaUserCircle size={20} />,
    gear: <FaCog size={20} />,
    halfStar: <BsStarHalf />,
    star: <BsStarFill />,
    logout: <BiLogOut size={20}/>,
    edit: <FaEdit size={20} />,
    delete: <BsTrashFill size={20} />,
    check: <FaCheck size={20} />,
    close: <FaTimes size={25} />,
    search: <FaSistrix />,
    arrowDoubleLeft: <FaAngleDoubleLeft />,
    arrowDoubleRight: <FaAngleDoubleRight />,
    arrowLeft: <FaAngleLeft />,
    arrowRight: <FaAngleRight />,
    arrowDown: <FaAngleDown size={20} />,
    movieClapper: <BiMoviePlay size={100} />,
    seriesTv: <BiTv />,
    person: <BsFillFilePersonFill size={100} />,
    danger: <BsFillExclamationTriangleFill />,
    success: <BsCheckLg />,
    warning: <BsExclamationLg />,
    play: <BsFillPlayCircleFill />,
    home: <BiHome size={20} />,
    cancelEdit: <FaUndo size={20} />,
    externalLink: <BsBoxArrowUpRight />,

    statusWatching: <BsPlayFill size={20} />,
    statusCompleted: <BsCheckLg size={20} />,
    statusPostponed: <BsArchiveFill size={20} />,
    statusPlanToWatch: <BsFillCalendarEventFill size={20} />,
    statusDropped: <BsFillTrash2Fill size={20} />

}