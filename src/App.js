import React, {useState} from 'react';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

import NavBar from "./components/navbar/NavBar";
import WatchObjSwitcher from "./components/watchObj/WatchObjSwitcher";
import SearchList from "./components/SearchList";
import Verification from "./components/verifications/Verification";
import ForgotPassword from "./components/forgotPassword/ForgotPassword";
import UserProfile from "./components/userProfile/UserProfile";
import NotFound from "./components/NotFound";
import Settings from "./components/userProfile/settings/Settings";
import Main from "./components/mainPage/Main";
import Authorization from "./components/authorization/Authorization";
import Movies from "./components/Movies";
import Series from "./components/Series";
import GlobalMessage from "./utilities/GlobalMessage";
import Cookies from 'js-cookie';
import Footer from "./components/Footer";
import ScrollRestoration from "./utilities/ScrollRestoration";
import {HelmetProvider } from 'react-helmet-async';

const apiKey = "e544c1f89832b4dc78d96d46df921a91";

function App() {

    const [message, setMessage] = useState("");
    const [state, setState] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const redirectOnToken = () =>
    {
        if(Cookies.get('token'))
        {
            fetch(`${process.env.API_LINK}/user/checkToken/${Cookies.get('token')}`)
                .then(response =>
                {
                    if(response.ok)
                    {
                        window.location.replace("/");
                    } else
                    {
                        Cookies.remove('token');
                    }
                })
        }
    }

  return (
      <Router>
          <NavBar apiKey={apiKey} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          {message !== "" &&
            <GlobalMessage message={message} state={state} setMessage={setMessage} setState={setState} />
          }
          <ScrollRestoration />
          <HelmetProvider>
              <Routes>
                  <Route path="*" element={<NotFound />} />
                  <Route path="/" element={<Main apiKey={apiKey} />} />
                  <Route path="/:mediaType/:watchObjId" element={<WatchObjSwitcher apiKey={apiKey} setMessage={setMessage} setState={setState} />}/>
                  <Route path="/movies" element={<Movies apiKey={apiKey}/>} />
                  <Route path="/movies/:type" element={<Movies apiKey={apiKey}/>} />
                  <Route path="/tvSeries" element={<Series apiKey={apiKey}/>} />
                  <Route path="/tvSeries/:type" element={<Series apiKey={apiKey}/>} />
                  <Route path="/search" element={<SearchList apiKey={apiKey} />}/>
                  <Route path="/auth/:option" element={<Authorization redirectOnToken={redirectOnToken} setMessage={setMessage} setState={setState} apiKey={apiKey} setIsLoggedIn={setIsLoggedIn} />} />
                  <Route path="/verification" element={<Verification redirectOnToken={redirectOnToken} setMessage={setMessage} setState={setState} />} />
                  <Route path="/verification/:token" element={<Verification redirectOnToken={redirectOnToken} setMessage={setMessage} setState={setState} />} />
                  <Route path="/forgotPassword" element={<ForgotPassword setMessage={setMessage} setState={setState} />} />
                  <Route path="/forgotPassword/:token" element={<ForgotPassword setMessage={setMessage} setState={setState} />} />
                  <Route path="/user/:username" element={<UserProfile setMessage={setMessage} setState={setState} />} />
                  <Route path="/settings/:option" element={<Settings setMessage={setMessage} setState={setState} />} />
                  <Route path="/settings/" element={<Settings setMessage={setMessage} setState={setState} />} />
              </Routes>
          </HelmetProvider>
          <Footer />
      </Router>
    );
}

export default App;
