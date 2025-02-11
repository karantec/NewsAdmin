import { useEffect, useState } from 'react'
import { fetchAllBlogs, updateBlog, deleteBlog } from '../../../app/api'
import TitleCard from '../../../components/Cards/TitleCard'

function BlogsList() {
    const [blogs, setBlogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [editingBlog, setEditingBlog] = useState(null)

    useEffect(() => {
        const getBlogs = async () => {
            try {
                const response = await fetchAllBlogs()
                setBlogs(response.data || [])
            } catch (err) {
                setError(err.message || 'Failed to fetch blogs')
            } finally {
                setLoading(false)
            }
        }
        getBlogs()
    }, [])

    const handleUpdate = async (blogId, updatedData) => {
        try {
            await updateBlog(blogId, updatedData)
            // Refresh the blogs list after update
            const response = await fetchAllBlogs()
            setBlogs(response.data || [])
            setEditingBlog(null)
        } catch (err) {
            setError(err.message || 'Failed to update blog')
        }
    }

    const handleDelete = async (blogId) => {
        if (window.confirm('Are you sure you want to delete this blog?')) {
            try {
                await deleteBlog(blogId)
                // Refresh the blogs list after deletion
                const response = await fetchAllBlogs()
                setBlogs(response.data || [])
            } catch (err) {
                setError(err.message || 'Failed to delete blog')
            }
        }
    }

    return (
        <TitleCard title="All Blog Posts">
            {loading && <div className="text-center">Loading blogs...</div>}
            {error && <div className="text-center text-red-500">{error}</div>}
            <div className="grid gap-4">
                {blogs.map((blog) => (
                    <div key={blog._id} className="border p-4 rounded-lg">
                        {editingBlog === blog._id ? (
                            <div className="space-y-4">
                                <input
                                    className="w-full p-2 border rounded"
                                    defaultValue={blog.title}
                                    onChange={(e) => blog.title = e.target.value}
                                />
                                <textarea
                                    className="w-full p-2 border rounded"
                                    defaultValue={blog.description}
                                    onChange={(e) => blog.description = e.target.value}
                                />
                                <div className="flex gap-2">
                                    <button
                                        className="px-4 py-2 bg-blue-500 text-white rounded"
                                        onClick={() => handleUpdate(blog._id, blog)}
                                    >
                                        Save
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-gray-500 text-white rounded"
                                        onClick={() => setEditingBlog(null)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-xl font-semibold">{blog.title}</h3>
                                <p className="text-gray-600 mt-2">{blog.description}</p>
                                <div className="mt-2 text-sm text-gray-500">
                                    <span>Published: {new Date(blog.createdAt).toLocaleDateString()}</span>
                                    <button
                                        className="ml-4 text-blue-500"
                                        onClick={() => setEditingBlog(blog._id)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="ml-4 text-red-500"
                                        onClick={() => handleDelete(blog._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </TitleCard>
    )
}

export default BlogsList
