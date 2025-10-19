import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { generateVoice } from "../api/murf-api";
import { fetchLatestNewsWithAudio } from "../api/news-api";

const VocalNews = () => {
  const [text, setText] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [newsLoading, setNewsLoading] = useState(false);
  const [currentNews, setCurrentNews] = useState(null);

  const handleGenerate = async () => {
    if (!text.trim()) return alert("Please enter some text");
    setLoading(true);
    try {
      const url = await generateVoice(text);
      setAudioUrl(url);
    } catch (error) {
      alert("Error generating voice");
    } finally {
      setLoading(false);
    }
  };

  const handleFetchLatestNews = async () => {
    setNewsLoading(true);
    try {
      const { news, audioUrl } = await fetchLatestNewsWithAudio();
      setCurrentNews(news);
      setText(`${news.title}. ${news.description}`);
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
      <Card className="w-full max-w-2xl mx-auto mt-4 min-h-fit">
        <CardHeader>
          <CardTitle className="space-y-1 text-center">🗞️ VocalNews</CardTitle>
          <CardDescription className="text-center">
            Convert your news text to voice
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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

          {/* Current News Display */}
          {currentNews && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-bold text-lg mb-2">📈 Latest News:</h3>
              <h4 className="font-semibold text-md mb-1">{currentNews.title}</h4>
              <p className="text-sm text-gray-600">{currentNews.description}</p>
            </div>
          )}

          {/* Manual Text Input Section */}
          <div className="space-y-3">
            <Label htmlFor="newsText">Or enter your own text</Label>
            <textarea
              id="newsText"
              className="w-full h-32 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your news text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          
          <div className="grid w-full items-center gap-3">
            <Button
              onClick={handleGenerate}
              disabled={loading || !text.trim()}
              className="bg-green-600 hover:bg-green-700 text-white w-full"
            >
              {loading ? "Generating Voice..." : "🎙️ Generate Voice from Text"}
            </Button>
          </div>
          
          {/* Audio Player Section */}
          {audioUrl && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
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
