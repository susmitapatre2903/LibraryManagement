import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Login from "./pages/Login";
import BookList from "./pages/BookList";
import MemberList from "./pages/MemberList";
import LoanList from "./pages/LoanList";
import UserList from "./pages/UserList";

function RequireAuth({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function RequireAdmin({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return user.role === "Admin" ? children : <Navigate to="/books" replace />;
}

export default function App() {
  const { user, logout } = useAuth();

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-top">
          <h1>📚 Library Management</h1>
          {user && (
            <div className="user-bar">
              <span>
                {user.username} ({user.role})
              </span>
              <button type="button" onClick={logout}>
                Logout
              </button>
            </div>
          )}
        </div>
        {user && (
          <nav>
            <NavLink to="/books">Books</NavLink>
            <NavLink to="/members">Members</NavLink>
            <NavLink to="/loans">Loans</NavLink>
            {user.role === "Admin" && <NavLink to="/users">Users</NavLink>}
          </nav>
        )}
      </header>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/books" replace />} />
        <Route path="/books" element={<RequireAuth><BookList /></RequireAuth>} />
        <Route path="/members" element={<RequireAuth><MemberList /></RequireAuth>} />
        <Route path="/loans" element={<RequireAuth><LoanList /></RequireAuth>} />
        <Route path="/users" element={<RequireAdmin><UserList /></RequireAdmin>} />
        <Route path="*" element={<Navigate to="/books" replace />} />
      </Routes>
    </div>
  );
}