import { useAuth } from './auth/useAuth.js';

function App() {
  const { user, loading } = useAuth();
  if (loading) {
    return <p>Checking session...</p>;
  }
  return <p>{user ? `Signed in as ${user.name}` : 'Signed out'}</p>;
}

export default App;