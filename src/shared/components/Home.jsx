import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import TextType from "@/components/reactBits/introText.jsx";
import bgImage from "../../../src/assets/bg.jpg";

const Home = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const handleVocalNewsClick = () => {
    navigate("/vocal-news");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <Card className="w-full max-w-2xl mx-auto shadow-lg bg-white/80 backdrop-blur-md">
        <CardHeader className="text-center space-y-6 py-8">
          <div className="space-y-4">
            <TextType
              text="Welcome to VocalNews"
              as="h1"
              className="text-4xl font-bold text-black"
              typingSpeed={80}
              showCursor={true}
              cursorCharacter="|"
              cursorClassName="text-blue-600"
              textColors={["#000000"]}
              loop={false}
            />

            <div className="mt-6">
              <TextType
                text="Your personalized news companion that transforms the latest headlines into engaging audio experiences. Choose your preferred language and category, then sit back and listen to the world's news unfold."
                as="p"
                className="text-lg text-black leading-relaxed max-w-xl mx-auto"
                typingSpeed={30}
                initialDelay={3000}
                showCursor={false}
                textColors={["#000000"]}
                loop={false}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {!localStorage.token && (
              <Button
                onClick={handleRegisterClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                🚀 Get Started - Register Now
              </Button>
            )}

            {localStorage.token && (
              <Button
                onClick={handleVocalNewsClick}
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg font-medium rounded-lg transition-all duration-200"
              >
                🎧 Try VocalNews
              </Button>
            )}
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <div className="text-2xl">🌍</div>
              <h3 className="font-semibold text-black">Multi-Language</h3>
              <p className="text-sm text-black">
                Listen to news in English, Hindi, Spanish, French, and German
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-2xl">📰</div>
              <h3 className="font-semibold text-black">All Categories</h3>
              <p className="text-sm text-black">
                From tech to sports, business to entertainment - we've got it
                all
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-2xl">🎙️</div>
              <h3 className="font-semibold text-black">AI Voices</h3>
              <p className="text-sm text-black">
                High-quality AI-powered voices for natural listening experience
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
