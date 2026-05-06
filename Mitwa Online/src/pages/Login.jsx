import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      login(res.data);

      // redirect back if came from cart
      const params = new URLSearchParams(location.search);
      const redirect = params.get("redirect");
      if (redirect) navigate(`/${redirect}`);
      else if (res.data.role === "admin") navigate("/admin");
      else if (res.data.role === "staff") navigate("/staff");
      else navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data?.msg || "Login failed ❌");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow w-80">
        <h2 className="text-2xl mb-4 text-center">Login 🔐</h2>

        <input
          placeholder="Email"
          className="w-full p-2 mb-2 border"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-4 mb-2 border"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="bg-secondary text-white w-full py-2 rounded">
          Login
        </button>

        <p className="text-center mt-3">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500 font-bold">
            Register here
          </a>
        </p>
      </form>
    </div>
  );
}
