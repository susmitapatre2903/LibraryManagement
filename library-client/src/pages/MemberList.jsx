import { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../AuthContext";

const empty ={fullName:"",email:"",phone:""};

function MemberForm({editingMember, onSaved, onCancel}){
    const[form, setForm] = useState(empty);
    const[error, setError] = useState("");
 
useEffect(()=> {
 setForm(editingMember ?? empty);
 setError("");
}, [editingMember]);

const handleChange =(e)=> setForm({...form,[e.target.name]:e.target.value});
const handleSubmit = async(e)=> {
    e.preventDefault();
    setError("");
    try{
        if(editingMember){
            await api.put(`/members/${editingMember.id}`,{
                ...form,
                id: editingMember.id,
            });
        } else{
            await api.post("/members",form);
        }
        setForm(empty);
        onSaved();
    } catch(err){
        const errors = err.response?.data?.errors;
        setError(
            errors ? Object.values(errors).flat().join("") : "Could not save the member."
        );
    }
};
return(
    <form onSubmit={handleSubmit} style ={{marginBottom: 20}}>
        <h2>{editingMember ?"Edit Member":"Add Member"}</h2>
        <input name ="fullName" placeholder ="Full Name" value={form.fullName} onChange ={handleChange} required/>{""}
        <input name ="email" placeholder="Email" value={form.email} onChange={handleChange} required/>{""}
        <input name ="phone" placeholder="Phone" value={form.phone ??""} onChange={handleChange} required/>{""}
        <button  className="secondary" type="submit">{editingMember ? "Update" : "Add"}</button>
        {editingMember && (
            <button className="secondary" type="button" onClick={onCancel} style={{ marginLeft: 8}}>Cancel</button>
        )}
    {error && <p style={{color:"red"}}>{error}</p>}
    </form>
);
}

export default function MemberList(){
    const[members, setMembers] = useState([]);
    const[loading, setLoading] = useState(true);
    const[error, setError] =useState("");
    const[editingMember, setEditingMember] = useState(null);
    const { user } = useAuth();
    const loadMembers = () => {
        api
           .get("/members")
           .then((res)=>{
            setMembers(res.data);
            setError("");
           })
           .catch(()=> setError("Could not load members.Is the API running?"))
           .finally(()=> setLoading(false));        
    };
    
    useEffect(()=>{
        loadMembers();
    },[]);

    const handleDelete = async(id)=>{
        if(!window.confirm("Delete this member?")) return;
        try{
            await api.delete(`/members/${id}`);
            loadMembers();
        }
        catch(err){
            console.error("Delete Failed:", err);
            setError("Could not delete the member.");

        }
    };
    const handleSaved= () =>{
        setEditingMember(null);
        loadMembers();
    };
    return(
        <div>
            <MemberForm
            editingMember={editingMember}
            onSaved={handleSaved}
            onCancel={() => setEditingMember(null)}/>
            <h2>Members</h2>
            {!loading && <p>Loading members...</p>}
            {error && <p>{error}</p>}
            {!loading && !error && members.length === 0 && <p>No members found.</p>}
            {!loading && !error &&(
                <table border="1" cellPadding="8">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Joined</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map((m)=>(
                            <tr key ={m.id}>
                                <td>{m.fullName}</td>
                                <td>{m.email}</td>
                                <td>{m.phone}</td>
                                <td>{new Date(m.joinedOn).toLocaleDateString()}</td>
                                <td>
                                    <button className="secondary" onClick={()=>setEditingMember(m)}>Edit</button>{""}
                                    {user?.role === "Admin" && (
                                    <button className="danger" onClick={() => handleDelete(m.id)}>Delete</button>)}
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}