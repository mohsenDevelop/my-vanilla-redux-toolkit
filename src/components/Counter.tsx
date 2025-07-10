import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/store';
import { counterSlice, fetchCount } from '../features/counterSlice';

export default function Counter() {
    const value = useAppSelector(state => state.counter.value);
    const status = useAppSelector(state => state.counter.status);
    const error = useAppSelector(state => state.counter.error);

    const dispatch = useAppDispatch();
    const [asyncError, setAsyncError] = useState<string | null>(null);

    const handleFetch = async () => {
        setAsyncError(null);
        try {
            const result = await dispatch(fetchCount(value));
            alert(`Fetched: ${result}`);
        } catch (err: any) {
            setAsyncError(err.message);
            dispatch(counterSlice.actions.setError(err.message));
        }
    };

    return (
        <div>
            <h2>Value: {value}</h2>
            <button onClick={() => dispatch(counterSlice.actions.increment())}>+</button>
            <button onClick={() => dispatch(counterSlice.actions.decrement())}>-</button>
            <button onClick={handleFetch} disabled={status === 'loading'}>Fetch (Async Thunk)</button>
            {status === 'loading' && <span>Loading...</span>}
            {asyncError && <div style={{ color: 'red' }}>Local Error: {asyncError}</div>}
            {error && <div style={{ color: 'darkred' }}>Global State Error: {error}</div>}
        </div>
    );
}
