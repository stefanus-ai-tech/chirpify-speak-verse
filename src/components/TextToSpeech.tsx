import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const CHAR_LIMIT = 1024;
const WARNING_THRESHOLD = 800;

const voices = [
  { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel" },
  { id: "AZnzlk1XvdvUeBnXmlld", name: "Domi" },
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah" },
  { id: "MF3mGyEYCl7XYWbV9V6O", name: "Elli" },
  { id: "TxGEqnHWrfWFTfGW9XjX", name: "Antoni" },
];

export function TextToSpeech() {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState(voices[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const charCount = text.length;
  const isOverLimit = charCount > CHAR_LIMIT;
  const isNearLimit = charCount >= WARNING_THRESHOLD && !isOverLimit;

  const handleTextChange = (value: string) => {
    setText(value);
    if (value.length > CHAR_LIMIT) {
      toast({
        title: "Character limit exceeded",
        description: `Maximum ${CHAR_LIMIT} characters allowed`,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    if (isOverLimit) return;
    
    setIsLoading(true);
    // Here you would integrate with ElevenLabs API
    // For now, we'll just simulate a delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    
    toast({
      title: "Success!",
      description: "Your audio has been generated.",
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-slideUp">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Free Text to Speech
        </h1>
        <p className="text-center text-muted-foreground">
          Convert your text to natural-sounding speech
        </p>
      </div>

      <div className="space-y-4">
        <Select value={voice} onValueChange={setVoice}>
          <SelectTrigger>
            <SelectValue placeholder="Select a voice" />
          </SelectTrigger>
          <SelectContent>
            {voices.map((v) => (
              <SelectItem key={v.id} value={v.id}>
                {v.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="space-y-2">
          <Textarea
            placeholder="Enter your text here..."
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            className={`min-h-[200px] ${isOverLimit ? 'border-red-500' : isNearLimit ? 'border-yellow-500' : ''}`}
          />
          <div className="flex justify-end text-sm">
            <span className={`${isOverLimit ? 'text-red-500' : isNearLimit ? 'text-yellow-500' : 'text-muted-foreground'}`}>
              {charCount}/{CHAR_LIMIT}
            </span>
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isLoading || isOverLimit || text.length === 0}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Speech"
          )}
        </Button>

        {audioUrl && (
          <div className="mt-4">
            <audio controls className="w-full" src={audioUrl}>
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </div>
    </div>
  );
}