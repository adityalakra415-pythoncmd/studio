
"use client";

import { useState } from "react";
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
import { Link, UploadCloud } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/use-translation";
import { summarizeContent } from "@/ai/flows/ai-summarize-content";
import { generatePersonalizedStudyPlan } from "@/ai/ai-personalized-study-plan";
import { useStudyPlan } from "@/context/study-plan-context";

export function ContentUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const { toast } = useToast();
  const { t } = useTranslation();
  const { setPlan } = useStudyPlan();

  const handleAnalyze = async () => {
    if (!linkUrl.trim()) {
      toast({
        title: "No link provided",
        description: "Please paste a link to analyze.",
        variant: "destructive",
      });
      return;
    }
    setIsComplete(false);
    setUploadProgress(0);
    setIsUploading(true);

    try {
      // Simulate progress for summarization
      setUploadProgress(30);
      const summaryResult = await summarizeContent({ content: linkUrl });
      setUploadProgress(60);

      // Generate study plan
      const planResult = await generatePersonalizedStudyPlan({
        courseMaterial: summaryResult.summary,
        quizResults: "No quiz results yet. Generate a beginner-friendly plan.",
      });
      
      setUploadProgress(100);

      // The output from the flow is a string, which might be JSON.
      try {
        const parsedPlan = JSON.parse(planResult.studyPlan);
        setPlan(parsedPlan);
      } catch(e) {
          // If it's not a JSON string, maybe it's just a text plan.
          // For now, let's wrap it in a format the study plan component can use.
          const formattedPlan = [{ id: 1, topic: "Generated Plan", summary: planResult.studyPlan, status: 'not-started' }];
          setPlan(formattedPlan);
      }
      
      setIsUploading(false);
      setIsComplete(true);
      toast({
        title: t('contentUpload').analysisComplete,
        description: t('contentUpload').analysisCompleteDescription,
      });

    } catch (error) {
      console.error("Analysis failed:", error);
      toast({
        title: "Analysis Failed",
        description: "Could not analyze the provided link.",
        variant: "destructive",
      });
      setIsUploading(false);
    }
  };

  const resetState = () => {
    setIsComplete(false);
    setUploadProgress(0);
    setIsUploading(false);
    setLinkUrl("");
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
        <Tabs defaultValue="link">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" disabled>
              <UploadCloud className="w-4 h-4 mr-2" />
              {uploadTab}
            </TabsTrigger>
            <TabsTrigger value="link">
              <Link className="w-4 h-4 mr-2" />
              {linkTab}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="upload">
            <div className="flex flex-col items-center justify-center p-6 mt-2 border-2 border-dashed rounded-lg border-muted-foreground/20">
              <UploadCloud className="w-12 h-12 text-muted-foreground/50" />
              <p className="mt-2 text-sm text-center text-muted-foreground">
                {dragAndDrop}
              </p>
              <Input type="file" className="sr-only" />
            </div>
          </TabsContent>
          <TabsContent value="link">
            <div className="flex flex-col p-6 mt-2 border-2 border-dashed rounded-lg border-muted-foreground/20">
              <p className="mb-4 text-sm text-center text-muted-foreground">
                {pasteLink}
              </p>
              <Input 
                placeholder="https://..." 
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                disabled={isUploading}
              />
            </div>
          </TabsContent>
        </Tabs>
        {(isUploading || isComplete) && (
          <div className="mt-4 space-y-2">
            <Progress value={uploadProgress} />
            <p className="text-sm text-center text-muted-foreground">
              {isUploading && `${analyzing} ${Math.round(uploadProgress)}%`}
              {isComplete && analysisComplete}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {isComplete ? (
           <Button className="w-full" onClick={resetState}>
            {uploadMore}
          </Button>
        ) : (
          <Button className="w-full" onClick={handleAnalyze} disabled={isUploading || (isComplete && !isUploading)}>
            {isUploading ? analyzingButton : analyzeContent}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
