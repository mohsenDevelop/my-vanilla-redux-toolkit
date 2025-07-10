import React, { createContext, useContext, useReducer, useRef, useState, useEffect, ReactNode, Reducer } from 'react';

export type Action = { type: string, payload?: any };
export type Thunk<R = any> = (dispatch: any, getState: () => any) => R;
export type Dispatch = (action: Action | Thunk<any>) => any;

// -- Slices
export const createSlice = <State, Reducers extends Record<string, (state: State, action: Action) => State>>(options: {
    name: string;
    initialState: State;
    reducers: Reducers;
}) => {

    const { name, initialState, reducers } = options;

    const actions = {} as Record<keyof Reducers, (payload?: any) => Action>

    for (const key in reducers) {
        actions[key] = (payload: any) => ({ type: `${name}/${key}`, payload });
    }

    const reducer = (state = initialState, action: Action): State => {
        const type = action.type.replace(`${name}/`, "");
        console.log({ type })
        if ((reducers as any)[type]) {
            return (reducers as any)[type](state, action.payload);
        }
        return state;
    };
    console.log({ actions, reducer, });

    return { actions, reducer, name, get initialState() { return initialState } };
};


// -- Thunk

export const createAsyncThunk = <TArg, TResult>(
    typePrefix: string,
    payloadCreator: (arg: TArg, thunkApi: { dispatch: Dispatch, getState: () => any }) => Promise<TResult>
) => {
    return (arg: TArg) => async (dispatch: Dispatch, getState: () => any) => {
        dispatch({ type: `${typePrefix}/pending`, payload: arg });

        try {
            const result = await payloadCreator(arg, { dispatch, getState });
            dispatch({ type: `${typePrefix}/fulfilled`, payload: result });
            return result;

        } catch (error) {

            dispatch({ type: `${typePrefix}/rejected`, payload: error instanceof Error ? error.message : error });
            throw error;
        }
    }
};

// -- Root reducer combiner
export const combineReducers = <Slices extends Record<string, any>>(reducers: Record<keyof Slices, Function>) => {
    return (state: Slices, action: Action) => {
        const nextState: any = {};
        for (const key in reducers) {
            nextState[key] = reducers[key](state[key], action);
        }
        console.log({ nextState })
        return nextState as Slices;
    };
}

// -- Store Provider & Hooks
export const createStoreProvider = <State,>(reducer: (state: State, action: Action) => State, initialState: State) => {

    const StoreContext = createContext<any>(null);

    const Provider = ({ children }: { children: ReactNode }) => {

        const [state, origDispatch] = useReducer(reducer, initialState)

        const stateRef = useRef(state);
        useEffect(() => { stateRef.current = state; }, [state]);

        const getState = () => stateRef.current;

        const dispatch: Dispatch = (action) => {
            if (typeof action === 'function') {
                return (action as Thunk)(dispatch, getState);
            } else {
                return origDispatch(action);
            }
        };

        const store = { state, dispatch };

        return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
    }

    const useStore = () => useContext(StoreContext);
    const useAppDispatch = () => useStore().dispatch;

    const useAppSelector = <R,>(selector: (state: State) => R): R => {
        const { state } = useStore();
        const [selected, setSelected] = useState(() => selector(state));
        useEffect(() => setSelected(selector(state)), [state]);
        return selected;
    };

    return { Provider, useStore, useAppDispatch, useAppSelector };
}