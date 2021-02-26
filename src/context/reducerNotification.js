export default function (state, action) {
  switch (action.type) {
    case 'SET_VALUES':
      return {
        ...state,
        ...action.data
      }
    default:
      return state;
  }
}