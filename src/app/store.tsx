import { combineReducers, createStoreProvider } from './toolkit';
import { counterSlice } from '../features/counterSlice';

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
    createStoreProvider<RootState>(rootReducer, initialState);
