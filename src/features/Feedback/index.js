import { useState, useEffect, useRef } from "react";
import TitleCard from "../../components/Cards/TitleCard";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";

function FeedbackForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    author: "",
    thumbnail: "",
    videoUrl: "",
  });


  const quillTimeoutRef = useRef(null); // Fix debounce issue

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
    if (quillTimeoutRef.current) {
      clearTimeout(quillTimeoutRef.current);
    }
    quillTimeoutRef.current = setTimeout(() => {
      setFormData((prevData) => ({
        ...prevData,
        description: value,
      }));
    }, 500);
  };

  const openCloudinaryWidget = (type) => {
    if (window.cloudinary) {
      window.cloudinary
        .createUploadWidget(
          {
            cloudName: "frbjijb",
            uploadPreset: "ncny6y3n",
            sources: ["local"],
            multiple: false,
          },
          (error, result) => {
            if (!error && result && result.event === "success") {
              setFormData((prevData) => ({
                ...prevData,
                [type]: result.info.secure_url,
              }));
            }
          }
        )
        .open();
    }
  };

  const handleSubmit = async() => {
    if (
      !formData.title||
      !formData.description ||
      !formData.author
    ) {
      console.log(formData)
      alert("Please fill out all required fields.");
      return;
    }
    console.log(formData);

    try {
      await axios.post('http://localhost:3001/api/podcast/createpodcast',formData)
      alert('Success')
    } catch (error) {
      alert("Error")
    }
   

    setFormData({
      title: "",
      description: "",
      author: "",
      thumbnail: "",
      videoUrl: "",
    });
  };

  return (
    <TitleCard title="Podcast Form">
      <div className="space-y-4">
        <input
          className="input  input-bordered w-full"
          labelTitle="Podcast Title"
          placeholder="Enter title"
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <input
          className="input  input-bordered w-full"
          labelTitle="Podcast Author"
          placeholder="Enter Author name"
          name="author"
          onChange={(e) =>
            setFormData({ ...formData, author: e.target.value })
          }
        />
        <div>
          <label className="block text-sm font-medium mb-1">Thumbnail</label>
          <button
            className="btn btn-secondary"
            onClick={() => openCloudinaryWidget("thumbnail")}
          >
            Upload Thumbnail
          </button>
          {formData.thumbnail && (
            <img
              src={formData.thumbnail}
              alt="Thumbnail"
              className="mt-2 w-32 h-32 object-cover"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Upload Video</label>
          <button
            className="btn btn-secondary"
            onClick={() => openCloudinaryWidget("videoUrl")}
          >
            Upload Video
          </button>
          {formData.videoUrl && (
            <p className="mt-2 text-sm text-gray-500">Video Uploaded</p>
          )}
        </div>
        <div>
          <ReactQuill
            value={formData.description}
            onChange={handleQuillChange}
            theme="snow"
            className="h-40"
          />
        </div>
        <div className="flex justify-end pt-10 ">
          <button className="btn btn-primary mt-4" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </TitleCard>
  );
}

export default FeedbackForm;
