
"use client";

import { useState, useCallback } from "react";
import { useDropzone } from 'react-dropzone';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, UploadCloud, FileText, Image as ImageIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/use-translation";
import { useStudyPlan } from "@/context/study-plan-context";

async function callApi(endpoint: string, body: object) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`API call to ${endpoint} failed with status ${response.status}:`, errorBody);
    throw new Error(`Failed API call to ${endpoint}`);
  }
  return response.json();
}

export function ContentUpload() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation();
  const { setPlan } = useStudyPlan();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'text/*': ['.txt', '.md', '.json'],
      'image/*': ['.jpeg', '.jpg', '.png'],
    }
  });
  
  const processContent = async (content: string) => {
     try {
      // Simulate progress for summarization
      setProgress(30);
      const summaryResult = await callApi('/api/summarize-content', { content });
      setProgress(60);

      // Generate study plan
      const planResult = await callApi('/api/generate-study-plan', {
        courseMaterial: summaryResult.summary,
        quizResults: "No quiz results yet. Generate a beginner-friendly plan.",
      });
      
      setProgress(100);

      try {
        const parsedPlan = JSON.parse(planResult.studyPlan);
        setPlan(parsedPlan);
      } catch(e) {
          const formattedPlan = [{ id: 1, topic: "Generated Plan", summary: planResult.studyPlan, status: 'not-started' }];
          setPlan(formattedPlan);
      }
      
      setIsProcessing(false);
      setIsComplete(true);
      toast({
        title: t('contentUpload').analysisComplete,
        description: t('contentUpload').analysisCompleteDescription,
      });

    } catch (error) {
      console.error("Analysis failed:", error);
      toast({
        title: "Analysis Failed",
        description: "Could not analyze the provided content.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  }

  const handleFileAnalyze = () => {
    if (!file) {
      toast({
        title: "No file provided",
        description: "Please select a file to analyze.",
        variant: "destructive",
      });
      return;
    }
    
    setIsComplete(false);
    setProgress(0);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
        if (event.target && typeof event.target.result === 'string') {
            if (file.type.startsWith('image/')) {
                // It's an image, use OCR flow
                try {
                    const ocrResult = await callApi('/api/extract-text-from-image', { imageDataUri: event.target.result });
                    await processContent(ocrResult.extractedText);
                } catch (error) {
                    console.error("OCR failed:", error);
                    toast({ title: "Error", description: "Could not extract text from image.", variant: "destructive"});
                    setIsProcessing(false);
                }
            } else {
                // It's a text file
                await processContent(event.target.result);
            }
        } else {
            toast({ title: "Error", description: "Could not read file.", variant: "destructive"});
            setIsProcessing(false);
        }
    };
    reader.onerror = () => {
        toast({ title: "Error", description: "Failed to read file.", variant: "destructive"});
        setIsProcessing(false);
    }

    if (file.type.startsWith('image/')) {
        reader.readAsDataURL(file); // Read image as Data URL
    } else {
        reader.readAsText(file); // Read text file as string
    }
  };
  
  const handleLinkAnalyze = async () => {
    if (!linkUrl.trim()) {
      toast({
        title: "No link provided",
        description: "Please paste a link to analyze.",
        variant: "destructive",
      });
      return;
    }
    setIsComplete(false);
    setProgress(0);
    setIsProcessing(true);
    await processContent(linkUrl);
  };

  const resetState = () => {
    setIsComplete(false);
    setProgress(0);
    setIsProcessing(false);
    setLinkUrl("");
    setFile(null);
  }

  const {
    title,
    description,
    uploadTab,
    linkTab,
    dragAndDrop,
    pasteLink,
    analyzing,
    analysisComplete,
    uploadMore,
    analyzeContent,
    analyzingButton,
  } = t('contentUpload');

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upload" onValueChange={resetState} className="flex flex-col h-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">
              <UploadCloud className="w-4 h-4 mr-2" />
              {uploadTab}
            </TabsTrigger>
            <TabsTrigger value="link">
              <Link className="w-4 h-4 mr-2" />
              {linkTab}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="upload" className="flex-grow">
            <div 
              {...getRootProps()} 
              className={`flex flex-col items-center justify-center p-6 mt-2 border-2 border-dashed rounded-lg cursor-pointer transition-colors h-full ${isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/20'}`}
            >
              <input {...getInputProps()} />
              {file ? (
                <div className="text-center text-muted-foreground">
                    {file.type.startsWith('image/') ? <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground/50"/> : <FileText className="w-12 h-12 mx-auto text-muted-foreground/50"/>}
                    <p className="mt-2 text-sm font-medium">{file.name}</p>
                </div>
              ) : (
                <>
                  <UploadCloud className="w-12 h-12 text-muted-foreground/50" />
                  <p className="mt-2 text-sm text-center text-muted-foreground">
                    {isDragActive ? 'Drop a file here...' : dragAndDrop}
                  </p>
                </>
              )}
            </div>
             <div className="w-full mt-4">
               <Button className="w-full" onClick={handleFileAnalyze} disabled={isProcessing || !file}>
                    {isProcessing ? analyzingButton : analyzeContent}
                </Button>
            </div>
          </TabsContent>
          <TabsContent value="link" className="flex-grow">
            <div className="flex flex-col justify-center p-6 mt-2 border-2 border-dashed rounded-lg border-muted-foreground/20 h-full">
              <p className="mb-4 text-sm text-center text-muted-foreground">
                {pasteLink}
              </p>
              <Input 
                placeholder="https://..." 
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                disabled={isProcessing}
              />
            </div>
              <div className='w-full mt-4'>
                <Button className="w-full" onClick={handleLinkAnalyze} disabled={isProcessing || !linkUrl}>
                    {isProcessing ? analyzingButton : analyzeContent}
                </Button>
            </div>
          </TabsContent>
           {(isProcessing || isComplete) && (
            <div className="mt-4 space-y-2">
              <Progress value={progress} />
              <p className="text-sm text-center text-muted-foreground">
                {isProcessing && `${analyzing} ${Math.round(progress)}%`}
                {isComplete && analysisComplete}
              </p>
            </div>
          )}
        </Tabs>
      </CardContent>
      <CardFooter>
        {isComplete && (
           <Button className="w-full" onClick={resetState}>
            {uploadMore}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
