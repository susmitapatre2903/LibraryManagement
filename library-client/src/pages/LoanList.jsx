import { useEffect, useState } from "react";
import api from "../api";

const getErrorText = (err, fallback) => {
  const data = err.response?.data;
  return typeof data === "string" ? data : fallback;
};

const statusOf = (loan) => {
  if (loan.returnedOn) return "Returned";
  return new Date(loan.dueOn) < new Date() ? "Overdue" : "Borrowed";
};

export default function LoanList() {
  const [loans, setLoans] = useState([]);
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [bookId, setBookId] = useState("");
  const [memberId, setMemberId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");

  const loadAll = async () => {
    try {
      const [loansRes, booksRes, membersRes] = await Promise.all([
        api.get("/loans"),
        api.get("/books"),
        api.get("/members"),
      ]);
      setLoans(loansRes.data);
      setBooks(booksRes.data);
      setMembers(membersRes.data);
      setError("");
    } catch {
      setError("Could not load data. Is the API running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleBorrow = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccess("");
    try {
      await api.post("/loans/borrow", {
        bookId: Number(bookId),
        memberId: Number(memberId),
      });
      setBookId("");
      setMemberId("");
      setSuccess("Book borrowed. Due in 14 days.");
      loadAll();
    } catch (err) {
      setFormError(getErrorText(err, "Could not borrow the book."));
    }
  };

  const handleReturn = async (id) => {
    setFormError("");
    setSuccess("");
    try {
      await api.post(`/loans/${id}/return`);
      setSuccess("Book returned.");
      loadAll();
    } catch (err) {
      setFormError(getErrorText(err, "Could not return the book."));
    }
  };

  return (
    <div>
      <form onSubmit={handleBorrow} style={{ marginBottom: 20 }}>
        <h2>Borrow a Book</h2>
        <select value={bookId} onChange={(e) => setBookId(e.target.value)} required>
          <option value="">Select a book</option>
          {books.map((b) => (
            <option key={b.id} value={b.id} disabled={b.copiesAvailable < 1}>
              {b.title} ({b.copiesAvailable} available)
            </option>
          ))}
        </select>{" "}
        <select value={memberId} onChange={(e) => setMemberId(e.target.value)} required>
          <option value="">Select a member</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.fullName}
            </option>
          ))}
        </select>{" "}
        <button className="secondary" type="submit">Borrow</button>
        {formError && <p style={{ color: "red" }}>{formError}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
      </form>

      <h2>Loans</h2>
      {loading && <p>Loading loans...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && loans.length === 0 && <p>No loans yet.</p>}
      {!loading && !error && loans.length > 0 && (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Book</th>
              <th>Member</th>
              <th>Borrowed</th>
              <th>Due</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loans.map((l) => (
              <tr key={l.id}>
                <td>{l.bookTitle}</td>
                <td>{l.memberName}</td>
                <td>{new Date(l.borrowedOn).toLocaleDateString()}</td>
                <td>{new Date(l.dueOn).toLocaleDateString()}</td>
                <td style={{ color: statusOf(l) === "Overdue" ? "red" : "inherit" }}>
                  {statusOf(l)}
                </td>
                <td>
                  {!l.returnedOn && (
                    <button className="secondary" onClick={() => handleReturn(l.id)}>Return</button>
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