import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getPodcastById, updatePodcast } from '../../../app/api'
import TitleCard from '../../../components/Cards/TitleCard'

function EditPodcast() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [podcast, setPodcast] = useState(null)  // Initialize as null instead of empty object

    useEffect(() => {
        const loadPodcast = async () => {
            try {
                setLoading(true)
                setError(null)
                console.log('Loading podcast with ID:', id)

                const response = await getPodcastById(id)
                console.log('Podcast data:', response)

                if (response?.data) {
                    setPodcast(response.data)
                } else if (response?.message) {
                    setPodcast(response.message)
                } else {
                    throw new Error('No podcast data received')
                }
            } catch (err) {
                console.error('Error loading podcast:', err)
                setError(err.message || 'Failed to load podcast')
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            loadPodcast()
        }
    }, [id])

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!podcast || !podcast.title) {
            setError('Title is required');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Format the podcast data before sending
            const formattedData = {
                title: podcast.title.trim(),
                description: podcast.description?.trim() || '',
                author: podcast.author?.trim() || '',
                thumbnail: podcast.thumbnail || '',
                videoUrl: podcast.videoUrl || ''
            };

            console.log('Submitting update:', formattedData); // Debug log

            await updatePodcast(id, formattedData);
            alert('Podcast updated successfully');
            navigate('/app/podcasts-list');
        } catch (err) {
            console.error('Update error:', err);
            setError(err.message || 'Failed to update podcast');
            alert(`Failed to update podcast: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <TitleCard title="Edit Podcast">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </TitleCard>
        )
    }

    if (error) {
        return (
            <TitleCard title="Edit Podcast">
                <div className="text-center text-red-600 p-4">
                    <p>{error}</p>
                    <button
                        className="btn btn-primary mt-4"
                        onClick={() => navigate('/app/podcasts-list')}
                    >
                        Back to Podcasts
                    </button>
                </div>
            </TitleCard>
        )
    }

    if (!podcast) {
        return (
            <TitleCard title="Edit Podcast">
                <div className="text-center p-4">
                    <p>Podcast not found</p>
                    <button
                        className="btn btn-primary mt-4"
                        onClick={() => navigate('/app/podcasts-list')}
                    >
                        Back to Podcasts
                    </button>
                </div>
            </TitleCard>
        )
    }

    return (
        <TitleCard title="Edit Podcast">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="label">Title</label>
                    <input
                        type="text"
                        className="input input-bordered w-full"
                        value={podcast.title || ''}
                        onChange={(e) => setPodcast({ ...podcast, title: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <label className="label">Description</label>
                    <textarea
                        className="textarea textarea-bordered w-full h-32"
                        value={podcast.description || ''}
                        onChange={(e) => setPodcast({ ...podcast, description: e.target.value })}
                    />
                </div>

                <div>
                    <label className="label">Author</label>
                    <input
                        type="text"
                        className="input input-bordered w-full"
                        value={podcast.author || ''}
                        onChange={(e) => setPodcast({ ...podcast, author: e.target.value })}
                    />
                </div>

                <div>
                    <label className="label">Thumbnail URL</label>
                    {podcast.thumbnail && (
                        <img
                            src={podcast.thumbnail}
                            alt="Thumbnail preview"
                            className="w-32 h-32 object-cover rounded mb-2"
                        />
                    )}
                    <input
                        type="text"
                        className="input input-bordered w-full"
                        value={podcast.thumbnail || ''}
                        onChange={(e) => setPodcast({ ...podcast, thumbnail: e.target.value })}
                    />
                </div>

                <div>
                    <label className="label">Video URL</label>
                    {podcast.videoUrl && (
                        <video controls className="w-full max-h-48 object-cover rounded mb-2">
                            <source src={podcast.videoUrl} type="video/mp4" />
                        </video>
                    )}
                    <input
                        type="text"
                        className="input input-bordered w-full"
                        value={podcast.videoUrl || ''}
                        onChange={(e) => setPodcast({ ...podcast, videoUrl: e.target.value })}
                    />
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => navigate('/app/podcasts-list')}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Update Podcast'}
                    </button>
                </div>
            </form>
        </TitleCard>
    )
}

export default EditPodcast
