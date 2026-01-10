import { useState } from 'react';
import { CardDemo } from 'extension/src/components/card';
import reactLogo from '@/assets/react.svg';
import wxtLogo from '/wxt.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      <CardDemo />
    </div>
  );
}

export default App;
