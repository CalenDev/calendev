/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
  modalCode: 0,
};

export const GlobalModalSlice = createSlice({
  name: 'GlobalModal',
  initialState,
  reducers: {
    openModal: (state, actions) => {
      const { modalCode } = actions.payload;
      state.isOpen = true;
      state.modalCode = modalCode;
    },
    closeModal: (state) => {
      state.isOpen = false;
    },
  },
});

export const { openModal, closeModal } = GlobalModalSlice.actions;
export const selectModal = (state) => state.GlobalModal;
export default GlobalModalSlice.reducer;
