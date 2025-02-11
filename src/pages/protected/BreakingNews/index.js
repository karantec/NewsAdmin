import { useEffect, useState } from 'react'
import { createBreakingNews, getBreakingNews, updateBreakingNews, deleteBreakingNews } from '../../../app/api'
import TitleCard from '../../../components/Cards/TitleCard'

function BreakingNews() {
    const [news, setNews] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [editingNews, setEditingNews] = useState(null)
    const [newNewsText, setNewNewsText] = useState("")

    const fetchNews = async () => {
        try {
            const response = await getBreakingNews()
            setNews(response.data || [])
        } catch (err) {
            setError(err.message || 'Failed to fetch breaking news')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchNews()
    }, [])

    const handleCreate = async () => {
        if (!newNewsText.trim()) return
        try {
            await createBreakingNews({ text: newNewsText })
            setNewNewsText("")
            fetchNews()
        } catch (err) {
            setError(err.message || 'Failed to create breaking news')
        }
    }

    const handleUpdate = async (newsId, updatedData) => {
        try {
            await updateBreakingNews(newsId, updatedData)
            fetchNews()
            setEditingNews(null)
        } catch (err) {
            setError(err.message || 'Failed to update breaking news')
        }
    }

    const handleDelete = async (newsId) => {
        if (window.confirm('Are you sure you want to delete this breaking news?')) {
            try {
                await deleteBreakingNews(newsId)
                fetchNews()
            } catch (err) {
                setError(err.message || 'Failed to delete breaking news')
            }
        }
    }

    return (
        <TitleCard title="Breaking News Management">
            <div className="space-y-4">
                <div className="flex gap-2">
                    <input
                        type="text"
                        className="input input-bordered flex-1"
                        value={newNewsText}
                        onChange={(e) => setNewNewsText(e.target.value)}
                        placeholder="Enter breaking news text"
                    />
                    <button
                        className="btn btn-primary"
                        onClick={handleCreate}
                    >
                        Add Breaking News
                    </button>
                </div>

                {loading && <div className="text-center">Loading...</div>}
                {error && <div className="text-center text-red-500">{error}</div>}

                <div className="space-y-4">
                    {news.map((item) => (
                        <div key={item._id} className="border p-4 rounded-lg">
                            {editingNews === item._id ? (
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        className="input input-bordered flex-1"
                                        defaultValue={item.text}
                                        onChange={(e) => item.text = e.target.value}
                                    />
                                    <button
                                        className="btn btn-success"
                                        onClick={() => handleUpdate(item._id, { text: item.text })}
                                    >
                                        Save
                                    </button>
                                    <button
                                        className="btn btn-ghost"
                                        onClick={() => setEditingNews(null)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <div className="flex justify-between items-center">
                                    <p>{item.text}</p>
                                    <div className="space-x-2">
                                        <button
                                            className="btn btn-sm btn-info"
                                            onClick={() => setEditingNews(item._id)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-sm btn-error"
                                            onClick={() => handleDelete(item._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </TitleCard>
    )
}

export default BreakingNews
