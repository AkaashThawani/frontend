import React from 'react';
import clsx from 'clsx';

interface MetricCardProps {
    title: string;
    value: string | number;
    trend?: string;
    trendUp?: boolean;
    icon?: React.ElementType;
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, trend, trendUp, icon: Icon }) => {
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{value}</h3>
                {trend && (
                    <div className={clsx("flex items-center mt-2 text-sm font-medium", trendUp ? "text-green-600" : "text-red-600")}>
                        <span>{trend}</span>
                    </div>
                )}
            </div>
            {Icon && (
                <div className="p-3 bg-brand-50 rounded-lg text-brand-600">
                    <Icon className="w-6 h-6" />
                </div>
            )}
        </div>
    );
};
