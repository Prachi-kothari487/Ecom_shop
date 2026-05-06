export default function VideoHero() {
  return (
    <div className="relative h-[90vh] overflow-hidden">
      <video autoPlay loop muted className="w-full h-full object-cover">
        <source src="/kids-fashion.mp4" type="video/mp4" />
        {/* Fallback image if no video */}
        <img
          src="https://images.unsplash.com/photo-1521336575822-6da63fb45455"
          className="w-full h-full object-cover"
          alt="hero"
        />
      </video>

      <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-start px-16 text-white">
        <h1 className="text-5xl font-bold leading-tight">
          Cute. Comfy. Stylish 👶✨
        </h1>
        <p className="mt-4 text-lg">New Kids Collection is Live</p>
        <a href="/products" className="mt-6 bg-pink-500 px-6 py-3 rounded-full hover:scale-105 transition">
          Shop Now
        </a>
      </div>
    </div>
  );
}
