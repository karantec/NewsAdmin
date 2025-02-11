import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getBreakingNews, updateBreakingNews } from '../../../app/api'
import TitleCard from '../../../components/Cards/TitleCard'

function EditBreakingNews() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [news, setNews] = useState({ title: '' })

    useEffect(() => {
        const loadNews = async () => {
            try {
                const response = await getBreakingNews(id)
                setNews(response.data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        loadNews()
    }, [id])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await updateBreakingNews(id, news)
            alert('Breaking news updated successfully')
            navigate('/app/breaking-news')
        } catch (err) {
            setError(err.message)
        }
    }

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>

    return (
        <TitleCard title="Edit Breaking News">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="label">Breaking News Text</label>
                    <textarea
                        className="textarea textarea-bordered w-full h-32"
                        value={news.title}
                        onChange={(e) => setNews({ ...news, title: e.target.value })}
                    />
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => navigate('/app/breaking-news')}
                    >
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                        Update News
                    </button>
                </div>
            </form>
        </TitleCard>
    )
}

export default EditBreakingNews
