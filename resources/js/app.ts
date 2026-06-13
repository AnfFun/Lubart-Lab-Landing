import { createInertiaApp } from '@inertiajs/vue3';

const appName = import.meta.env.VITE_APP_NAME || 'LubartLab';

createInertiaApp({
    title: (title) => title || appName,
    progress: {
        color: '#f97316',
    },
});
