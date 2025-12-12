import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
    message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
    message = "Processing..."
}) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl flex items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
                <span className="text-gray-900">{message}</span>
            </div>
        </div>
    );
};

export default LoadingOverlay;
