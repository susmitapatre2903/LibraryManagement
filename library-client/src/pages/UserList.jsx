import { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../AuthContext";

const empty = { username: "", password: "", role: "Librarian" };

const messageFrom = (err, fallback) => {
  const data = err.response?.data;
  if (typeof data === "string") return data;
  if (data?.errors) return Object.values(data.errors).flat().join(" ");
  return fallback;
};

export default function UserList() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");

  const loadUsers = () => {
    api
      .get("/users")
      .then((res) => {
        setUsers(res.data);
        setError("");
      })
      .catch(() => setError("Could not load users."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccess("");
    try {
      await api.post("/users", form);
      setSuccess(`User "${form.username}" created.`);
      setForm(empty);
      loadUsers();
    } catch (err) {
      setFormError(messageFrom(err, "Could not create the user."));
    }
  };

  const handleDelete = async (u) => {
    if (!window.confirm(`Delete user "${u.username}"?`)) return;
    setFormError("");
    setSuccess("");
    try {
      await api.delete(`/users/${u.id}`);
      loadUsers();
    } catch (err) {
      setFormError(messageFrom(err, "Could not delete the user."));
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <h2>Add User</h2>
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          autoComplete="off"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password (min 8 characters)"
          value={form.password}
          onChange={handleChange}
          autoComplete="new-password"
          minLength={8}
          required
        />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="Librarian">Librarian</option>
          <option value="Admin">Admin</option>
        </select>
        <button className="secondary" type="submit">Add</button>
        {formError && <p style={{ color: "red" }}>{formError}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
      </form>

      <h2>Users</h2>
      {loading && <p>Loading users...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Role</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>
                  {u.username}
                  {u.username === user.username && " (you)"}
                </td>
                <td>{u.role}</td>
                <td>
                  {u.username !== user.username && (
                    <button className="danger" onClick={() => handleDelete(u)}>
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}