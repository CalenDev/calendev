import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage/session';
import User from '../features/User/UserSlice';
import GlobalModal from '../features/GlobalModal/GlobalModalSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['User'],
};

const rootReducer = combineReducers({
  GlobalModal,
  User,
});

export default persistReducer(persistConfig, rootReducer);
