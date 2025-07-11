import { combineReducers, createStoreProvider } from './toolkit';
import { counterSlice } from '../features/counterSlice';

const PERSIST_KEY = 'my-redux-vanilla-root';

type RootState = {
    counter: typeof counterSlice.initialState;
};
// -- Combine reducers
const rootReducer = combineReducers<RootState>({
    counter: counterSlice.reducer,
});

// -- Store initial state
const initialState: RootState = {
    counter: counterSlice.initialState,
};

export const { Provider: StoreProvider, useAppDispatch, useAppSelector } =
    createStoreProvider<RootState>(rootReducer, initialState, PERSIST_KEY);
