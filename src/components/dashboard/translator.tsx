"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Languages } from "lucide-react";
import { translateText } from "@/ai/flows/ai-translate-text";
import { useToast } from "@/hooks/use-toast";

const targetLanguages = [
  { value: "hindi", label: "Hindi" },
  { value: "odia", label: "Odia" },
  { value: "english uk", label: "English (UK)" },
  { value: "bengali", label: "Bengali" },
  { value: "tamil", label: "Tamil" },
  { value: "sanskrit", label: "Sanskrit" },
  { value: "japanese", label: "Japanese" },
];

export function Translator() {
  const [text, setText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const { toast } = useToast();

  const handleTranslate = async () => {
    if (!text || !targetLanguage) {
      toast({
        title: "Missing information",
        description: "Please enter text and select a target language.",
        variant: "destructive",
      });
      return;
    }
    setIsTranslating(true);
    setTranslatedText("");
    try {
      const result = await translateText({ text, targetLanguage });
      setTranslatedText(result.translatedText);
    } catch (error) {
      console.error("Translation failed:", error);
      toast({
        title: "Translation failed",
        description: "An error occurred while translating the text.",
        variant: "destructive",
      });
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Languages className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Translate Text</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Text Translator</DialogTitle>
          <DialogDescription>
            Translate text to a different language.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="Enter text to translate"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="col-span-3"
          />
          <Select onValueChange={setTargetLanguage} value={targetLanguage}>
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              {targetLanguages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {translatedText && (
            <div className="p-4 border rounded-md bg-muted">
              <p className="text-sm text-muted-foreground">Translated Text:</p>
              <p>{translatedText}</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleTranslate} disabled={isTranslating}>
            {isTranslating ? "Translating..." : "Translate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
