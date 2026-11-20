import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./auth/ProtectedRoute.jsx";
import { paths } from "./path.js";

function SignInPage() {
  return <main><h1>Sign in</h1></main>;
}

function SignUpPage() {
  return <main><h1>Sign up</h1></main>;
}

function LibraryPage() {
  return <main><h1>Library</h1></main>;
}

function App() {
  return (
    <Routes>
      <Route path={paths.login} element={<SignInPage />} />
      <Route path={paths.signup} element={<SignUpPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path={`${paths.library}/:folderId?`} element={<LibraryPage />} />
      </Route>
      <Route path="*" element={<Navigate to={paths.library} replace />} />
    </Routes>
  );
}

export default App;