import { useState, useEffect } from "react";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1519741497674-611481863552",
    title: "Kids Fashion 💖",
    sub: "Trendy & Comfortable Collection"
  },
  {
    image: "https://images.unsplash.com/photo-1521336575822-6da63fb45455",
    title: "New Arrivals ✨",
    sub: "Fresh styles for your little ones"
  },
  {
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c",
    title: "Flat 20% OFF 🎉",
    sub: "Limited time offer"
  }
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[60vh] overflow-hidden">
      <img
        src={slides[index].image}
        className="w-full h-full object-cover transition-all duration-700"
        alt="hero"
      />
      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white text-center px-6">
        <h2 className="text-4xl font-bold mb-2">{slides[index].title}</h2>
        <p className="text-lg mb-4">{slides[index].sub}</p>
        <a href="/products" className="bg-pink-500 px-6 py-2 rounded-full hover:scale-105 transition">
          Shop Now 🛍️
        </a>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full ${i === index ? "bg-white" : "bg-white/40"}`}
          />
        ))}
      </div>
    </div>
  );
}
