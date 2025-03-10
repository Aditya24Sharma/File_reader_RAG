'use client'
import {useEffect } from 'react';

interface NotificationProps {
    message: string;
    type: 'success' | 'error';
    show: boolean;
    onClose: () => void;
}

export default function NotificationBanner({ message, type, show, onClose }: NotificationProps) {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000); // Banner will show for 3 seconds

            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    if (!show) return null;

    const bgColor = type === 'success' ? 'bg-blue-400': 'bg-red-400';

    return (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 ${bgColor} text-gray-800 px-6 py-1 rounded-xl shadow-lg z-50 transition-all duration-300 ease-in-out`}>
            {message}
        </div>
    );
} 