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
  const [detecting, setDetecting] = useState(false);
  const [detectedTranscript, setDetectedTranscript] = useState("");

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

  // Lightweight language detection based on keyword scoring
  const detectLanguage = (text) => {
    if (!text || !text.trim()) return selectedLanguage;
    const t = text.toLowerCase();

    // First, explicit language mentions (higher priority)
    const explicit = {
      en: ["english", "inglés", "inglês", "anglais"],
      hi: ["hindi", "हिन्दी", "हिंदी"],
      es: ["spanish", "español", "espanol"],
      fr: ["french", "français", "francais"],
      de: ["german", "deutsch", "alemán", "aleman"],
    };

    for (const [lang, tokens] of Object.entries(explicit)) {
      for (const tok of tokens) {
        if (t.includes(tok)) return lang;
      }
    }

    // fallback heuristic scoring (previous approach)
    const scores = { en: 0, hi: 0, es: 0, fr: 0, de: 0 };
    const lists = {
      en: [" the ", " and ", " is ", " in ", " to ", " of ", " for ", "news"],
      hi: ["है", "और", "के", "का", "हैं", "में", "कर"],
      es: [" que ", " el ", " la ", " y ", " es ", " para ", "por"],
      fr: [" le ", " la ", " et ", " que ", " est ", " pour ", "dans"],
      de: [" der ", " die ", " und ", " ist ", " zu ", " nicht ", " das "],
    };

    if (/[\u0900-\u097F]/.test(text)) scores.hi += 3;

    Object.entries(lists).forEach(([lang, words]) => {
      words.forEach((w) => {
        let idx = t.indexOf(w.trim());
        while (idx !== -1) {
          scores[lang] += 1;
          idx = t.indexOf(w.trim(), idx + 1);
        }
      });
    });

    if (/[áéíóúñ]/.test(t)) scores.es += 2;
    if (/[éèàê]/.test(t)) scores.fr += 2;
    if (/ß|ö|ä|ü/.test(t)) scores.de += 2;

    const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
    if (!best || best[1] === 0) return selectedLanguage;
    return best[0];
  };

  // Lightweight category detection based on keywords
  const detectCategory = (text) => {
    if (!text || !text.trim()) return selectedCategory;
    const t = text.toLowerCase();

    // explicit category mentions
    const explicitMap = {
      technology: ["technology", "tech", "ai", "artificial intelligence", "software", "computer", "internet"],
      business: ["business", "economy", "market", "stocks", "finance", "company", "trade"],
      sports: ["sports", "sport", "game", "match", "goal", "score", "tournament", "league"],
      entertainment: ["entertainment", "movie", "film", "music", "actor", "celebrity", "show", "tv"],
      health: ["health", "hospital", "covid", "disease", "vaccine", "doctor", "medical"],
      science: ["science", "research", "study", "space", "nasa", "experiment"],
      general: ["news", "breaking", "update", "headline"],
    };

    // If transcript mentions category names directly, pick that first
    for (const [cat, tokens] of Object.entries(explicitMap)) {
      for (const tok of tokens) {
        if (t.includes(tok)) return cat;
      }
    }

    // fallback scoring (broader keyword match)
    const scores = Object.fromEntries(Object.keys(explicitMap).map((k) => [k, 0]));
    Object.entries(explicitMap).forEach(([cat, words]) => {
      words.forEach((w) => {
        if (t.includes(w)) scores[cat] += 1;
      });
    });

    const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
    if (!best || best[1] === 0) return selectedCategory; // fallback
    return best[0];
  };

  const handleDetectFromSpeech = async () => {
    // Use the helper that records and sends audio to the backend, then process transcript
    try {
      setDetecting(true);
      setDetectedTranscript("");

      const data = await recordAndSendToBackend();
      const transcript = data?.transcript || data?.text || (typeof data === 'string' ? data : "");
      setDetectedTranscript(transcript || "");

      if (!transcript) {
        alert("No speech detected. Please try again.");
        return;
      }

      const lang = detectLanguage(transcript);
      const cat = detectCategory(transcript);
      setSelectedLanguage(lang);
      setSelectedCategory(cat);
    } catch (err) {
      console.error("Detection error:", err);
      alert("Failed to detect from speech. See console for details.");
    } finally {
      setDetecting(false);
    }
  };


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
  const recordAndSendToBackend = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" });
      const chunks = [];

      return await new Promise((resolve, reject) => {
        mediaRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) chunks.push(event.data);
        };

        mediaRecorder.onerror = (err) => {
          // stop tracks
          try { stream.getTracks().forEach((t) => t.stop()); } catch (_) {}
          reject(err);
        };

        mediaRecorder.onstop = async () => {
          const blob = new Blob(chunks, { type: "audio/webm" });
          const formData = new FormData();
          formData.append("file", blob, "recording.webm");

          try {
            const response = await axios.post(
              `${import.meta.env.VITE_API_URL}/deepgram/transcribe`,
              formData,
              {
                headers: { "Content-Type": "multipart/form-data" },
              }
            );
            // stop tracks
            try { stream.getTracks().forEach((t) => t.stop()); } catch (_) {}
            resolve(response.data);
          } catch (uploadError) {
            try { stream.getTracks().forEach((t) => t.stop()); } catch (_) {}
            reject(uploadError);
          }
        };

        mediaRecorder.start();
        setTimeout(() => mediaRecorder.stop(), 5000);
      });
    } catch (err) {
      throw err;
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

          {/* Speech Detection - detect language & category from spoken input */}
          <div className="space-y-2">
            <Label>Or detect category & language from speech</Label>
            <div className="flex gap-2">
              <Button onClick={handleDetectFromSpeech} disabled={detecting || newsLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                {detecting ? "Listening..." : "🎤 Detect from Speech"}
              </Button>
              <Button onClick={() => { setDetectedTranscript(""); }} variant="ghost" className="ml-2">
                Clear
              </Button>
            </div>

            {detectedTranscript && (
              <div className="mt-2 p-2 bg-gray-50 border border-gray-200 rounded">
                <div className="text-sm text-gray-700"><strong>Transcript:</strong> {detectedTranscript}</div>
                <div className="mt-1 text-xs text-gray-600">Detected language: <strong>{selectedLanguage}</strong> · Detected category: <strong>{selectedCategory}</strong></div>
              </div>
            )}
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
