import axios from "axios";

// Base URL for your backend API
// const BASE_URL = "http://44.211.243.116:30001/api/";
const BASE_URL = "https://bbc-newsbackend-2yyf.onrender.com/"

// Axios instance for default configurations
const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Handle errors globally (optional)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error?.response?.data?.message || "Something went wrong");
    }
);

const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication required');
    return token;
};

// Authentication APIs
export const loginUser = async (email, password) => {
    try {
        const response = await apiClient.post("super-admin/auth/login", { email, password });
        if (response?.data?.data) {
            const { _token, name, email: userEmail, roles } = response.data.data;
            localStorage.setItem("userName", name);
            localStorage.setItem("token", _token);
            localStorage.setItem("userEmail", userEmail); // Changed from email to userEmail to avoid duplicate declaration
            localStorage.setItem("userRoles", JSON.stringify(roles));
            return { status: true, message: response.data.message };
        }
        return { status: false, message: response.data.message || "Login failed" };
    } catch (error) {
        return { status: false, message: error?.response?.data?.message || "Something went wrong" };
    }
};

export const registerUser = async (userData) => {
    const response = await apiClient.post("/auth/register", userData);
    return response.data;
};

export const forgotPassword = async (email) => {
    const response = await apiClient.post("/auth/forgot-password", { email });
    return response.data;
};

export const resetPassword = async (otp, newPassword) => {
    const response = await apiClient.post("/auth/reset-password", { otp, password: newPassword });
    return response.data;
};

// Utility API: Fetch Privacy Policy
export const fetchPrivacyPolicy = async () => {
    const response = await apiClient.get("super-admin/utility/privacy");
    return response.data; // Assuming the API returns an object with privacy policy content
};

// Add error handling for API calls
const handleApiError = (error) => {
    console.error('API Error:', error);
    throw new Error(error?.response?.data?.message || "Something went wrong");
};

// Blog APIs
export const fetchAllBlogs = async () => {
    try {
        const response = await apiClient.get("api/blog/blogs");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchBlogById = async (blogId) => {
    try {
        const response = await apiClient.get(`api/blog/blogs/${blogId}`);
        if (response?.data?.message) {
            return { data: response.data.message };
        }
        throw new Error('Invalid response format');
    } catch (error) {
        throw error;
    }
};

export const createBlog = async (blogData) => {
    const response = await apiClient.post('api/blog/createblogs', blogData);
    return response.data;
};

export const updateBlog = async (blogId, blogData) => {
    try {
        const response = await apiClient.patch(`api/blog/update/blog/${blogId}`, blogData);
        if (!response.data) {
            throw new Error('No response data received');
        }
        return response.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message || 'Failed to update blog');
    }
};

export const deleteBlog = async (blogId) => {
    try {
        const response = await apiClient.delete(`api/blog/delete/${blogId}`);
        return response.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message || 'Failed to delete blog');
    }
};

// Breaking News APIs
export const createBreakingNews = async (newsData) => {
    try {
        const response = await apiClient.post('/api/breakingnews/createbreakingnews', newsData);
        return response.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message || 'Failed to create breaking news');
    }
};

export const getBreakingNews = async () => {
    try {
        const response = await apiClient.get('/api/breakingnews/getbreakingnews');
        return response.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message || 'Failed to fetch breaking news');
    }
};

// Add these missing functions
export const updateBreakingNews = async (newsId, newsData) => {
    try {
        const response = await apiClient.patch(`/api/breakingnews/update/${newsId}`, newsData);
        if (!response.data) {
            throw new Error('No response data received');
        }
        return response.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message || 'Failed to update breaking news');
    }
};

export const deleteBreakingNews = async (newsId) => {
    try {
        const response = await apiClient.delete(`/api/breakingnews/delete/${newsId}`);
        return response.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message || 'Failed to delete breaking news');
    }
};

// Podcast APIs
export const createPodcast = async (podcastData) => {
    const response = await apiClient.post('/api/podcast/createpodcast', podcastData);
    return response.data;
};

export const getAllPodcasts = async () => {
    try {
        const response = await apiClient.get('/api/podcast/getallpodcast');
        return response.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message || 'Failed to fetch podcasts');
    }
};

export const getPodcastById = async (podcastId) => {
    try {
        const response = await apiClient.get(`api/podcast/podcast/${podcastId}`);
        if (response?.data?.message) {
            return { data: response.data.message };
        }
        throw new Error('Invalid podcast data format');
    } catch (error) {
        throw new Error(error?.response?.data?.message || 'Failed to fetch podcast');
    }
};

export const updatePodcast = async (podcastId, podcastData) => {
    try {
        const response = await apiClient.patch(`api/podcast/update/${podcastId}`, podcastData);
        if (!response.data) {
            throw new Error('No response data received');
        }
        return response.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message || 'Failed to update podcast');
    }
};

export const deletePodcast = async (podcastId) => {
    try {
        const response = await apiClient.delete(`api/podcast/podcast/${podcastId}`);
        return response.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message || 'Failed to delete podcast');
    }
};

// Export the Axios instance for general use
export { apiClient };
