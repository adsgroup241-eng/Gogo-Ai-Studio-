import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from '@/components/ui/sonner';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import VideoGenerator from './pages/VideoGenerator';
import MusicGenerator from './pages/MusicGenerator';
import VoiceGenerator from './pages/VoiceGenerator';
import ChatAssistant from './pages/ChatAssistant';
import Templates from './pages/Templates';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Admin from './pages/Admin';
import AdCreator from './pages/AdCreator';
import History from './pages/History';
import Gallery from './pages/Gallery';
import MeetingGenerator from './pages/MeetingGenerator';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-background text-foreground">Loading...</div>;
  return user ? <>{children}</> : <Navigate to="/" />;
}

function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <>{children}</>;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/video" element={<PrivateRoute><VideoGenerator /></PrivateRoute>} />
            <Route path="/music" element={<PrivateRoute><MusicGenerator /></PrivateRoute>} />
            <Route path="/voice" element={<PrivateRoute><VoiceGenerator /></PrivateRoute>} />
            <Route path="/chat" element={<PrivateRoute><ChatAssistant /></PrivateRoute>} />
            <Route path="/templates" element={<PrivateRoute><Templates /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
            <Route path="/ads" element={<PrivateRoute><AdCreator /></PrivateRoute>} />
            <Route path="/gallery" element={<PrivateRoute><Gallery /></PrivateRoute>} />
            <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
            <Route path="/meeting" element={<PrivateRoute><MeetingGenerator /></PrivateRoute>} />
          </Routes>
        </AppLayout>
      </Router>
      <Toaster position="top-right" richColors />
    </AuthProvider>
  );
}
