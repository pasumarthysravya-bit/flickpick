import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { MovieDetails } from './pages/MovieDetails';
import { Favorites } from './pages/Favorites';
import { SearchResults } from './pages/SearchResults';
import { Trending } from './pages/Trending';
import { PersonDetails } from './pages/PersonDetails';
import { AuthProvider } from './contexts/AuthContext';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { FavoritesProvider } from './hooks/useFavorites';

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="movie/:id" element={<MovieDetails />} />
              <Route path="person/:id" element={<PersonDetails />} />
              <Route path="search/:query" element={<SearchResults />} />
              <Route path="favorites" element={
                <ProtectedRoute>
                  <Favorites />
                </ProtectedRoute>
              } />
              <Route path="trending" element={<Trending />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;
