import { lazy, Suspense, useState } from 'react';
import Login from './pages/Login';
import ProfileInput from './pages/ProfileInput';
import type { UserStats } from '@/services/api';
import '../../styles/globals.css';

type Page = 'login' | 'id' | 'chart';
const Chart = lazy(() => import('./pages/Chart'));

type ComparePayload = {
  user1: string;
  user2: string;
  profile1?: UserStats;
  profile2?: UserStats;
};

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [user1, setUser1] = useState('');
  const [user2, setUser2] = useState('');
  const [prefetchedProfile1, setPrefetchedProfile1] = useState<UserStats | null>(null);
  const [prefetchedProfile2, setPrefetchedProfile2] = useState<UserStats | null>(null);

  const handleLogin = () => {
    setCurrentPage('id');
  };

  const handleCompare = ({ user1: username1, user2: username2, profile1, profile2 }: ComparePayload) => {
    setUser1(username1);
    setUser2(username2);
    setPrefetchedProfile1(profile1 ?? null);
    setPrefetchedProfile2(profile2 ?? null);
    setCurrentPage('chart');
  };

  const handleBack = () => {
    setPrefetchedProfile1(null);
    setPrefetchedProfile2(null);
    setCurrentPage('id');
  };

  return (
    <div className="w-full h-screen">
      {currentPage === 'login' && <Login onLogin={handleLogin} />}
      {currentPage === 'id' && <ProfileInput onCompare={handleCompare} />}
      {currentPage === 'chart' && (
        <Suspense
          fallback={
            <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4">
              <div className="text-center">
                <div className="w-10 h-10 border-4 border-[#58a6ff] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-sm text-[#8b949e]">Loading chart...</p>
              </div>
            </div>
          }
        >
          <Chart
            user1={user1}
            user2={user2}
            onBack={handleBack}
            initialProfile1={prefetchedProfile1}
            initialProfile2={prefetchedProfile2}
          />
        </Suspense>
      )}
    </div>
  );
}

export default App;
