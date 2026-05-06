import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";
import useAutoLogout from "./hooks/useAutoLogout";

function App() {
  useAutoLogout();
  return (
    <BrowserRouter>
      <Navbar />
      <AppRoutes />
      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/919261151400?text=Hello%20I%20want%20to%20know%20about%20kids%20collection"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 p-4 rounded-full shadow-lg hover:scale-110 transition z-50"
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/733/733585.png"
          className="w-8"
          alt="WhatsApp"
        />
      </a>
    </BrowserRouter>
  );
}

export default App;
