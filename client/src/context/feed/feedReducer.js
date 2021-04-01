const feedActionTypes = {
  INIT: 'INIT',
}

const initialState = {
  posts: []
}

const reducer = (state, action) => {
  switch (action.type) {
    case feedActionTypes.INIT:
      return {
        ...state,
        posts: action.posts
      }
    default:
      return state
  }
}

export { feedActionTypes, initialState, reducer }