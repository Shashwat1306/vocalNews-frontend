import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { fetchLatestNewsWithAudio } from "../api/news-api";

const VocalNews = () => {
  const [audioUrl, setAudioUrl] = useState("");
  const [newsLoading, setNewsLoading] = useState(false);
  const [currentNews, setCurrentNews] = useState(null);

  const handleFetchLatestNews = async () => {
    setNewsLoading(true);
    try {
      const { news, audioUrl } = await fetchLatestNewsWithAudio();
      setCurrentNews(news);
      setAudioUrl(audioUrl);
    } catch (error) {
      alert("Error fetching latest news");
      console.error(error);
    } finally {
      setNewsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex justify-center py-8">
      <Card className={`mx-auto mt-4 transition-all duration-500 ${
        currentNews || audioUrl 
          ? 'w-full max-w-2xl min-h-fit' 
          : 'w-full max-w-md h-auto'
      }`}>
        <CardHeader>
          <CardTitle className="space-y-1 text-center">🗞️ VocalNews</CardTitle>
          <CardDescription className="text-center">
            Get the latest tech news and listen to it instantly
          </CardDescription>
        </CardHeader>
        <CardContent className={`transition-all duration-300 ${
          currentNews || audioUrl ? 'space-y-6 pt-6 pb-2' : 'space-y-3 pt-4 pb-3'
        }`}>
          {/* Latest News Section */}
          <div className="grid w-full items-center gap-3">
            <Button
              onClick={handleFetchLatestNews}
              disabled={newsLoading}
              className="bg-red-600 hover:bg-red-700 text-white w-full"
            >
              {newsLoading ? "Fetching Latest News..." : "📰 Get Latest Tech News & Read Aloud"}
            </Button>
          </div>

          {/* Current News Display - Only show when news is loaded */}
          {currentNews && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg animate-in slide-in-from-top-2 duration-300">
              <h3 className="font-bold text-lg mb-2">📈 Latest News:</h3>
              <h4 className="font-semibold text-md mb-1">{currentNews.title}</h4>
              <p className="text-sm text-gray-600">{currentNews.description}</p>
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
  );
};
export default VocalNews;
