import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { useTheme } from '../../hooks/useTheme';
import { PenguinAssistant } from '../assistant/PenguinAssistant';

export const Layout = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen flex flex-col selection:bg-orange-500/30 transition-colors duration-300 ${
      isDark ? 'bg-dark-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Outlet />
      </main>
      <PenguinAssistant />
    </div>
  );
};

