'use client';

import { useEffect } from 'react';

export default function ServiceWorkerUnregister() {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(function (registrations) {
                for (let registration of registrations) {
                    registration.unregister();
                    console.log('Service Worker Unregistered');
                }
            });
        }
    }, []);

    return null;
}
