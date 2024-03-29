import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage/session';
import User from '../features/User/UserSlice';
import GlobalModal from '../features/GlobalModal/GlobalModalSlice';
import Bookmark from '../features/Bookmark/BookmarkSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['User', 'Bookmark'],
};

const rootReducer = combineReducers({
  GlobalModal,
  User,
  Bookmark,
});

export default persistReducer(persistConfig, rootReducer);
