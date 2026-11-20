import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./auth/ProtectedRoute.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import LibraryPage from "./pages/LibraryPage.jsx";
import SignInPage from "./pages/SignInPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import { paths } from "./path.js";

function App() {
  return (
    <Routes>
      <Route path={paths.home} element={<LandingPage />} />
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