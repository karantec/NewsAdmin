import { useState } from "react";
import TitleCard from "../../components/Cards/TitleCard";
import InputText from "../../components/Input/InputText";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import BlogTable from "./components/BlogTable"; // Importing the BlogTable component

function BookDemo() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    image: null,
    publishDate: new Date().toISOString().slice(0, 16), // Default to current date-time
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
    "अंतर्राष्ट्रीय"
  ];

  // Dummy Blog Entries
  const [blogEntries, setBlogEntries] = useState([
    {
      id: 1,
      title: "पहला ब्लॉग पोस्ट",
      content: "यह एक डमी कंटेंट है।",
      category: "राष्ट्रीय",
      publishDate: "2025-01-01T12:00",
    },
    {
      id: 2,
      title: "दूसरा ब्लॉग पोस्ट",
      content: "यह भी डमी कंटेंट है।",
      category: "राजनीति",
      publishDate: "2025-01-02T14:00",
    },
    {
      id: 3,
      title: "तीसरा ब्लॉग पोस्ट",
      content: "यह तीसरा डमी ब्लॉग है।",
      category: "स्वास्थ्य",
      publishDate: "2025-01-03T16:00",
    },
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleQuillChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      content: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      image: file,
    }));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.content || !formData.category || !formData.publishDate) {
      alert("कृपया सभी आवश्यक फ़ील्ड भरें।");
      return;
    }

    const newEntry = {
      id: new Date().getTime(),
      title: formData.title,
      content: formData.content,
      category: formData.category,
      publishDate: formData.publishDate,
    };

    setBlogEntries((prevEntries) => [...prevEntries, newEntry]);

    setFormData({
      title: "",
      content: "",
      category: "",
      image: null,
      publishDate: new Date().toISOString().slice(0, 16),
    });
    console.log("ब्लॉग पोस्ट सबमिट किया गया: ", newEntry);
  };

  const handleDelete = (id) => {
    if (window.confirm("क्या आप वाकई इस ब्लॉग को हटाना चाहते हैं?")) {
      setBlogEntries(blogEntries.filter((entry) => entry.id !== id));
    }
  };

  const handleEdit = (blog) => {
    setFormData({
      ...blog,
      image: null, // Reset image since we can't restore File object
    });
  };

  return (
    <>
      <TitleCard title="ब्लॉग पोस्ट करें">
        <div className="space-y-4">
          {/* Title Input */}
          <InputText
            labelTitle="ब्लॉग का शीर्षक"
            placeholder="ब्लॉग का शीर्षक दर्ज करें"
            name="title"
            value={formData.title}
            updateFormValue={handleInputChange}
          />

          {/* Featured Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-1">छवि अपलोड करें</label>
            <input
              type="file"
              accept="image/*"
              className="file-input file-input-bordered w-full"
              onChange={handleImageChange}
            />
          </div>

          {/* Content Editor */}
          <div>
            <label className="block text-sm font-medium mb-1">ब्लॉग सामग्री</label>
            <div className="h-[400px] relative">
              <ReactQuill
                value={formData.content}
                onChange={handleQuillChange}
                theme="snow"
                className="h-full"
                modules={{
                  toolbar: [
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ color: [] }, { background: [] }],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    [{ align: [] }],
                    [{ indent: '-1' }, { indent: '+1' }],
                    ['blockquote', 'code-block'],
                    [{ script: 'sub' }, { script: 'super' }],
                    [{ direction: 'rtl' }],
                    ['link', 'image', 'video'],
                    ['clean']
                  ],
                  clipboard: {
                    matchVisual: false
                  }
                }}
                formats={[
                  'header',
                  'bold', 'italic', 'underline', 'strike',
                  'color', 'background',
                  'list', 'bullet',
                  'align', 'indent',
                  'blockquote', 'code-block',
                  'script',
                  'direction',
                  'link', 'image', 'video'
                ]}
              />
            </div>
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

          {/* Publish Date */}
          <div>
            <label className="block text-sm font-medium mb-1">प्रकाशन समय</label>
            <input
              type="datetime-local"
              className="input input-bordered w-full"
              name="publishDate"
              value={formData.publishDate}
              onChange={handleInputChange}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              className="btn btn-sm btn-primary mt-4"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </TitleCard>

      {/* Blog Table */}
      <BlogTable
        blogEntries={blogEntries}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </>
  );
}

export default BookDemo;
