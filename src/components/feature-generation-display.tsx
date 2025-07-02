"use client";

import { generateFeaturePrompt } from "@/ai/flows/generate-feature-prompt";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { WandSparkles, FileCode, Loader2, Copy, Bot } from "lucide-react";
import { useState } from "react";
import { Textarea } from "./ui/textarea";
import type { Feature } from "@/types";

interface FeatureGenerationDisplayProps {
  setupPrompt: string;
  fileStructure: string;
  features: Feature[];
}

export function FeatureGenerationDisplay({ setupPrompt, fileStructure, features }: FeatureGenerationDisplayProps) {
  const [generatedPrompts, setGeneratedPrompts] = useState<Record<string, string>>({});
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);
  const { toast } = useToast();

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

  return (
    <Card className="w-full animate-in fade-in-50">
      <CardHeader>
        <CardTitle className="font-headline text-xl text-center">Generate Your Prompts</CardTitle>
        <CardDescription className="text-center">
          Here are the features from your plan. Generate a detailed, sequential prompt for each one.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Accordion type="single" collapsible className="w-full" defaultValue={features.length > 0 ? "item-0" : undefined}>
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
         {features.length === 0 && (
            <div className="text-center text-muted-foreground py-10">
                <p>No features were extracted from your plan.</p>
                <p className="text-sm">You can edit your Setup Prompt and re-initialize features.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
