import { useEffect } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { createBrowserHistory } from 'history'

import { useUserState } from './context/user/UserStateProvider'
import { userActionTypes } from './context/user/userReducer'
import FeedStateProvider from './context/feed/FeedStateProvider'

import axios from './config/axios'

import { Feed, Form, Navigation } from './helpers/components'
import { Spinner } from './helpers/svg'
import './App.css';

import { feedScroll } from './utils/feedScroll'

function App() {
  const { userState, setUserState } = useUserState()

  useEffect(() => {
    window.addEventListener('scroll', feedScroll)
    return () => window.removeEventListener('scroll', feedScroll)
  }, [])

  useEffect(async () => {
    let res = await axios.get('/api/accounts/auth', { headers: { 'authorization': localStorage.getItem('user')}})

    if (res.status === 200) {
      setUserState({ type: userActionTypes.INIT, user: res.data.user })
    }
  }, [])

  return (
    <main className='app'>
      {!userState.isLogIn ? <Form /> : (
        <>
          {!userState.isAuthenticate ? <Spinner className='spinner' /> : (
            <>
              <Navigation />

              <div className='app__home'>
                <FeedStateProvider>
                  <Router history={createBrowserHistory} >
                    <Route exact path='/' render={() => <Feed />} />
                    <Route path='/home' render={() => <Feed />} />
                  </Router>
                </FeedStateProvider>
              </div>
            </>
          )}
        </>
      )}
    </main>
  );
}

export default App;
