import { useNavigate, Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TabNavigation } from './TabNavigation';

export const Layout: React.FC = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Determine active tab from current route
    const activeTab = location.pathname === '/' ? 'home' : location.pathname.substring(1).split('/')[0];

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex flex-col min-h-screen bg-secondary pb-24">
            <main className="flex-1 w-full max-w-[480px] mx-auto bg-white min-h-screen shadow-lg relative">
                <Outlet />
            </main>
            <TabNavigation activeTab={activeTab} onTabChange={(id) => navigate(`/${id}`)} />
        </div>
    );
};
