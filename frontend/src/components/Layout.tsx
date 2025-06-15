import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, List, Users, CalendarDays, LogOut, User as UserIcon, Menu } from 'lucide-react';
import { Link, useLocation, Outlet } from 'react-router-dom';

const Layout = () => {
    const { user, signOut } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();

    const sidebarItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
        { id: 'notices', label: 'Notices', icon: List, path: '/notices' },
        { id: 'placements', label: 'Placements', icon: Users, path: '/placements' },
        { id: 'events', label: 'Events', icon: CalendarDays, path: '/events' },
        { id: 'profile', label: 'Profile', icon: UserIcon, path: '/profile' },
    ];
    
    const topBarItems = [
        { label: 'Home', path: '/' },
        { label: 'Notices', path: '/notices' },
        { label: 'Placements', path: '/placements' },
        { label: 'Events', path: '/events' },
        { label: 'Contact', path: '/contact' },
    ];

    return (
        <div className="min-h-screen bg-gray-950">
            {/* Top Navigation */}
            <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-12">
                            <h1 className="text-xl font-bold text-white">UVCE Noticeboard</h1>
                            <div className="hidden lg:flex space-x-8">
                                {topBarItems.map((item) => (
                                    <Link
                                        key={item.label}
                                        to={item.path}
                                        className={`text-gray-300 hover:text-white transition-colors duration-200 px-4 py-2 rounded-lg ${
                                            location.pathname === item.path ? 'bg-gray-800 text-white' : 'hover:bg-gray-800'
                                        }`}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center space-x-6">
                            <span className="hidden sm:block text-gray-300">
                                Welcome, {user?.username}
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="lg:hidden text-gray-300 hover:text-white hover:bg-gray-800"
                            >
                                <Menu className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex">
                {/* Sidebar */}
                <aside className={`${
                    sidebarOpen ? 'w-64' : 'w-20'
                } transition-all duration-300 bg-gray-900 border-r border-gray-800 min-h-[calc(100vh-4rem)] sticky top-16`}>
                    <div className="p-6">
                        <div className="space-y-3">
                            {sidebarItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.id}
                                        to={item.path}
                                        className={`flex items-center space-x-4 px-4 py-3 rounded-lg transition-all duration-200 ${
                                            isActive
                                                ? 'bg-gray-800 text-white border-l-4 border-white'
                                                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                        }`}
                                    >
                                        <Icon className="w-5 h-5 flex-shrink-0" />
                                        {sidebarOpen && (
                                            <span className="font-medium">{item.label}</span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                        
                        {/* Logout Button */}
                        <div className="mt-12 pt-6 border-t border-gray-800">
                            <button
                                onClick={signOut}
                                className={`flex items-center space-x-4 px-4 py-3 rounded-lg transition-all duration-200 text-red-400 hover:bg-red-900/20 hover:text-red-300 w-full`}
                            >
                                <LogOut className="w-5 h-5 flex-shrink-0" />
                                {sidebarOpen && (
                                    <span className="font-medium">Logout</span>
                                )}
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 bg-gray-950">
                    <div className="p-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;