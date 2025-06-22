"use client";

import { extractIdea } from "@/ai/flows/extract-idea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Paperclip, Send } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";

interface IdeaFormProps {
  onIdeaExtracted: (summary: string) => void;
  setLoading: (loading: boolean) => void;
}

const fileToDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export function IdeaForm({ onIdeaExtracted, setLoading }: IdeaFormProps) {
  const [ideaText, setIdeaText] = useState("");
  const [fileName, setFileName] = useState("");
  const [ideaInput, setIdeaInput] = useState("");
  const { toast } = useToast();

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setLoading(true);
        const dataUrl = await fileToDataURL(file);
        setIdeaInput(dataUrl);
        setIdeaText(`File uploaded: ${file.name}`);
        setFileName(file.name);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error reading file",
          description: "Could not process the uploaded file.",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const finalInput = ideaInput || ideaText;
    if (!finalInput.trim()) {
      toast({
        variant: "destructive",
        title: "Input required",
        description: "Please share your idea in text or by uploading a file.",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await extractIdea({ input: finalInput });
      onIdeaExtracted(result.markdownOutput);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Failed to process your idea. Please try again.",
      });
      setLoading(false);
    }
  };

  return (
    <Card className="w-full animate-in fade-in-50">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Let's build your app</CardTitle>
        <CardDescription>
          Start by describing your idea. You can write it down, or upload an image or PDF.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="idea-text">Describe your idea</Label>
            <Textarea
              id="idea-text"
              placeholder="e.g., A mobile app that helps users find the best coffee shops nearby..."
              value={ideaText}
              onChange={(e) => {
                setIdeaText(e.target.value);
                setIdeaInput("");
                setFileName("");
              }}
              rows={8}
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
            Generate Plan
            <Send className="ml-2" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
