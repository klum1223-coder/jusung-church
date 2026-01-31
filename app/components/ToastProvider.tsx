'use client';

import { Toaster as SonnerToaster } from 'sonner';

export function ToastProvider() {
    return (
        <SonnerToaster
            position="bottom-right"
            toastOptions={{
                style: {
                    background: '#ffffff',
                    border: '1px solid #e7e5e4',
                    borderRadius: '16px',
                    padding: '16px 20px',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                },
            }}
            theme="light"
            richColors
            closeButton
        />
    );
}

export { toast } from 'sonner';
