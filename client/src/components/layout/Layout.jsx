import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Header from './Header';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
    const { user } = useAuth();
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header onMobileMenuClick={() => { }} />
                <main className="py-6">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        );
    }

    // largura da sidebar
    const sidebarWidth = isSidebarCollapsed ? "sm:ml-20" : "sm:ml-64";

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar fixa */}
            <Sidebar
                isMobileOpen={mobileSidebarOpen}
                setIsMobileOpen={setMobileSidebarOpen}
                isCollapsed={isSidebarCollapsed}
                setIsCollapsed={setIsSidebarCollapsed}
            />

            {/* Conteúdo principal EMPURRADO */}
            <div
                className={`flex flex-col min-h-screen transition-all duration-300 ease-in-out ${sidebarWidth}`}
            >
                <Header onMobileMenuClick={() => setMobileSidebarOpen(true)} />

                <main className="flex-1 py-6">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
