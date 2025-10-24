import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useState } from "react";
import { fetchLatestNewsWithAudio } from "../api/news-api";
import bgImage from "../../../src/assets/bg.jpg";
import axios from "axios";

const VocalNews = () => {
  const [audioUrl, setAudioUrl] = useState("");
  const [newsLoading, setNewsLoading] = useState(false);
  const [currentNews, setCurrentNews] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [selectedCategory, setSelectedCategory] = useState("technology");
  const [saveLoading, setSaveLoading] = useState(false);

  // Language options based on backend voiceMap
  const languageOptions = [
    { value: "en", label: "🇺🇸 English", voice: "Natalie" },
    { value: "hi", label: "🇮🇳 Hindi", voice: "Kabir" },
    { value: "es", label: "🇪🇸 Spanish", voice: "Carmen" },
    { value: "fr", label: "🇫🇷 French", voice: "Adélie" },
    { value: "de", label: "🇩🇪 German", voice: "Lukas" },
  ];

  // News categories
  const categories = [
    { id: "general", name: "📰 General", icon: "📰" },
    { id: "business", name: "💼 Business", icon: "💼" },
    { id: "technology", name: "💻 Technology", icon: "💻" },
    { id: "entertainment", name: "🎬 Entertainment", icon: "🎬" },
    { id: "health", name: "🏥 Health", icon: "🏥" },
    { id: "science", name: "🔬 Science", icon: "🔬" },
    { id: "sports", name: "⚽ Sports", icon: "⚽" },
  ];


  const handleFetchLatestNews = async () => {
    setNewsLoading(true);
    try {
      const { news, audioUrl } = await fetchLatestNewsWithAudio(selectedLanguage, selectedCategory);
      setCurrentNews(news);
      setAudioUrl(audioUrl);
    } catch (error) {
      alert("Error fetching latest news");
      console.error(error);
    } finally {
      setNewsLoading(false);
    }
  };

  const handleSaveNews = async () => {
    if (!currentNews) return;
    
    setSaveLoading(true);
    try {
      const token = localStorage.getItem("token");
      if(!token){
        alert("Please login to save news articles.");
        setSaveLoading(false);
        return;
      }
      const newsToSave = {
        title: currentNews.title,
        description: currentNews.description,
        content: currentNews.content,
        url: currentNews.url,
        source : currentNews.source || "Unknown",
        publishedAt: currentNews.publishedAt,
        audioUrl: audioUrl,
        category: currentNews.category,
      };
      await axios.post(
        `${import.meta.env.VITE_API_URL}/saved-news/save`,
        newsToSave,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("News article saved successfully!");
    } catch (error) {
      console.error("Error saving news:", error);
      alert("Failed to save news article. Please try again.");
    } finally {
      setSaveLoading(false);
    }
  };
  return (
    <div className="min-h-screen">
      <div
        className="min-h-screen flex justify-center py-8 bg-cover bg-center"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      >
        <Card className={`mx-auto mt-4 transition-all duration-500 shadow-lg bg-white/80 backdrop-blur-md hover:scale-105 hover:shadow-2xl hover:bg-white/85 transform ease-in-out ${
          currentNews || audioUrl 
            ? 'w-full max-w-2xl min-h-fit' 
            : 'w-full max-w-md h-auto'
        }`}>
        <CardHeader>
          <CardTitle className="space-y-1 text-center">🗞️ VocalNews</CardTitle>
          <CardDescription className="text-center">
            Get the latest news in any category and listen to it instantly
          </CardDescription>
        </CardHeader>
        <CardContent className={`transition-all duration-300 ${
          currentNews || audioUrl ? 'space-y-6 pt-6 pb-2' : 'space-y-3 pt-4 pb-3'
        }`}>
          {/* Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="category-select">Choose News Category</Label>
            <Select
              id="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              disabled={newsLoading}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </div>

          {/* Language Selection */}
          <div className="space-y-2">
            <Label htmlFor="language-select">Choose Voice Language</Label>
            <Select
              id="language-select"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              disabled={newsLoading}
            >
              {languageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} ({option.voice})
                </option>
              ))}
            </Select>
          </div>

          {/* Latest News Section */}
          <div className="grid w-full items-center gap-3">
            <Button
              onClick={handleFetchLatestNews}
              disabled={newsLoading}
              className="bg-red-600 hover:bg-red-700 text-white w-full"
            >
              {newsLoading 
                ? "Fetching Latest News..." 
                : `📰 Get Latest ${categories.find(c => c.id === selectedCategory)?.name || 'News'} & Read Aloud`
              }
            </Button>
          </div>

          {/* Current News Display - Only show when news is loaded */}
          {currentNews && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg animate-in slide-in-from-top-2 duration-300">
              <h3 className="font-bold text-lg mb-2">📈 Latest News:</h3>
              <h4 className="font-semibold text-md mb-1">{currentNews.title}</h4>
              <p className="text-sm text-gray-600 mb-2">{currentNews.description}</p>
              <div className="flex flex-row gap-2">
                {currentNews.url && (
                  <Button
                    onClick={() => window.open(currentNews.url, '_blank')}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-md transition-colors duration-200 flex-1"
                  >
                    📖 Read Full Article  
                  </Button>
                )}
                <Button
                  onClick={handleSaveNews}
                  disabled={saveLoading}
                  variant="outline"
                  className="border-green-500 text-green-700 hover:bg-green-50 text-xs px-3 py-1.5 rounded-md transition-colors duration-200 flex-1"
                >
                  {saveLoading ? "Saving..." : "💾 Save"}
                </Button>
              </div>
            </div>
          )}
          
          {/* Audio Player Section - Only show when audio is available */}
          {audioUrl && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg animate-in slide-in-from-bottom-2 duration-300">
              <Label className="text-lg font-semibold mb-3 block">
                🎧 Generated Audio:
              </Label>
              <audio 
                controls 
                src={audioUrl}
                className="w-full max-w-full"
              >
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default VocalNews;
