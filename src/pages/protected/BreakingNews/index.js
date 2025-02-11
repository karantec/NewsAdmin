import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { createBreakingNews, getBreakingNews, updateBreakingNews, deleteBreakingNews } from '../../../app/api'
import TitleCard from '../../../components/Cards/TitleCard'

function BreakingNews() {
    const navigate = useNavigate()
    const [news, setNews] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [editingNews, setEditingNews] = useState(null)
    const [newNewsText, setNewNewsText] = useState("")

    const fetchNews = useCallback(async () => {
        try {
            const response = await getBreakingNews();
            if (response?.data) {
                setNews(response.data);
            } else {
                setNews([]);
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch breaking news');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNews();
    }, [fetchNews]);

    const handleCreate = async () => {
        if (!newNewsText.trim()) return
        try {
            await createBreakingNews({ title: newNewsText })
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

    const handleEdit = (newsId) => {
        navigate(`/app/breaking-news/edit/${newsId}`)
    }

    return (
        <TitleCard title="ब्रेकिंग न्यूज़">
            <div className="space-y-6">
                <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                        <h3 className="card-title text-lg mb-4">नई ब्रेकिंग न्यूज़ जोड़ें</h3>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                className="input input-bordered flex-1"
                                value={newNewsText}
                                onChange={(e) => setNewNewsText(e.target.value)}
                                placeholder="ब्रेकिंग न्यूज़ टेक्स्ट दर्ज करें"
                            />
                            <button
                                className="btn btn-primary"
                                onClick={handleCreate}
                            >
                                जोड़ें
                            </button>
                        </div>
                    </div>
                </div>

                {loading && <div className="text-center p-8"><div className="btn btn-ghost loading">Loading...</div></div>}
                {error && <div className="alert alert-error shadow-lg">{error}</div>}

                <div className="grid gap-4">
                    {news.map((item) => (
                        <div key={item._id} className="card bg-base-100 shadow-lg">
                            <div className="card-body">
                                {editingNews === item._id ? (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            className="input input-bordered flex-1"
                                            defaultValue={item.title}
                                            onChange={(e) => item.title = e.target.value}
                                        />
                                        <button
                                            className="btn btn-success"
                                            onClick={() => handleUpdate(item._id, { title: item.title })}
                                        >
                                            सहेजें
                                        </button>
                                        <button
                                            className="btn btn-ghost"
                                            onClick={() => setEditingNews(null)}
                                        >
                                            रद्द करें
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex justify-between items-center">
                                        <p className="flex-1 text-lg">{item.title}</p>
                                        <div className="flex gap-2">
                                            <button
                                                className="btn btn-info btn-sm"
                                                onClick={() => handleEdit(item._id)}
                                            >
                                                संपादित करें
                                            </button>
                                            <button
                                                className="btn btn-error btn-sm"
                                                onClick={() => handleDelete(item._id)}
                                            >
                                                हटाएं
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {news.length === 0 && !loading && (
                    <div className="text-center p-8 text-gray-500">
                        कोई ब्रेकिंग न्यूज़ नहीं मिली
                    </div>
                )}
            </div>
        </TitleCard>
    )
}

export default BreakingNews
