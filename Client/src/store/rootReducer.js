import { combineReducers } from 'redux';
import GlobalModal from '../features/GlobalModal/GlobalModalSlice';

const rootReducer = combineReducers({
  GlobalModal,
});

export default rootReducer;
