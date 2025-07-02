
"use client";

import { extractIdea } from "@/ai/flows/extract-idea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Paperclip, Send } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent, useCallback } from "react";

interface IdeaFormProps {
  onIdeaExtracted: (summary: string, originalIdea: string) => void;
}

const fileToDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export function IdeaForm({ onIdeaExtracted }: IdeaFormProps) {
  const [ideaText, setIdeaText] = useState("");
  const [originalIdea, setOriginalIdea] = useState("");
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingReason, setLoadingReason] = useState("");
  const { toast } = useToast();

  const handleFileChange = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoadingReason("Extracting ideas from your file...");
      setIsLoading(true);
      try {
        const dataUrl = await fileToDataURL(file);
        const result = await extractIdea({ input: dataUrl });
        // The extracted text populates the textarea for review
        setIdeaText(result.markdownOutput);
        // It also becomes the "original idea". If the user edits it, `handleTextChange` will update it.
        setOriginalIdea(result.markdownOutput);
        setFileName(file.name);
        toast({
          title: "File Processed",
          description: "We've extracted the key ideas and populated them below for your review.",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error reading file",
          description: "Could not process the uploaded file.",
        });
        setFileName("");
        setOriginalIdea("");
      } finally {
        setIsLoading(false);
      }
    }
  }, [toast]);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (!ideaText.trim()) {
      toast({
        variant: "destructive",
        title: "Input required",
        description: "Please share your idea in text or by uploading a file.",
      });
      return;
    }

    setIsLoading(true);
    
    if (fileName) {
      // If a file was uploaded, the idea is already extracted. The potentially edited
      // text in `ideaText` is the summary, and the same text in `originalIdea` is saved.
      setLoadingReason("Finalizing your plan...");
      onIdeaExtracted(ideaText, originalIdea);
    } else {
      // If no file, ideaText contains raw text, so we need to extract.
      setLoadingReason("Extracting the core concepts from your idea...");
      try {
        const result = await extractIdea({ input: ideaText });
        // The user's raw typed text is the original idea.
        onIdeaExtracted(result.markdownOutput, ideaText);
      } catch (error)
      {
        console.error(error);
        toast({
          variant: "destructive",
          title: "AI Error",
          description: "Failed to process your idea. Please try again.",
        });
        setIsLoading(false);
      }
    }
  }, [ideaText, originalIdea, fileName, onIdeaExtracted, toast]);
  
  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setIdeaText(e.target.value);
    // When user types, they are creating a new original idea.
    // This will also apply to edits of the extracted text from a file.
    setOriginalIdea(e.target.value);
    if (fileName) setFileName("");
  }

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Let's build your app</CardTitle>
          <CardDescription>
            Start by describing your idea. You can write it down, or upload an image or PDF.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="flex flex-col items-center justify-center h-96">
              <Loader2 className="w-16 h-16 text-primary animate-spin" />
              <p className="mt-4 text-lg font-headline">AI is thinking...</p>
              <p className="mt-2 text-center text-muted-foreground">{loadingReason}</p>
           </div>
        </CardContent>
      </Card>
    );
  }


  return (
    <Card className="w-full animate-in fade-in-50">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Let's build your app</CardTitle>
        <CardDescription>
          Start by describing your idea. You can write it down, or upload an image or PDF. Once uploaded, we'll extract the contents for you to review.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="idea-text">Describe your idea (or review extracted text)</Label>
            <Textarea
              id="idea-text"
              placeholder="e.g., A mobile app that helps users find the best coffee shops nearby..."
              value={ideaText}
              onChange={handleTextChange}
              rows={12}
            />
          </div>
          <div className="flex items-center justify-center text-sm text-muted-foreground">
            <span className="flex-grow border-t"></span>
            <span className="mx-4">OR</span>
            <span className="flex-grow border-t"></span>
          </div>
          <div className="space-y-2">
            <Label htmlFor="idea-file">Upload a file (image or PDF)</Label>
            <div className="relative">
              <Input
                id="idea-file"
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="hidden"
                key={fileName || 'file-input'}
              />
              <Button asChild variant="outline" type="button" className="w-full">
                <Label htmlFor="idea-file" className="cursor-pointer flex items-center justify-center gap-2">
                  <Paperclip />
                  {fileName || "Choose file"}
                </Label>
              </Button>
            </div>
          </div>
          <Button type="submit" className="w-full text-lg py-6" size="lg">
            {fileName ? 'Continue With This Plan' : 'Generate Plan'}
            <Send className="ml-2" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
