import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage/session';
import User from '../features/User/UserSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['User'],
};

const rootReducer = combineReducers({
  User,
});

export default persistReducer(persistConfig, rootReducer);
