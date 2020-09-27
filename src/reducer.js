export const initialState = {
  user: null,
  uid: null,
  togglerState: 1,
  photoURL: '',
};

export const actionTypes = {
  SET_USER: 'SET_USER',
  SET_SESSION: 'SET_SESSION',
  SET_TOGGLER: 'SET_TOGGLER',
};

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.user,
      };
    default:
      return state;
  }
};

export default reducer;
