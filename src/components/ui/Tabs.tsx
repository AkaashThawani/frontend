import React from 'react';
import clsx from 'clsx';

// Custom Tabs Implementation
interface TabsProps {
    defaultValue: string;
    children: React.ReactNode;
    onValueChange?: (value: string) => void;
}

const TabsContext = React.createContext<{ activeTab: string; setActiveTab: (v: string) => void } | null>(null);

export const Tabs: React.FC<TabsProps> = ({ defaultValue, children, onValueChange }) => {
    const [activeTab, setActiveTab] = React.useState(defaultValue);

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        if (onValueChange) {
            onValueChange(value);
        }
    };

    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
            <div className="w-full">{children}</div>
        </TabsContext.Provider>
    );
};

export const TabsList: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="flex border-b border-gray-200 gap-6">
        {children}
    </div>
);

interface TabsTriggerProps {
    value: string;
    children: React.ReactNode;
    icon?: React.ElementType;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children, icon: Icon }) => {
    const context = React.useContext(TabsContext);
    if (!context) throw new Error("TabsTrigger must be used within Tabs");

    const isActive = context.activeTab === value;
    return (
        <button
            onClick={() => context.setActiveTab(value)}
            className={clsx(
                "flex items-center gap-2 pb-3 text-sm font-medium transition-colors border-b-2 -mb-px",
                isActive ? "border-brand-600 text-brand-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            )}
        >
            {Icon && <Icon className="w-4 h-4" />}
            {children}
        </button>
    );
};

export const TabsContent: React.FC<{ value: string; children: React.ReactNode }> = ({ value, children }) => {
    const context = React.useContext(TabsContext);
    if (!context) return null;
    if (context.activeTab !== value) return null;
    return <div className="animate-in fade-in zoom-in-95 duration-200">{children}</div>;
};
