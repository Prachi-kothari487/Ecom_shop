import { useState } from "react";
import axios from "axios";

export default function AddStaff() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/auth/create-staff", form);
    alert("Staff Added ✅");
    setForm({ name: "", email: "", password: "" });
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow mt-10">
      <h2 className="text-2xl font-bold mb-4">Add Staff 👨‍💼</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input className="border p-2 rounded" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="border p-2 rounded" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" className="border p-2 rounded" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="bg-primary text-white py-2 rounded-full">Add Staff</button>
      </form>
    </div>
  );
}
