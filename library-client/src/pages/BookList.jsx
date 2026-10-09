import { useEffect, useState } from "react";
import api from "../api";
import AddBook from "./BookForm";
import {useAuth} from "../AuthContext";
export default function BookList(){

    const { user } = useAuth();
    const isAdmin = user?.role === "Admin";

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingBook, setEditingBook] = useState(null);

    const loadBooks = () =>{
        api
            .get("/books")
            .then((res)=> {
                setBooks(res.data);
                setError("");
        })
            .catch(()=> setError("Could not load books. Is the API running?"))
            .finally(()=> setLoading(false));
            
    };

    useEffect(()=>{
        loadBooks();
    },[]);

    const handleDelete = async(id)=>{
       if(!window.confirm("Delete this Book?")) return;
       try{
       await api.delete(`/books/${id}`);
       loadBooks(); 
       } catch(err){
        console.error("Delete failed:",err);
        setError("Could not delete the book.");
       }
    };

    const handleSaved = () =>{
        setEditingBook(null);
        loadBooks();
    }
    
    return(
        <div>
            {isAdmin && (
            <AddBook 
                editingBook={editingBook}
                onSaved={handleSaved}
                onCancel={() => setEditingBook(null)}
            />
            )}
         <h2>Books</h2>
         {loading && <p>Loading Books...</p>}
         {error && <p>{error}</p>}
 
         {!loading && !error && books.length === 0 && <p>No books found.</p>}
         {!loading && !error &&(
         <table border ="1" cellPadding ="8">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>ISBN</th>
                    <th>Copies</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                { books.map((b)=> (
                    <tr key={b.id}>
                        <td>{b.title}</td>
                        <td>{b.author}</td>
                        <td>{b.isbn}</td>
                        <td>{b.copiesAvailable}</td>
                       {isAdmin && ( 
                        <td>
                            <button className="secondary" onClick={()=> setEditingBook(b)}>Edit</button>{" "}
                            <button className="danger" onClick={() => handleDelete(b.id)}>Delete</button>
                        </td>  
                       )}  
                    </tr>
                ))}     
            </tbody>
        </table>
         )}
    </div>
    ); 
}