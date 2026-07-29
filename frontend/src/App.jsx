// src/App.jsx
// Root component. Wraps the whole app in the browser router and the
// authentication context provider, then renders the route table.
// Kept intentionally thin — actual routes live in routes/AppRoutes.jsx.

import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import AppRoutes from './routes/AppRoutes.jsx';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
