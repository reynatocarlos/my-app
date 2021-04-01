import { createContext, useContext, useReducer } from 'react'
import { reducer, initialState } from './userReducer'

export const UserStateContext = createContext()

export default ({ children }) => {
  const [userState, setUserState] = useReducer(reducer, initialState)

  return (
    <UserStateContext.Provider value={{ userState, setUserState }}>
      {children}
    </UserStateContext.Provider>
  )
}

export const useUserState = () => useContext(UserStateContext)