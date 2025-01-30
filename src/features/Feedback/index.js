import { useState } from "react";
import TitleCard from "../../components/Cards/TitleCard";
import InputText from "../../components/Input/InputText";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { FaEdit, FaTrash } from "react-icons/fa";

function FeedbackForm() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    video: null,
    publishDate: new Date().toISOString().slice(0, 16), // Default to current date-time
  });

  const [podcasts, setPodcasts] = useState([
    {
      title: "Tech Talks",
      category: "Technology",
      publishDate: "2025-02-01T10:00",
      video: "tech_video.mp4",
    },
    {
      title: "Health Insights",
      category: "Health",
      publishDate: "2025-02-02T15:00",
      video: "health_video.mp4",
    },
  ]);

  const categories = [
    "Technology",
    "Education",
    "Business",
    "Health",
    "Entertainment",
    "News",
  ];

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

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      video: file,
    }));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.content || !formData.category || !formData.publishDate) {
      alert("Please fill out all required fields.");
      return;
    }

    // Add new podcast to the list
    setPodcasts((prevPodcasts) => [
      ...prevPodcasts,
      {
        title: formData.title,
        category: formData.category,
        publishDate: formData.publishDate,
        video: formData.video ? formData.video.name : "No video uploaded",
      },
    ]);

    console.log("Podcast Submitted: ", formData);
    // Reset the form
    setFormData({
      title: "",
      content: "",
      category: "",
      video: null,
      publishDate: new Date().toISOString().slice(0, 16),
    });
  };

  const handleEdit = (index) => {
    const podcastToEdit = podcasts[index];
    setFormData({
      title: podcastToEdit.title,
      content: podcastToEdit.content,
      category: podcastToEdit.category,
      video: podcastToEdit.video,
      publishDate: podcastToEdit.publishDate,
    });
    setPodcasts((prevPodcasts) => prevPodcasts.filter((_, i) => i !== index)); // Remove the edited podcast
  };

  const handleDelete = (index) => {
    setPodcasts((prevPodcasts) => prevPodcasts.filter((_, i) => i !== index));
  };

  return (
    <>
      <TitleCard title="Podcast Form">
        <div className="space-y-4">
          {/* Title Input */}
          <InputText
            labelTitle="Podcast Title"
            placeholder="Enter podcast title"
            name="title"
            value={formData.title}
            updateFormValue={handleInputChange}
          />

          {/* Video Upload */}
          <div>
            <label className="block text-sm font-medium mb-1">Upload Video</label>
            <input
              type="file"
              accept="video/*"
              className="file-input file-input-bordered w-full"
              onChange={handleVideoChange}
            />
          </div>

          {/* Content Editor */}
          <div>
            <label className="block text-sm font-medium mb-1">Podcast Content</label>
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
                    ['clean'],
                  ],
                  clipboard: {
                    matchVisual: false,
                  },
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
                  'link', 'image', 'video',
                ]}
              />
            </div>
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

          {/* Publish Date */}
          <div>
            <label className="block text-sm font-medium mb-1">Publish Date</label>
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

      {/* Podcasts Table */}
      <TitleCard title="Podcasts List">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Publish Date</th>
                <th>Video</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {podcasts.map((podcast, index) => (
                <tr key={index}>
                  <td>{podcast.title}</td>
                  <td>{podcast.category}</td>
                  <td>{new Date(podcast.publishDate).toLocaleString()}</td>
                  <td>{podcast.video}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(index)}
                      className="btn btn-sm btn-warning mr-2"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="btn btn-sm btn-danger"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TitleCard>
    </>
  );
}

export default FeedbackForm;
