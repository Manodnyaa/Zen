import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

// Components
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import JournalForm from './components/JournalForm';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Journal from './pages/Journal';
import JournalDetail from './pages/JournalDetail';
import MoodTracker from './pages/MoodTracker';
import Chatbot from './pages/Chatbot';
import BreathingExercise from './pages/BreathingExercise';
import NotFound from './pages/NotFound';
import LandingPage from './pages/LandingPage';

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
};

const AppContent = () => {

  const { darkMode } = useTheme();

  const theme = React.useMemo(() =>
    createTheme({
      palette: {
        mode: darkMode ? 'dark' : 'light',
        primary: { main: '#6a5acd' },
        secondary: { main: '#9370db' },
        background: {
          default: darkMode ? '#121212' : '#f5f7fa',
          paper: darkMode ? '#1e1e1e' : '#ffffff',
        },
      }
    }),
    [darkMode]
  );

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />

      <Router>

        <Routes>

          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          } />

          <Route path="/journal" element={<Journal />} />
          <Route path="/journal/:id" element={<JournalDetail />} />
          <Route path="/journal/new" element={<JournalForm isEditing={false} />} />
          <Route path="/journal/edit/:id" element={<JournalForm isEditing={true} />} />

          <Route path="/mood" element={<MoodTracker />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/breathing" element={<BreathingExercise />} />

          {/* fallback */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />

        </Routes>

      </Router>

    </MuiThemeProvider>
  );
};

export default App;