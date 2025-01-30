import { useState } from "react";
import TitleCard from "../../components/Cards/TitleCard";
import InputText from "../../components/Input/InputText";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill's CSS
import NewsTable from "./components/NewsTable";

function RequestDemo() {
  const [formData, setFormData] = useState({
    title: "",
    image: null,
    content: "",
    postedTime: new Date().toISOString().slice(0, 16), // Default current date-time
    category: "",
  });

  const categories = [
    "राष्ट्रीय",
    "राज्य",
    "राजनीति",
    "शिक्षा/रोजगार",
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      image: file,
    }));
  };

  const handleQuillChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      content: value,
    }));
  };

  const handleSubmit = () => {
    // Basic validation
    if (
      !formData.title ||
      !formData.image ||
      !formData.content ||
      !formData.postedTime ||
      !formData.category
    ) {
      alert("Please fill out all required fields.");
      return;
    }

    console.log("News Submitted: ", formData);
    // Perform submission actions here, e.g., dispatching to the store or API call
  };

  const dummyNews = [
    { id: 1, title: "Breaking News 1", category: "राजनीति", postedTime: "2025-01-01T12:00" },
    { id: 2, title: "Breaking News 2", category: "स्वास्थ्य", postedTime: "2025-01-02T12:00" },
    { id: 3, title: "Breaking News 3", category: "खेल", postedTime: "2025-01-03T12:00" },
  ];

  const [newsEntries, setNewsEntries] = useState(dummyNews);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this news entry?')) {
      setNewsEntries(newsEntries.filter(entry => entry.id !== id));
    }
  };

  const handleEdit = (news) => {
    setFormData({
      ...news,
      image: null, // Reset image since we can't restore File object
    });
  };

  return (
    <>
      <TitleCard title="Post News">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title Input */}
          <div>
            <InputText
              labelTitle="News Title"
              placeholder="Enter news title"
              name="title"
              value={formData.title}
              updateFormValue={handleInputChange}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-1">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              className="file-input file-input-bordered w-full"
              onChange={handleImageChange}
            />
          </div>

          {/* Content Textarea - Quill Editor */}
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Content</label>
            <div className="h-[400px] relative">
              <ReactQuill
                value={formData.content}
                onChange={handleQuillChange}
                theme="snow"
                className="h-full"
                modules={{
                  toolbar: [
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                    ["bold", "italic", "underline", "strike"], // text styling
                    [{ color: [] }, { background: [] }], // dropdown with defaults
                    [{ list: "ordered" }, { list: "bullet" }], // lists
                    [{ align: [] }], // text align
                    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
                    ["blockquote", "code-block"], // blocks
                    [{ script: "sub" }, { script: "super" }], // superscript/subscript
                    [{ direction: "rtl" }], // text direction
                    ["link", "image", "video"], // links, media
                    ["clean"], // remove formatting
                  ],
                  clipboard: {
                    matchVisual: false,
                  },
                }}
                formats={[
                  "header",
                  "bold",
                  "italic",
                  "underline",
                  "strike",
                  "color",
                  "background",
                  "list",
                  "bullet",
                  "align",
                  "indent",
                  "blockquote",
                  "code-block",
                  "script",
                  "direction",
                  "link",
                  "image",
                  "video",
                ]}
              />
            </div>
          </div>

          {/* Posted Time */}
          <div>
            <label className="block text-sm font-medium mb-1">Posted Time</label>
            <input
              type="datetime-local"
              className="input input-bordered w-full"
              name="postedTime"
              value={formData.postedTime}
              onChange={handleInputChange}
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              className="select select-bordered w-full"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
            >
              <option value="">Select Category</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end col-span-2">
            <button
              className="btn btn-sm btn-primary mt-4"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </TitleCard>

      {/* News Table */}
      <NewsTable 
        newsEntries={newsEntries}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </>
  );
}

export default RequestDemo;
