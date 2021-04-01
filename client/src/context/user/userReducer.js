const userActionTypes = {
  INIT: 'INIT',
}

const initialState = {
  isLogIn: localStorage.getItem('user') ? true : false,
  isAuthenticate: false,
  user: null,
}

const reducer = (state, action) => {
  switch (action.type) {
    case userActionTypes.INIT:
      return {
        ...state,
        isAuthenticate: true,
        isLogIn: true,
        user: action.user
      }
    default:
      return state
  }
}

export { userActionTypes, initialState, reducer }