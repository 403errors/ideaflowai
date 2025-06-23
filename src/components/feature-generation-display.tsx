"use client";

import { extractFeatures } from "@/ai/flows/extract-features";
import { generateFeaturePrompt } from "@/ai/flows/generate-feature-prompt";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { WandSparkles, FileCode, Loader2, Copy, Bot } from "lucide-react";
import { useEffect, useState } from "react";
import { Textarea } from "./ui/textarea";

interface FeatureGenerationDisplayProps {
  setupPrompt: string;
  fileStructure: string;
}

interface Feature {
  title: string;
  description: string;
}

export function FeatureGenerationDisplay({ setupPrompt, fileStructure }: FeatureGenerationDisplayProps) {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [generatedPrompts, setGeneratedPrompts] = useState<Record<string, string>>({});
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getFeatures = async () => {
      if (!setupPrompt) return;
      setIsLoading(true);
      try {
        const result = await extractFeatures({ setupPrompt });
        setFeatures(result.features);
      } catch (error) {
        console.error("Error extracting features:", error);
        toast({
          variant: "destructive",
          title: "AI Error",
          description: "Could not extract features from the setup prompt.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    getFeatures();
  }, [setupPrompt, toast]);

  const handleGeneratePrompt = async (feature: Feature) => {
    if (generatingFor) return;
    setGeneratingFor(feature.title);
    try {
      const result = await generateFeaturePrompt({
        setupPrompt,
        fileStructure,
        featureTitle: feature.title,
        featureDescription: feature.description,
      });
      setGeneratedPrompts(prev => ({ ...prev, [feature.title]: result.featurePrompt }));
      toast({
        title: "Prompt Generated!",
        description: `A detailed prompt for "${feature.title}" has been successfully generated.`,
      });
    } catch (error) {
      console.error(`Error generating prompt for "${feature.title}":`, error);
      toast({
        variant: "destructive",
        title: "AI Prompt Generation Error",
        description: `Could not generate prompt for "${feature.title}". Please try again.`,
      });
    } finally {
      setGeneratingFor(null);
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
        title: "Copied to clipboard!",
    });
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-8 w-1/2 mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full animate-in fade-in-50">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <WandSparkles className="w-16 h-16 text-primary" />
        </div>
        <CardTitle className="font-headline text-3xl text-center">Generate Your Prompts</CardTitle>
        <CardDescription className="text-center">
          Here are the features from your plan. Generate a detailed, sequential prompt for each one.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
          {features.map((feature, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                <div className="flex items-center gap-3">
                    <FileCode className="h-5 w-5 text-primary"/>
                    {feature.title}
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <p className="text-muted-foreground">{feature.description}</p>
                <Button onClick={() => handleGeneratePrompt(feature)} disabled={!!generatingFor}>
                    {generatingFor === feature.title ? (
                        <Loader2 className="mr-2 animate-spin" />
                    ) : (
                        <Bot className="mr-2" />
                    )}
                    {generatingFor === feature.title ? 'Generating...' : (generatingFor ? 'Waiting...' : 'Generate Prompt')}
                </Button>
                
                {generatedPrompts[feature.title] && (
                    <div className="space-y-4 mt-4 animate-in fade-in-50">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-lg">Generated Engineering Prompt:</h4>
                             <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCopy(generatedPrompts[feature.title])}
                            >
                                <Copy className="mr-2 h-4 w-4" /> Copy
                            </Button>
                        </div>
                        <Textarea
                            readOnly
                            value={generatedPrompts[feature.title]}
                            className="font-mono text-sm bg-background/50"
                            rows={15}
                        />
                    </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
