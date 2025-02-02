import { useState,useEffect } from "react";
import TitleCard from "../../components/Cards/TitleCard";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";

function BlogForm() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    thumbnailUrl: "",
    BlogImages: [],
    author: "",
  });

  const categories = [
    "राष्ट्रीय",
    "राज्य",
    "राजनीति",
    "शिक्षा",
    "रोजगार",
    "पर्यटन",
    "खेल",
    "मौसम",
    "जायका",
    "स्वास्थ्य",
    "व्यापार",
    "अंतर्राष्ट्रीय",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

    useEffect(() => {
      if (!window.cloudinary) {
        const script = document.createElement("script");
        script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
        script.async = true;
        script.onload = () => console.log("Cloudinary script loaded");
        document.body.appendChild(script);
      }
    }, []);

  const handleQuillChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      content: value,
    }));
  };

  // ✅ Open Cloudinary Upload Widget for Thumbnail (Single Image)
  const handleThumbnailUpload = () => {
    window.cloudinary.openUploadWidget(
      {
        cloud_name: "frbjijb", // 🔹 Replace with your Cloudinary Cloud Name
        upload_preset: "ncny6y3n", // 🔹 Replace with your Upload Preset
        sources: ["local"],
        multiple: false, // Allow only single image upload
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          setFormData((prevData) => ({
            ...prevData,
            thumbnailUrl: result.info.secure_url, // Store uploaded image URL
          }));
          console.log("Thumbnail uploaded:", result.info.secure_url);
        }
      }
    );
  };

  // ✅ Open Cloudinary Upload Widget for Multiple Images
  const handleBlogImagesUpload = () => {
    window.cloudinary.openUploadWidget(
      {
        cloud_name: "frbjijb", // 🔹 Replace with your Cloudinary Cloud Name
        upload_preset: "ncny6y3n", // 🔹 Replace with your Upload Preset
        sources: ["local"],
        multiple: true, // Allow multiple image uploads
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          setFormData((prevData) => ({
            ...prevData,
            BlogImages: [...prevData.BlogImages, result.info.secure_url], // Append new image URL to BlogImages array
          }));
          console.log("Blog image uploaded:", result.info.secure_url);
        }
      }
    );
  };

  const handleSubmit = async() => {
    if (
      !formData.title ||
      !formData.content ||
      !formData.category
    ) {
      alert("कृपया सभी आवश्यक फ़ील्ड भरें।");
      return;
    }

    try {
      await axios.post("http://localhost:3001/api/blog/createblogs",formData)
      alert('Posted')
    } catch (error) {
      alert('Server Error')
    }
    console.log("Blog Data Submitted:", formData);

    // Reset form after submission
    setFormData({
      title: "",
      content: "",
      category: "",
      thumbnailUrl: "",
      BlogImages: [],
      publishDate: new Date().toISOString().slice(0, 16),
    });
  };

  return (
    <>
      <TitleCard title="ब्लॉग पोस्ट करें">
        <div className="space-y-4">
          {/* Title Input */}
          <input
            className="input input-bordered w-full"
            placeholder="ब्लॉग का शीर्षक दर्ज करें"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
          />

          <input
            className="input input-bordered w-full"
            placeholder="Author name"
            name="author"
            value={formData.author}
            onChange={handleInputChange}
          />

          {/* Thumbnail Upload Button */}
          <div>
            <label className="block text-sm font-medium mb-1">
              थंबनेल अपलोड करें
            </label>
            <button
              className="btn btn-sm btn-primary"
              onClick={handleThumbnailUpload}
            >
              थंबनेल अपलोड करें
            </button>
            {formData.thumbnailUrl && (
              <img
                src={formData.thumbnailUrl}
                alt="Thumbnail"
                className="mt-2 rounded-md w-48 h-32 object-cover"
              />
            )}
          </div>

          {/* Blog Images Upload Button */}
          <div>
            <label className="block text-sm font-medium mb-1">
              ब्लॉग छवियाँ अपलोड करें
            </label>
            <button
              className="btn btn-sm btn-secondary"
              onClick={handleBlogImagesUpload}
            >
              छवियाँ अपलोड करें
            </button>
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.BlogImages.map((imageUrl, index) => (
                <img
                  key={index}
                  src={imageUrl}
                  alt={`Blog Image ${index + 1}`}
                  className="rounded-md w-24 h-24 object-cover"
                />
              ))}
            </div>
          </div>

          {/* Content Editor */}
          <div>
            <label className="block text-sm font-medium mb-1">
              ब्लॉग सामग्री
            </label>
            <ReactQuill
              value={formData.content}
              onChange={handleQuillChange}
              theme="snow"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-1">श्रेणी</label>
            <select
              className="select select-bordered w-full"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
            >
              <option value="">श्रेणी चुनें</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              className="btn btn-sm btn-primary mt-4"
              onClick={handleSubmit}
            >
              सबमिट करें
            </button>
          </div>
        </div>
      </TitleCard>
    </>
  );
}

export default BlogForm;
