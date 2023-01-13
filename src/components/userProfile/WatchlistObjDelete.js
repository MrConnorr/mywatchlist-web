import Cookies from "js-cookie";

export const handleDelete = (setUserWatchlist, setMessage, setState, watchlistArrObjId) =>
{
    fetch(`https://mywatchlistapi.onrender.com/user/watchlist/${watchlistArrObjId}`,
        {
            method: "DELETE",
            headers: {'Authorization': `Bearer ${Cookies.get('token')}`, 'Content-Type': 'application/json'},
        })
        .then(response => response.json())
        .then(data =>
        {
            if(data.error) throw new Error(data.error);

            setUserWatchlist(data.updatedUser.watchlistArr);
            setMessage(data.message);
            setState("success");
        })
        .catch(err =>
        {
            setMessage(err.message)
            setState("error");
        })
}
