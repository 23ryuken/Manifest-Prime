import { useAuth } from './auth/useAuth.js';

function App() {
  const { user, loading, sessionError, retrySession } = useAuth();
  if (loading) {
    return <p>Checking session...</p>;
  }
  if (sessionError) {
    return (
      <>
        <p>Unable to check session: {sessionError.message}</p>
        <button onClick={retrySession}>Retry</button>
      </>
    );
  }
  return <p>{user ? `Signed in as ${user.name}` : 'Signed out'}</p>;
}

export default App;