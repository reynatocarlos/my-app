import { createContext, useContext, useReducer } from 'react'
import { reducer, initialState } from './feedReducer'

export const FeedStateContext = createContext()

export default ({ children }) => {
  const [feedState, setFeedState] = useReducer(reducer, initialState)

  return (
    <FeedStateContext.Provider value={{ feedState, setFeedState }}>
      {children}
    </FeedStateContext.Provider>
  )
}

export const useFeedState = () => useContext(FeedStateContext)