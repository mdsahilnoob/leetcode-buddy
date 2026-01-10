import { useState } from 'react';
import Login from '../pages/pages/Login';
import ProfileInput from '../pages/pages/ProfileInput';
import Chart from '../pages/pages/Chart';
import '../../styles/globals.css';

type Page = 'login' | 'id' | 'chart';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [user1, setUser1] = useState('');
  const [user2, setUser2] = useState('');

  const handleLogin = () => {
    setCurrentPage('id');
  };

  const handleCompare = (username1: string, username2: string) => {
    setUser1(username1);
    setUser2(username2);
    setCurrentPage('chart');
  };

  const handleBack = () => {
    setCurrentPage('id');
  };

  return (
    <div className="w-full h-screen">
      {currentPage === 'login' && <Login onLogin={handleLogin} />}
      {currentPage === 'id' && <ProfileInput onCompare={handleCompare} />}
      {currentPage === 'chart' && <Chart user1={user1} user2={user2} onBack={handleBack} />}
    </div>
  );
}

export default App;
