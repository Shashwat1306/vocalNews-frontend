import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;
export const generateVoice = async (text,voiceId="en-US-natalie")=>{
    try{
        const response = await axios.post(`${API_URL}/news/convert`,{text,voiceId});
        return response.data.audioUrl;
    }
    catch(error){
        console.error("Error generating voice:", error);
        throw error;
    }
};