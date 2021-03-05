export default function (state, action) {
  switch (action.type) {
    case 'SET_VALUES':
      return {
        ...state,
        ...action.data
      }
    case 'SET_PROGRESS':
      const current = [...state.uploadImagesProgress];
      current[action.data.index] = action.data.progress;

      return {
        ...state,
        uploadImagesProgress: current
      }
    default:
      return state;
  }
}