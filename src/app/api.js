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

// Authentication APIs
export const loginUser = async (email, password) => {
    try {
        const response = await apiClient.post("super-admin/auth/login", { email, password });

        // Check if login was successful
        if (response.status === 200 && response.data.status) {
            // Save the token and other user info to localStorage (or state if needed)
            const { _token, name, email, roles } = response.data.data;
            const token = _token;
            localStorage.setItem("userName", name);  // Save token
            localStorage.setItem("token", token); // Optionally store other data
            localStorage.setItem("userEmail", email);
            localStorage.setItem("userRoles", JSON.stringify(roles));

            return { status: true, message: response.data.message };
        } else {
            return { status: false, message: response.data.message || "Login failed" };
        }
    } catch (error) {
        // Handle any errors that occur during the API request
        return {
            status: false,
            message: error?.response?.data?.message || "Something went wrong",
        };
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

// Blog APIs
export const fetchAllBlogs = async () => {
    const token = localStorage.getItem('token');
    const response = await apiClient.get("blogs", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

export const fetchBlogById = async (blogId) => {
    const token = localStorage.getItem('token');
    const response = await apiClient.get(`blogs/${blogId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

export const createBlog = async (blogData) => {
    const token = localStorage.getItem('token');
    const response = await apiClient.post('createblogs', blogData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

export const updateBlog = async (blogId, blogData) => {
    const token = localStorage.getItem('token');
    const response = await apiClient.put(`update/blogs/${blogId}`, blogData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

export const deleteBlog = async (blogId) => {
    const token = localStorage.getItem('token');
    const response = await apiClient.delete(`blogs/${blogId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

// Breaking News APIs
export const createBreakingNews = async (newsData) => {
    const token = localStorage.getItem('token');
    const response = await apiClient.post('createbreakingnews', newsData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

export const getBreakingNews = async () => {
    const token = localStorage.getItem('token');
    const response = await apiClient.get('getbreakingnews', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

export const updateBreakingNews = async (newsId, newsData) => {
    const token = localStorage.getItem('token');
    const response = await apiClient.put(`updatedbreakingnews/${newsId}`, newsData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

export const deleteBreakingNews = async (newsId) => {
    const token = localStorage.getItem('token');
    const response = await apiClient.delete(`deletebreakingnews/${newsId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

// Podcast APIs
export const createPodcast = async (podcastData) => {
    const token = localStorage.getItem('token');
    const response = await apiClient.post('createpodcast', podcastData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

export const getAllPodcasts = async () => {
    const token = localStorage.getItem('token');
    const response = await apiClient.get('getallpodcast', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

export const getPodcastById = async (podcastId) => {
    const token = localStorage.getItem('token');
    const response = await apiClient.get(`podcast/${podcastId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

export const updatePodcast = async (podcastId, podcastData) => {
    const token = localStorage.getItem('token');
    const response = await apiClient.patch(`updatepodcast/${podcastId}`, podcastData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

export const deletePodcast = async (podcastId) => {
    const token = localStorage.getItem('token');
    const response = await apiClient.delete(`deletepodcast/${podcastId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

// Export the Axios instance for general use
export { apiClient };
