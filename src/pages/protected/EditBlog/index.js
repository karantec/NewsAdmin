import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchBlogById, updateBlog } from '../../../app/api'
import TitleCard from '../../../components/Cards/TitleCard'
import ReactQuill from 'react-quill'
import "react-quill/dist/quill.snow.css"

// Define Quill modules and formats
const quillModules = {
    toolbar: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'image'],
        ['clean']
    ],
    clipboard: {
        matchVisual: false
    }
};

const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet',
    'link', 'image'
];

function EditBlog() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [blog, setBlog] = useState({
        title: '',
        content: '',
        category: '',
        author: '',
        thumbnailUrl: '',
        BlogImages: []
    })

    useEffect(() => {
        const loadBlog = async () => {
            try {
                setLoading(true)
                console.log('Loading blog with ID:', id); // Debug log
                const response = await fetchBlogById(id)
                console.log('Received blog data:', response); // Debug log

                if (response?.data) {
                    setBlog(response.data)
                } else {
                    console.error('Invalid blog data:', response); // Debug log
                    throw new Error('Blog data not found')
                }
            } catch (err) {
                console.error('Error loading blog:', err)
                setError(err.message || 'Failed to load blog')
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            loadBlog()
        }
    }, [id])

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!blog.title || !blog.content) {
            setError('Title and content are required');
            return;
        }

        try {
            setLoading(true);
            setError(null); // Clear any previous errors

            // Debug log
            console.log('Submitting blog update:', {
                id,
                data: blog
            });

            const formattedBlog = {
                ...blog,
                content: blog.content.replace(/<p><br><\/p>/g, '').trim(),
                // Ensure all required fields are present
                title: blog.title.trim(),
                author: blog.author?.trim() || '',
                category: blog.category?.trim() || '',
                thumbnailUrl: blog.thumbnailUrl || '',
                BlogImages: blog.BlogImages || []
            };

            await updateBlog(id, formattedBlog);
            alert('Blog updated successfully');
            navigate('/app/blogs');
        } catch (err) {
            console.error('Blog update error:', err);
            setError(err.message || 'Failed to update blog');
            alert(`Failed to update blog: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <TitleCard title="Edit Blog Post">
                <div className="flex justify-center items-center h-64">
                    <div className="loader">Loading...</div>
                </div>
            </TitleCard>
        )
    }

    if (error) {
        return (
            <TitleCard title="Edit Blog Post">
                <div className="text-center text-red-600 p-4">
                    <p>Error: {error}</p>
                    <button
                        className="btn btn-primary mt-4"
                        onClick={() => navigate('/app/blogs')}
                    >
                        Back to Blogs
                    </button>
                </div>
            </TitleCard>
        )
    }

    return (
        <TitleCard title="Edit Blog Post">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="label">Title</label>
                    <input
                        type="text"
                        className="input input-bordered w-full"
                        value={blog.title || ''}
                        onChange={(e) => setBlog({ ...blog, title: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <label className="label">Content</label>
                    <ReactQuill
                        value={blog.content || ''}
                        onChange={(content) => setBlog({ ...blog, content })}
                        modules={quillModules}
                        formats={quillFormats}
                        theme="snow"
                        className="h-64 mb-12"
                        preserveWhitespace={true}
                    />
                </div>

                <div>
                    <label className="label">Author</label>
                    <input
                        type="text"
                        className="input input-bordered w-full"
                        value={blog.author || ''}
                        onChange={(e) => setBlog({ ...blog, author: e.target.value })}
                    />
                </div>

                <div>
                    <label className="label">Category</label>
                    <input
                        type="text"
                        className="input input-bordered w-full"
                        value={blog.category || ''}
                        onChange={(e) => setBlog({ ...blog, category: e.target.value })}
                    />
                </div>

                <div>
                    <label className="label">Thumbnail</label>
                    <div className="flex gap-4 items-start">
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            value={blog.thumbnailUrl || ''}
                            onChange={(e) => setBlog({ ...blog, thumbnailUrl: e.target.value })}
                        />
                        {blog.thumbnailUrl && (
                            <div className="relative group">
                                <img
                                    src={blog.thumbnailUrl}
                                    alt="Thumbnail"
                                    className="w-24 h-24 object-cover rounded-lg"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:flex items-center justify-center hidden rounded-lg">
                                    <button
                                        type="button"
                                        className="text-white hover:text-red-500"
                                        onClick={() => setBlog({ ...blog, thumbnailUrl: '' })}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <label className="label">Blog Images</label>
                    <div className="space-y-4">
                        {blog.BlogImages && blog.BlogImages.length > 0 && (
                            <div className="grid grid-cols-4 gap-4 mb-4">
                                {blog.BlogImages.map((imageUrl, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={imageUrl}
                                            alt={`Blog image ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:flex items-center justify-center hidden rounded-lg">
                                            <button
                                                type="button"
                                                className="text-white hover:text-red-500"
                                                onClick={() => {
                                                    const newImages = [...blog.BlogImages]
                                                    newImages.splice(index, 1)
                                                    setBlog({ ...blog, BlogImages: newImages })
                                                }}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            placeholder="Add new image URL"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault()
                                    if (e.target.value) {
                                        setBlog({
                                            ...blog,
                                            BlogImages: [...(blog.BlogImages || []), e.target.value]
                                        })
                                        e.target.value = ''
                                    }
                                }
                            }}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => navigate('/app/blogs')}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Update Blog'}
                    </button>
                </div>
            </form>
        </TitleCard>
    )
}

export default EditBlog
