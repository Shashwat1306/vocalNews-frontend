import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { generateVoice } from "../api/murf-api";

const VocalNews = () => {
  const [text, setText] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);

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
  return (
    <div className="h-full flex items-center justify-center">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="space-y-1 text-center">🗞️ VocalNews</CardTitle>
          <CardDescription className="text-center">
            Convert your news text to voice
          </CardDescription>
        </CardHeader>
        <CardContent>
          <br/>
          <div className="grid w-full items-center gap-4">
            <Label htmlFor="newsText">Enter your news text</Label>
            <textarea
              id="newsText"
              className="w-full h-40 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your news text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <br/>
          <div className="grid w-full items-center gap-3">
            <Button
              onClick={handleGenerate}
              disabled={loading || !text.trim()}
              className="bg-green-600 hover:bg-green-700 text-white w-full"
            >
              {loading ? "Generating Voice..." : "🎙️ Generate Voice"}
            </Button>
          </div>
          
          {audioUrl && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <Label className="text-lg font-semibold mb-3 block">
                🎧 Generated Audio:
              </Label>
              <audio 
                controls 
                src={audioUrl}
                className="w-full"
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
