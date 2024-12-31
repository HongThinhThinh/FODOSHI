import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";
import { Persistor } from "redux-persist"; // Import types from redux-persist
import { Store } from "@reduxjs/toolkit"; // Import Store type
import rootReducer from "./rootReducer";

// Persist config typing
const persistConfig = {
  key: "root",
  storage,
};

// Properly typed rootReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Typed store
export const store: Store = configureStore({
  reducer: persistedReducer,
});

// Typed persistor
export const persistor: Persistor = persistStore(store);
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
