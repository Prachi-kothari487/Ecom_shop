import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.phone || form.phone.length !== 10) {
      alert("Enter valid 10-digit phone number ❌");
      return;
    }

    console.log("Registering:", JSON.stringify(form, null, 2));
    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      localStorage.setItem("couponUsed", ""); // reset so new user gets discount
      alert("Registered Successfully! 🎉 You get 10% OFF on first order!");
    } catch (err) {
      console.log("ERROR:", err.response?.data);
      alert(err.response?.data?.msg || "Registration failed ❌");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow w-80">
        <h2 className="text-2xl mb-4 text-center">Register 💖</h2>

        <input
          placeholder="Name"
          className="w-full p-2 mb-2 border rounded"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Email"
          className="w-full p-2 mb-2 border rounded"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-2 border rounded"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <input
          placeholder="Phone Number (10 digit)"
          className="w-full p-2 mb-4 border rounded"
          maxLength={10}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <button className="bg-primary text-white w-full py-2 rounded-full">
          Register
        </button>
      </form>
    </div>
  );
}
