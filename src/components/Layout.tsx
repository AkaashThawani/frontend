import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Megaphone, TrendingUp, Settings } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const navItems = [
        { label: 'Dashboard', href: '/', icon: LayoutDashboard },
        { label: 'Campaigns', href: '/campaigns', icon: Megaphone },
        { label: 'Business Goals', href: '/goals', icon: TrendingUp },
        { label: 'Settings', href: '/settings', icon: Settings },
    ];

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-brand-600 flex items-center gap-2">
                        RedditMaster
                    </h1>
                </div>
                <nav className="mt-4 px-4 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.href}
                            to={item.href}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                                    ? 'bg-brand-50 text-brand-700'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`
                            }
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-gray-50">
                <div className="p-8 w-full">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
