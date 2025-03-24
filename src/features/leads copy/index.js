import React, { useEffect, useState } from 'react';

const ViewNews = () => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingNews, setEditingNews] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedContent, setUpdatedContent] = useState('');

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch('https://bbc-newsbackend-2yyf.onrender.com/api/news/News');
      if (!response.ok) {
        throw new Error('Failed to fetch news data');
      }
      const data = await response.json();
      setNewsData(data.data); // Fix: Extracting "data" from the API response
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://bbc-newsbackend-2yyf.onrender.com/api/news/deleteNews/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete news');
      }

      setNewsData(newsData.filter((news) => news._id !== id));
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleEdit = (news) => {
    setEditingNews(news);
    setUpdatedTitle(news.title);
    setUpdatedContent(news.content);
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`https://bbc-newsbackend-2yyf.onrender.com/api/news/updateNews/${editingNews._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: updatedTitle, content: updatedContent }),
      });

      if (!response.ok) {
        throw new Error('Failed to update news');
      }

      setNewsData(newsData.map((news) => (news._id === editingNews._id ? { ...news, title: updatedTitle, content: updatedContent } : news)));
      setEditingNews(null);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">View News</h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading news...</p>
        ) : error ? (
          <p className="text-center text-red-500">Error: {error}</p>
        ) : newsData.length === 0 ? (
          <p className="text-center text-gray-500">No news available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsData.map((news) => (
              <div key={news._id} className="bg-white p-6 rounded-xl shadow-md">
                <h4 className="font-semibold text-lg">{news.title}</h4>
                <p className="text-gray-700 mt-2">{news.content}</p>
                <p className="text-sm text-gray-500 mt-2">Category: {news.category}</p>
                <p className="text-sm text-gray-500">Published: {new Date(news.publishedDate).toLocaleString()}</p>
                {news.thumbnailUrl && (
                  <img src={news.thumbnailUrl} alt={news.title} className="mt-3 rounded-lg w-full h-40 object-cover" />
                )}
                <div className="mt-4 flex justify-between">
                  <button onClick={() => handleEdit(news)} className="px-4 py-2 bg-blue-500 text-white rounded-md">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(news._id)} className="px-4 py-2 bg-red-500 text-white rounded-md">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingNews && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Edit News</h3>
            <input
              type="text"
              value={updatedTitle}
              onChange={(e) => setUpdatedTitle(e.target.value)}
              className="w-full p-2 border rounded-md mb-2"
              placeholder="Title"
            />
            <textarea
              value={updatedContent}
              onChange={(e) => setUpdatedContent(e.target.value)}
              className="w-full p-2 border rounded-md mb-2"
              placeholder="Content"
            />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setEditingNews(null)} className="px-4 py-2 bg-gray-500 text-white rounded-md">
                Cancel
              </button>
              <button onClick={handleUpdate} className="px-4 py-2 bg-green-500 text-white rounded-md">
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewNews;
