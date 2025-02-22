import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    setNotificationMessage(state, action) {
      return action.payload
    },
    removeNotification() {
      return ''
    }
  }
})

export const { setNotificationMessage, removeNotification } = notificationSlice.actions 

export const setNotification = (message, time) => {
  return async dispatch => {
    dispatch(setNotificationMessage(message))
    setTimeout(() => {
      dispatch(removeNotification())
    }, time);
  }
}

export default notificationSlice.reducer