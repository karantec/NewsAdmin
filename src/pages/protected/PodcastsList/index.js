import { useEffect, useState } from 'react'
import { getAllPodcasts, deletePodcast } from '../../../app/api'
import TitleCard from '../../../components/Cards/TitleCard'

function PodcastsList() {
    const [podcasts, setPodcasts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchPodcasts = async () => {
        try {
            const response = await getAllPodcasts()
            setPodcasts(response.data || [])
        } catch (err) {
            setError(err.message || 'Failed to fetch podcasts')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPodcasts()
    }, [])

    const handleDelete = async (podcastId) => {
        if (window.confirm('Are you sure you want to delete this podcast?')) {
            try {
                await deletePodcast(podcastId)
                fetchPodcasts()
            } catch (err) {
                setError(err.message || 'Failed to delete podcast')
            }
        }
    }

    return (
        <TitleCard title="All Podcasts">
            {loading && <div className="text-center">Loading podcasts...</div>}
            {error && <div className="text-center text-red-500">{error}</div>}

            <div className="grid gap-6">
                {podcasts.map((podcast) => (
                    <div key={podcast._id} className="border p-4 rounded-lg shadow-sm">
                        <div className="flex gap-4">
                            {podcast.imageUrl && (
                                <img
                                    src={podcast.imageUrl}
                                    alt={podcast.title}
                                    className="w-32 h-32 object-cover rounded"
                                />
                            )}
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold">{podcast.title}</h3>
                                <p className="text-gray-600 mt-2">{podcast.description}</p>
                                {podcast.audioUrl && (
                                    <div className="mt-3">
                                        <audio controls className="w-full">
                                            <source src={podcast.audioUrl} type="audio/mpeg" />
                                            Your browser does not support the audio element.
                                        </audio>
                                    </div>
                                )}
                                <div className="mt-4 flex gap-2">
                                    <button
                                        onClick={() => handleDelete(podcast._id)}
                                        className="btn btn-sm btn-error"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                            Posted: {new Date(podcast.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                ))}
            </div>
        </TitleCard>
    )
}

export default PodcastsList
