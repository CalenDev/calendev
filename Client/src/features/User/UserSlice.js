/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { PURGE } from 'redux-persist';

const initialState = {
  isSignin: false,
  userId: 0,
  userEmail: '',
  userNickname: '',
  userRoleCd: '',
};

export const UserSlice = createSlice({
  name: 'User',
  initialState,
  reducers: {
    signinUser: (state, actions) => {
      const { userId, userEmail, userNickname, userRoleCd } = actions.payload;
      state.isSignin = true;
      state.userId = userId;
      state.userEmail = userEmail;
      state.userNickname = userNickname;
      state.userRoleCd = userRoleCd;
    },
    logoutUser: (state) => {
      state.isSignin = false;
      state.userId = 0;
      state.userEmail = '';
      state.userNickname = '';
      state.userRoleCd = '';
    },
    reloadUser: (state, actions) => {
      const { userEmail, userNickname, userRoleCd } = actions.payload;

      if (userEmail) state.userEmail = userEmail;
      if (userNickname) state.userNickname = userNickname;
      if (userRoleCd) state.userRoleCd = userRoleCd;
    },
    extraReducers: (builder) => {
      builder.addCase(PURGE, () => initialState);
    },
  },
});

export const { signinUser, logoutUser, changeUser } = UserSlice.actions;
export const selectUser = (state) => state.User;
export default UserSlice.reducer;
