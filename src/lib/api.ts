import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

export const getCampaigns = async () => {
    const response = await api.get('/campaigns');
    return response.data;
};

export const getCampaign = async (id: string) => {
    const response = await api.get(`/campaigns/${id}`);
    return response.data;
};

export const createCampaign = async (data: any) => {
    const response = await api.post('/campaigns', data);
    return response.data;
};

export const generateSchedule = async (campaignId: string) => {
    const response = await api.post(`/campaigns/${campaignId}/generate`);
    return response.data;
};

export const getCampaignPosts = async (campaignId: string) => {
    const response = await api.get(`/campaigns/${campaignId}/posts`);
    return response.data;
};

export const getMetrics = async () => {
    const response = await api.get('/metrics');
    return response.data;
};

// Master Data API functions
export const getKeywords = async () => {
    const response = await api.get('/master/keywords');
    return response.data;
};

export const createKeyword = async (keyword: string, description?: string) => {
    const response = await api.post('/master/keywords', null, {
        params: { keyword, description }
    });
    return response.data;
};

export const updateKeyword = async (id: number, data: { keyword?: string; description?: string; is_active?: boolean }) => {
    const response = await api.put(`/master/keywords/${id}`, null, { params: data });
    return response.data;
};

export const deleteKeyword = async (id: number) => {
    const response = await api.delete(`/master/keywords/${id}`);
    return response.data;
};

export const getSubreddits = async () => {
    const response = await api.get('/master/subreddits');
    return response.data;
};

export const createSubreddit = async (name: string, description?: string) => {
    const response = await api.post('/master/subreddits', null, {
        params: { name, description }
    });
    return response.data;
};

export const updateSubreddit = async (id: number, data: { name?: string; description?: string; is_active?: boolean }) => {
    const response = await api.put(`/master/subreddits/${id}`, null, { params: data });
    return response.data;
};

export const deleteSubreddit = async (id: number) => {
    const response = await api.delete(`/master/subreddits/${id}`);
    return response.data;
};

export const getMasterPersonas = async () => {
    const response = await api.get('/master/personas');
    return response.data;
};

export const createMasterPersona = async (username: string, backstory: string, tone_style?: string) => {
    const response = await api.post('/master/personas', null, {
        params: { username, backstory, tone_style }
    });
    return response.data;
};

export const updateMasterPersona = async (id: number, data: { username?: string; backstory?: string; tone_style?: string; is_active?: boolean }) => {
    const response = await api.put(`/master/personas/${id}`, null, { params: data });
    return response.data;
};

export const deleteMasterPersona = async (id: number) => {
    const response = await api.delete(`/master/personas/${id}`);
    return response.data;
};

// New Advanced Features API functions
export const getSubredditCategories = async () => {
    const response = await api.get('/master/subreddit-categories');
    return response.data;
};

export const getKeywordThemes = async () => {
    const response = await api.get('/master/keyword-themes');
    return response.data;
};

export const getReviewQueue = async (campaignId: string) => {
    const response = await api.get(`/campaigns/${campaignId}/review-queue`);
    return response.data;
};

export const reviewContent = async (campaignId: string, itemId: number, action: string, notes?: string) => {
    const response = await api.post(`/campaigns/${campaignId}/review/${itemId}`, { action, notes });
    return response.data;
};

export const getAdvancedSettings = async (campaignId: string) => {
    const response = await api.get(`/campaigns/${campaignId}/advanced-settings`);
    return response.data;
};

export const updateAdvancedSettings = async (campaignId: string, settings: any) => {
    const response = await api.put(`/campaigns/${campaignId}/advanced-settings`, settings);
    return response.data;
};

export default api;
