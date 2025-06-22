"use client";

import { extractFeatures } from "@/ai/flows/extract-features";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Code, WandSparkles, FileCode } from "lucide-react";
import { useEffect, useState } from "react";

interface FeatureGenerationDisplayProps {
  setupPrompt: string;
}

interface Feature {
  title: string;
  description: string;
}

export function FeatureGenerationDisplay({ setupPrompt }: FeatureGenerationDisplayProps) {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  const handleGenerateCode = (featureTitle: string) => {
    toast({
      title: "Coming Soon!",
      description: `Code generation for "${featureTitle}" is not yet implemented.`,
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
        <CardTitle className="font-headline text-3xl text-center">Let's Generate Your Code</CardTitle>
        <CardDescription className="text-center">
          Here are the features from your plan. Generate the code for each one, step-by-step.
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
                <Button onClick={() => handleGenerateCode(feature.title)}>
                  <Code className="mr-2" />
                  Generate Code
                </Button>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
