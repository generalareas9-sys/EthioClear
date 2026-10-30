// src/App.jsx
// Root component. Wraps the whole app in BrowserRouter, LanguageProvider,
// and AuthProvider, then renders the route table.
// Single polished light-only theme — ThemeProvider removed cleanly.

import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { LanguageProvider } from './i18n/LanguageContext.jsx';
import AppRoutes from './routes/AppRoutes.jsx';

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
