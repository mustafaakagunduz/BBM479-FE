import { Routes, Route } from 'react-router-dom';
import AuthPage from './components/auth/AuthPage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
    </Routes>
  );
};

export default App;
