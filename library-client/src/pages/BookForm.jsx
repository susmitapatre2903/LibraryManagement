import { useEffect, useState } from "react";
import api from "../api";

const empty = { title: "", author: "", isbn: "", copiesAvailable: 1 };

export default function BookForm({ onSaved, editingBook, onCancel }) {
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(editingBook ?? empty);
  }, [editingBook]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "copiesAvailable" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingBook) {
        await api.put(`/books/${editingBook.id}`, { ...form, id: editingBook.id });
      } else {
        await api.post("/books", form);
      }
      setForm(empty);
      onSaved();
    } catch {
      setError("Could not save the book.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <h2>{editingBook ? "Edit Book" : "Add Book"}</h2>
      <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />{" "}
      <input name="author" placeholder="Author" value={form.author} onChange={handleChange} required />{" "}
      <input name="isbn" placeholder="ISBN" value={form.isbn} onChange={handleChange} required />{" "}
      <input name="copiesAvailable" type="number" min="0" value={form.copiesAvailable} onChange={handleChange} />{" "}
      <button  className="secondary" type="submit">{editingBook ? "Update" : "Add"}</button>
      {editingBook && (
        <button className="secondary" type="button" onClick={onCancel} style={{ marginLeft: 8 }}>
          Cancel
        </button>
      )}
      {error && <p>{error}</p>}
    </form>
  );
}

