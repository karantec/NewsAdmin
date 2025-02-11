import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllPodcasts, deletePodcast } from '../../../app/api'
import TitleCard from '../../../components/Cards/TitleCard'

function PodcastsList() {
    const navigate = useNavigate()
    const [podcasts, setPodcasts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchPodcasts = useCallback(async () => {
        try {
            const response = await getAllPodcasts();
            if (response?.message) {
                setPodcasts(response.message);
            } else {
                setPodcasts([]);
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch podcasts');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPodcasts();
    }, [fetchPodcasts]);

    const handleDelete = async (podcastId) => {
        if (window.confirm('Are you sure you want to delete this podcast?')) {
            try {
                setLoading(true);  // Show loading state while deleting
                await deletePodcast(podcastId);
                // Only refetch if delete was successful
                await fetchPodcasts();
                // Show success message
                alert('Podcast deleted successfully');
            } catch (err) {
                console.error('Delete error:', err);
                setError(err.message || 'Failed to delete podcast');
                // Show error message to user
                alert('Failed to delete podcast: ' + err.message);
            } finally {
                setLoading(false);
            }
        }
    }

    const handleEdit = (podcastId) => {
        navigate(`/app/podcasts/edit/${podcastId}`)
    }

    return (
        <TitleCard title="वीडियो पॉडकास्ट्स">
            {loading && <div className="text-center p-8"><div className="btn btn-ghost loading">Loading...</div></div>}
            {error && <div className="alert alert-error shadow-lg">{error}</div>}

            <div className="grid md:grid-cols-2 gap-6">
                {podcasts.map((podcast) => (
                    <div key={podcast._id} className="card bg-base-100 shadow-xl">
                        {podcast.thumbnail && (
                            <figure>
                                <img
                                    src={podcast.thumbnail}
                                    alt={podcast.title}
                                    className="w-full h-48 object-cover"
                                />
                            </figure>
                        )}
                        <div className="card-body">
                            <h2 className="card-title">{podcast.title}</h2>
                            <p className="text-gray-600">{podcast.description}</p>
                            {podcast.videoUrl && (
                                <div className="mt-3">
                                    <video controls className="w-full rounded-lg shadow">
                                        <source src={podcast.videoUrl} type="video/mp4" />
                                    </video>
                                </div>
                            )}
                            <div className="card-actions justify-between items-center mt-4">
                                <div className="text-sm text-gray-500">
                                    <div>लेखक: {podcast.author}</div>
                                    <div>प्रकाशित: {new Date(podcast.createdAt).toLocaleDateString('hi-IN')}</div>
                                </div>
                                <button
                                    onClick={() => handleDelete(podcast._id)}
                                    className="btn btn-error btn-sm"
                                >
                                    हटाएं
                                </button>
                                <button
                                    onClick={() => handleEdit(podcast._id)}
                                    className="btn btn-sm btn-info"
                                >
                                    Edit
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {podcasts.length === 0 && !loading && (
                <div className="text-center p-8 text-gray-500">
                    कोई पॉडकास्ट नहीं मिला
                </div>
            )}
        </TitleCard>
    )
}

export default PodcastsList
