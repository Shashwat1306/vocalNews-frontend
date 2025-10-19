import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchLatestNewsWithAudio = async () => {
    try {
        const response = await axios.post(`${API_URL}/news/latest`);
        return {
            news: response.data.news,
            audioUrl: response.data.audioUrl
        };
    } catch (error) {
        console.error("Error fetching latest news with audio:", error);
        throw error;
    }
};

export const generateVoiceFromNews = async (text, voiceId = "en-US-natalie") => {
    try {
        const response = await axios.post(`${API_URL}/news/convert`, { text, voiceId });
        return response.data.audioUrl;
    } catch (error) {
        console.error("Error generating voice from news:", error);
        throw error;
    }
};