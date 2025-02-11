import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchAllBlogs, updateBlog, deleteBlog } from '../../../app/api'
import TitleCard from '../../../components/Cards/TitleCard'

function BlogsList() {
    const navigate = useNavigate()
    const [blogs, setBlogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [editingBlog, setEditingBlog] = useState(null)

    const fetchBlogs = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetchAllBlogs();
            console.log('Component response:', response); // Debug log

            // Handle the response data structure correctly
            const blogsData = response?.message || [];
            setBlogs(blogsData);

            if (blogsData.length === 0) {
                console.log('No blogs found'); // Debug log
            }
        } catch (err) {
            console.error('Error in component:', err);
            setError(err.message || 'Failed to fetch blogs');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    const handleUpdate = async (blogId, updatedData) => {
        try {
            await updateBlog(blogId, updatedData)
            const response = await fetchAllBlogs()
            setBlogs(response?.data?.message || [])
            setEditingBlog(null)
        } catch (err) {
            setError(err.message || 'Failed to update blog')
        }
    }

    const handleDelete = async (blogId) => {
        if (window.confirm('Are you sure you want to delete this blog?')) {
            try {
                setLoading(true);
                console.log('Attempting to delete blog:', blogId); // Debug log

                const result = await deleteBlog(blogId);
                console.log('Delete result:', result); // Debug log

                await fetchBlogs(); // Refresh the list after deletion
                alert('Blog deleted successfully');
            } catch (err) {
                console.error('Delete error details:', {
                    error: err,
                    message: err.message,
                    stack: err.stack
                });
                alert(`Failed to delete blog: ${err.message}`);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleEdit = (blogId) => {
        navigate(`/app/blogs/edit/${blogId}`)
    }

    return (
        <TitleCard title="All Blog Posts" topMargin="mt-2">
            {loading && <div className="w-full flex justify-center items-center py-8"><div className="loader"></div></div>}
            {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">{error}</div>}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {blogs.map((blog) => (
                    <div key={blog._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative h-48">
                            <img
                                src={blog.thumbnailUrl || 'https://via.placeholder.com/400x200'}
                                alt={blog.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-0 right-0 p-2 space-x-2">
                                <button
                                    onClick={() => handleEdit(blog._id)}
                                    className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => handleDelete(blog._id)}
                                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                    {blog.category}
                                </span>
                                <span className="text-gray-500 text-sm">
                                    {new Date(blog.publishedDate).toLocaleDateString()}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">{blog.title}</h3>
                            <p className="text-gray-600 text-sm line-clamp-3 mb-4">{blog.content}</p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <span className="text-sm text-gray-600">By {blog.author}</span>
                                </div>
                                {blog.BlogImages?.length > 0 && (
                                    <div className="flex -space-x-4">
                                        {blog.BlogImages.slice(0, 3).map((img, idx) => (
                                            <img
                                                key={idx}
                                                src={img}
                                                alt={`Additional ${idx + 1}`}
                                                className="w-8 h-8 rounded-full border-2 border-white object-cover"
                                            />
                                        ))}
                                        {blog.BlogImages.length > 3 && (
                                            <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                                                +{blog.BlogImages.length - 3}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </TitleCard>
    )
}

export default BlogsList
