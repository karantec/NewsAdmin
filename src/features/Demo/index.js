import { useState } from "react";
import TitleCard from "../../components/Cards/TitleCard";
import InputText from "../../components/Input/InputText";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function RequestDemo() {
  const [formData, setFormData] = useState({
    title: "",
    image: null,
    video: null,
    content: "",
    postedTime: new Date().toISOString().slice(0, 16),
    category: "",
    state: "",
  });

  const categories = [
    "राष्ट्रीय", "राज्य", "राजनीति", "शिक्षा/रोजगार", "पर्यटन", "खेल", "मौसम", "जायका", "स्वास्थ्य", "व्यापार", "अंतर्राष्ट्रीय"
  ];

  const states = [
    "उत्तर प्रदेश", "मध्य प्रदेश", "बिहार", "राजस्थान", "महाराष्ट्र", "पंजाब", "हरियाणा", "गुजरात", "दिल्ली", "झारखंड", "छत्तीसगढ़", "उत्तराखंड"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    setFormData((prevData) => ({ ...prevData, [name]: file }));
  };

  const handleQuillChange = (value) => {
    setFormData((prevData) => ({ ...prevData, content: value }));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.image || !formData.content || !formData.postedTime || !formData.category) {
      alert("कृपया सभी आवश्यक फ़ील्ड भरें।");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("content", formData.content);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("publishedDate", formData.postedTime);
    formDataToSend.append("isFeatured", true);
    formDataToSend.append("image", formData.image);
    if (formData.video) formDataToSend.append("video", formData.video);

    try {
      const response = await fetch("https://bbc-newsbackend-2yyf.onrender.com/api/news/createNews", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        alert("न्यूज़ सफलतापूर्वक पोस्ट की गई!");

        setFormData({
          title: "",
          image: null,
          video: null,
          content: "",
          postedTime: new Date().toISOString().slice(0, 16),
          category: "",
          state: "",
        });
      } else {
        console.error("Failed to post news");
      }
    } catch (error) {
      console.error("Error posting news:", error);
    }
  };

  return (
    <>
      <TitleCard title="पोस्ट न्यूज़ (Post News)">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputText labelTitle="न्यूज़ का शीर्षक" placeholder="यहाँ समाचार का शीर्षक डालें" name="title" value={formData.title} updateFormValue={handleInputChange} />
          <input type="file" accept="image/*" name="image" className="file-input file-input-bordered w-full" onChange={handleFileChange} />
          <input type="file" accept="video/*" name="video" className="file-input file-input-bordered w-full" onChange={handleFileChange} />
          <div className="col-span-1 sm:col-span-2">
            <ReactQuill value={formData.content} onChange={handleQuillChange} theme="snow" className="h-48" />
          </div>
          <input type="datetime-local" className="input input-bordered w-full" name="postedTime" value={formData.postedTime} onChange={handleInputChange} />
          <select className="select select-bordered w-full" name="category" value={formData.category} onChange={handleInputChange}>
            <option value="">श्रेणी चुनें</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
          {formData.category === "राज्य" && (
            <select className="select select-bordered w-full" name="state" value={formData.state} onChange={handleInputChange}>
              <option value="">राज्य चुनें</option>
              {states.map((state, index) => (
                <option key={index} value={state}>{state}</option>
              ))}
            </select>
          )}
          <div className="flex justify-end sm:col-span-2">
            <button className="btn btn-primary mt-4" onClick={handleSubmit}>सबमिट करें</button>
          </div>
        </div>
      </TitleCard>
    </>
  );
}

export default RequestDemo;
