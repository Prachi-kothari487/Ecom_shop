import { useState, useEffect } from "react";
import axios from "axios";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropImage";

export default function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    ageMin: "",
    ageMax: "",
    description: "",
    gender: "",
    stock: ""
  });
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [preview, setPreview] = useState("");

  // Crop state
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/categories").then((res) => setCategories(res.data));
  }, []);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const onCropComplete = (_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const croppedBlob = await getCroppedImg(preview, croppedAreaPixels);
    const data = new FormData();
    data.append("image", croppedBlob, "product.jpg");
    Object.keys(form).forEach((key) => data.append(key, form[key]));
    await axios.post("http://localhost:5000/api/products", data);
    alert("Product Added 🎉");
  };

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    const res = await axios.post("http://localhost:5000/api/categories", { name: newCategory });
    setCategories([...categories, res.data]);
    setNewCategory("");
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow mt-6">
      <h2 className="text-2xl font-bold mb-4">Add Product 👗</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input className="border p-2 rounded" placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })} />

        <input className="border p-2 rounded" placeholder="Price"
          onChange={(e) => setForm({ ...form, price: e.target.value })} />

        {/* CATEGORY */}
        <select className="border p-2 rounded"
          onChange={(e) => setForm({ ...form, category: e.target.value })}>
          <option value="">Select Category</option>
          {categories.map((c, i) => (
            <option key={i} value={c.name}>{c.name}</option>
          ))}
        </select>

        {/* ADD NEW CATEGORY */}
        <div className="flex gap-2">
          <input className="border p-2 rounded w-full" placeholder="New Category"
            value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
          <button type="button" onClick={addCategory}
            className="bg-blue-500 text-white px-4 rounded">Add</button>
        </div>

        {/* GENDER */}
        <select className="border p-2 rounded"
          onChange={(e) => setForm({ ...form, gender: e.target.value })}>
          <option value="">Select Type</option>
          <option value="boys">Boys Wear 👦</option>
          <option value="girls">Girls Wear 👧</option>
        </select>

        {/* AGE RANGE */}
        <div className="flex gap-2">
          <input className="border p-2 rounded w-1/2" placeholder="Min Age"
            onChange={(e) => setForm({ ...form, ageMin: e.target.value })} />
          <input className="border p-2 rounded w-1/2" placeholder="Max Age"
            onChange={(e) => setForm({ ...form, ageMax: e.target.value })} />
        </div>

        <input className="border p-2 rounded" placeholder="Stock (Quantity)" type="number"
          onChange={(e) => setForm({ ...form, stock: e.target.value })} />

        <textarea className="border p-2 rounded" placeholder="Description"
          onChange={(e) => setForm({ ...form, description: e.target.value })} />

        {/* IMAGE UPLOAD */}
        <input type="file" accept="image/*" onChange={handleImage} />

        {/* CROPPER */}
        {preview && (
          <div>
            <div className="relative w-full h-64 bg-black rounded overflow-hidden">
              <Cropper
                image={preview}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
                onCropComplete={onCropComplete}
              />
            </div>

            {/* ZOOM */}
            <label className="text-sm mt-2 block">Zoom</label>
            <input type="range" min="1" max="3" step="0.1" value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full" />

            {/* ROTATE */}
            <label className="text-sm block">Rotate</label>
            <input type="range" min="0" max="360" value={rotation}
              onChange={(e) => setRotation(Number(e.target.value))}
              className="w-full" />
          </div>
        )}

        <button className="bg-primary text-white py-2 rounded-full">Add Product</button>
      </form>
    </div>
  );
}
