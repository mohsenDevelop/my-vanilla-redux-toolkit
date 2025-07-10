import React from 'react';
import { createRoot } from 'react-dom/client';
import { StoreProvider } from './app/store';
import Counter from './components/Counter';

createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <StoreProvider>
            <Counter />
        </StoreProvider>
    </React.StrictMode>,
)
