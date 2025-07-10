import { createSlice, createAsyncThunk } from '../app/toolkit';

export const counterSlice = createSlice({
    name: 'counter',
    initialState: { value: 0, status: 'idle', error: null as string | null },
    reducers: {
        increment: state => ({ ...state, value: state.value + 1 }),
        decrement: state => ({ ...state, value: state.value - 1 }),
        setError: (state, action) => ({ ...state, error: action.payload }),
    },
});

export const fetchCount = createAsyncThunk<number, number>(
    'counter/fetchCount',
    async (amount) => {
        await new Promise(res => setTimeout(res, 500));
        if (amount < 0) throw new Error('No negative value!');
        return amount * 2;
    }
);