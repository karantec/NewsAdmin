import { useEffect, useState } from 'react'
import { createPodcast, getAllPodcasts, updatePodcast, deletePodcast } from '../../../app/api'
import TitleCard from '../../../components/Cards/TitleCard'
import { useForm } from 'react-hook-form'

function PodcastManagement() {
    const [podcasts, setPodcasts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [editingPodcast, setEditingPodcast] = useState(null)
    const { register, handleSubmit, reset } = useForm()

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

    const onSubmit = async (data) => {
        try {
            if (editingPodcast) {
                await updatePodcast(editingPodcast._id, data)
                setEditingPodcast(null)
            } else {
                await createPodcast(data)
            }
            reset()
            fetchPodcasts()
        } catch (err) {
            setError(err.message || 'Failed to save podcast')
        }
    }

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

    const handleEdit = (podcast) => {
        setEditingPodcast(podcast)
        reset(podcast) // Pre-fill form with podcast data
    }

    return (
        <>
            <TitleCard title="Add New Podcast">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <input
                        {...register("title")}
                        className="input input-bordered w-full"
                        placeholder="Podcast Title"
                    />
                    <textarea
                        {...register("description")}
                        className="textarea textarea-bordered w-full"
                        placeholder="Description"
                    />
                    <input
                        {...register("audioUrl")}
                        className="input input-bordered w-full"
                        placeholder="Audio URL"
                    />
                    <input
                        {...register("imageUrl")}
                        className="input input-bordered w-full"
                        placeholder="Cover Image URL"
                    />
                    <button type="submit" className="btn btn-primary">
                        {editingPodcast ? 'Update Podcast' : 'Add Podcast'}
                    </button>
                </form>
            </TitleCard>

            <TitleCard title="All Podcasts" topMargin="mt-4">
                {loading && <div className="text-center">Loading podcasts...</div>}
                {error && <div className="text-center text-red-500">{error}</div>}

                <div className="grid gap-4">
                    {podcasts.map((podcast) => (
                        <div key={podcast._id} className="border p-4 rounded-lg">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-semibold">{podcast.title}</h3>
                                    <p className="text-gray-600 mt-2">{podcast.description}</p>
                                    {podcast.audioUrl && (
                                        <audio controls className="mt-2">
                                            <source src={podcast.audioUrl} type="audio/mpeg" />
                                            Your browser does not support the audio element.
                                        </audio>
                                    )}
                                </div>
                                {podcast.imageUrl && (
                                    <img
                                        src={podcast.imageUrl}
                                        alt={podcast.title}
                                        className="w-24 h-24 object-cover rounded"
                                    />
                                )}
                            </div>
                            <div className="flex gap-2 mt-4">
                                <button
                                    className="btn btn-sm btn-info"
                                    onClick={() => handleEdit(podcast)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-sm btn-error"
                                    onClick={() => handleDelete(podcast._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </TitleCard>
        </>
    )
}

export default PodcastManagement
