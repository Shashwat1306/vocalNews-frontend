import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import bgImage from "../../../src/assets/bg.jpg";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const Dashboard = () => {
  const [userName, setUserName] = useState("");
  const [savedNews, setSavedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get user info from token (you might need to decode JWT or fetch from API)
useEffect(() => {
  const token = localStorage.getItem("token");
  
  if (token) {
    try {
      const decoded = jwtDecode(token);
      // Assuming your token payload includes user's name or email
      setUserName(decoded.name || "User");
    } catch (error) {
      console.error("Error decoding token:", error);
      setUserName("User");
    }
  }

  fetchSavedNews();
}, []);

const fetchSavedNews = async () => {
  try {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      setLoading(false);
      return;
    }
    const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/saved-news/get`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
    );
    setSavedNews(response.data);
  } catch (err) {
    setError("Failed to fetch saved news");
    console.error("Error fetching saved news:", err);
  } finally {
    setLoading(false);
  }
};

  const handlePlayAudio = (audioUrl) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch(err => console.error("Error playing audio:", err));
    }
  };

  const handleReadFullArticle = (url) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryIcon = (category) => {
    const icons = {
      general: "📰",
      business: "💼", 
      technology: "💻",
      entertainment: "🎬",
      health: "🏥",
      science: "🔬",
      sports: "⚽"
    };
    return icons[category] || "📰";
  };

  const getCategoryColor = (category) => {
    const colors = {
      general: "bg-gray-50/60 border-gray-200",
      business: "bg-green-50/60 border-green-200",
      technology: "bg-blue-50/60 border-blue-200", 
      entertainment: "bg-purple-50/60 border-purple-200",
      health: "bg-red-50/60 border-red-200",
      science: "bg-yellow-50/60 border-yellow-200",
      sports: "bg-orange-50/60 border-orange-200"
    };
    return colors[category] || "bg-gray-50/60 border-gray-200";
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div className="min-h-screen bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <Card className="bg-white/70 backdrop-blur-md shadow-xl border-0">
              <CardHeader className="text-center py-6">
                <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome, {userName}! 👋
                </CardTitle>
                <CardDescription className="text-lg text-gray-700">
                  Here are your saved news articles
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Saved News Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              📚 Your Saved News ({savedNews.length})
            </h2>

            {loading ? (
              <Card className="bg-white/70 backdrop-blur-md">
                <CardContent className="py-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-700">Loading your saved news...</p>
                </CardContent>
              </Card>
            ) : error ? (
              <Card className="bg-white/70 backdrop-blur-md">
                <CardContent className="py-8 text-center">
                  <p className="text-red-600">❌ {error}</p>
                  <Button 
                    onClick={fetchSavedNews}
                    className="mt-4 bg-blue-600 hover:bg-blue-700"
                  >
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            ) : savedNews.length === 0 ? (
              <Card className="bg-white/70 backdrop-blur-md">
                <CardContent className="py-12 text-center">
                  <div className="text-6xl mb-4">📰</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No Saved News Yet</h3>
                  <p className="text-gray-700 mb-4">
                    Start saving news articles from VocalNews to see them here!
                  </p>
                  <Button 
                    onClick={() => window.location.href = '/vocal-news'}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Browse News
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {savedNews.map((news) => (
                  <Card 
                    key={news._id} 
                    className={`bg-white/70 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform ${getCategoryColor(news.category)}`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{getCategoryIcon(news.category)}</span>
                        <span className="text-xs text-gray-600 bg-white/80 px-2 py-1 rounded-full">
                          {news.category}
                        </span>
                      </div>
                      <CardTitle className="text-lg font-bold line-clamp-2 text-gray-900">
                        {news.title}
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-700 line-clamp-2">
                        {news.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {/* Source and Date */}
                        <div className="text-xs text-gray-600 space-y-1">
                          {news.source && (
                            <div className="flex items-center">
                              <span className="font-medium">📋 Source:</span>
                              <span className="ml-1">{news.source}</span>
                            </div>
                          )}
                          <div className="flex items-center">
                            <span className="font-medium">🕒 Saved:</span>
                            <span className="ml-1">{formatDate(news.createdAt)}</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col space-y-2">
                          <Button
                            onClick={() => handleReadFullArticle(news.url)}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                          >
                            📖 Read Full Article
                          </Button>
                          
                          {news.audioUrl && (
                            <Button
                              onClick={() => handlePlayAudio(news.audioUrl)}
                              variant="outline"
                              className="border-green-500 text-green-700 hover:bg-green-50 text-sm"
                            >
                              🎧 Play Audio
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
