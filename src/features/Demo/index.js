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
    video: null,
    content: "",
    postedTime: new Date().toISOString().slice(0, 16), // Default current date-time
    category: "",
    state: "", // For state-specific news
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

  const states = [
    "उत्तर प्रदेश",
    "मध्य प्रदेश",
    "बिहार",
    "राजस्थान",
    "महाराष्ट्र",
    "पंजाब",
    "हरियाणा",
    "गुजरात",
    "दिल्ली",
    "झारखंड",
    "छत्तीसगढ़",
    "उत्तराखंड",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      [name]: file,
    }));
  };

  const handleQuillChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      content: value,
    }));
  };

  const handleSubmit = () => {
    if (
      !formData.title ||
      !formData.image ||
      !formData.content ||
      !formData.postedTime ||
      !formData.category
    ) {
      alert("कृपया सभी आवश्यक फ़ील्ड भरें।");
      return;
    }

    console.log("News Submitted: ", formData);
    // Perform submission actions here, e.g., dispatching to the store or API call
  };

  const dummyNews = [
    { id: 1, title: "Breaking News 1", category: "राजनीति", state: "उत्तर प्रदेश", postedTime: "2025-01-01T12:00" },
    { id: 2, title: "Breaking News 2", category: "स्वास्थ्य", state: "बिहार", postedTime: "2025-01-02T12:00" },
    { id: 3, title: "Breaking News 3", category: "खेल", state: "महाराष्ट्र", postedTime: "2025-01-03T12:00" },
  ];

  const [newsEntries, setNewsEntries] = useState(dummyNews);

  const handleDelete = (id) => {
    if (window.confirm('क्या आप वाकई इस समाचार को हटाना चाहते हैं?')) {
      setNewsEntries(newsEntries.filter(entry => entry.id !== id));
    }
  };

  const handleEdit = (news) => {
    setFormData({
      ...news,
      image: null, // Reset image since we can't restore File object
      video: null, // Reset video
    });
  };

  return (
    <>
      <TitleCard title="पोस्ट न्यूज़ (Post News)">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title Input */}
          <div>
            <InputText
              labelTitle="न्यूज़ का शीर्षक"
              placeholder="यहाँ समाचार का शीर्षक डालें"
              name="title"
              value={formData.title}
              updateFormValue={handleInputChange}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-1">छवि अपलोड करें</label>
            <input
              type="file"
              accept="image/*"
              name="image"
              className="file-input file-input-bordered w-full"
              onChange={handleFileChange}
            />
          </div>

          {/* Video Upload */}
          <div>
            <label className="block text-sm font-medium mb-1">वीडियो अपलोड करें</label>
            <input
              type="file"
              accept="video/*"
              name="video"
              className="file-input file-input-bordered w-full"
              onChange={handleFileChange}
            />
          </div>

          {/* Content Textarea - Quill Editor */}
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">समाचार की सामग्री</label>
            <div className="h-[400px] relative">
              <ReactQuill
                value={formData.content}
                onChange={handleQuillChange}
                theme="snow"
                className="h-full"
              />
            </div>
          </div>

          {/* Posted Time */}
          <div>
            <label className="block text-sm font-medium mb-1">प्रकाशन समय</label>
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

          {/* State Dropdown (Visible only if category is "राज्य") */}
          {formData.category === "राज्य" && (
            <div>
              <label className="block text-sm font-medium mb-1">राज्य</label>
              <select
                className="select select-bordered w-full"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
              >
                <option value="">राज्य चुनें</option>
                {states.map((state, index) => (
                  <option key={index} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end col-span-2">
            <button
              className="btn btn-sm btn-primary mt-4"
              onClick={handleSubmit}
            >
              सबमिट करें
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
