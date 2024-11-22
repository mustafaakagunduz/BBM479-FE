// components/LoadingScreen.tsx
import { CircularProgress } from '@mui/material';

export const LoadingScreen: React.FC = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex justify-center items-center">
        <CircularProgress />
    </div>
);

export default LoadingScreen;