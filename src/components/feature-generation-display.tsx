"use client";

import { extractFeatures } from "@/ai/flows/extract-features";
import { generateCode, type GenerateCodeOutput } from "@/ai/flows/generate-code";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Code, WandSparkles, FileCode, Loader2, Copy } from "lucide-react";
import { useEffect, useState } from "react";

interface FeatureGenerationDisplayProps {
  setupPrompt: string;
}

interface Feature {
  title: string;
  description: string;
}

type GeneratedFile = GenerateCodeOutput['files'][0];

export function FeatureGenerationDisplay({ setupPrompt }: FeatureGenerationDisplayProps) {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [generatedCode, setGeneratedCode] = useState<Record<string, GeneratedFile[]>>({});
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

  const handleGenerateCode = async (feature: Feature) => {
    if (generatingFor) return;
    setGeneratingFor(feature.title);
    try {
      const result = await generateCode({ 
        setupPrompt, 
        featureTitle: feature.title,
        featureDescription: feature.description,
      });
      setGeneratedCode(prev => ({ ...prev, [feature.title]: result.files }));
      toast({
        title: "Code Generated!",
        description: `Code for "${feature.title}" has been successfully generated.`,
      });
    } catch (error) {
      console.error(`Error generating code for "${feature.title}":`, error);
      toast({
        variant: "destructive",
        title: "AI Code Generation Error",
        description: `Could not generate code for "${feature.title}". Please try again.`,
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
                <Button onClick={() => handleGenerateCode(feature)} disabled={!!generatingFor}>
                    {generatingFor === feature.title ? (
                        <Loader2 className="mr-2 animate-spin" />
                    ) : (
                        <Code className="mr-2" />
                    )}
                    {generatingFor === feature.title ? 'Generating...' : (generatingFor ? 'Waiting...' : 'Generate Code')}
                </Button>
                
                {generatedCode[feature.title] && (
                    <div className="space-y-4 mt-4 animate-in fade-in-50">
                        <h4 className="font-semibold text-lg">Generated Files:</h4>
                        {generatedCode[feature.title].map((file, fileIndex) => (
                            <div key={fileIndex} className="bg-background/50 rounded-lg border">
                                <div className="flex items-center justify-between p-2 border-b bg-muted/50 rounded-t-lg">
                                    <p className="font-mono text-sm font-semibold text-muted-foreground">{file.filePath}</p>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleCopy(file.content)}
                                    >
                                        <Copy className="mr-2 h-4 w-4" /> Copy
                                    </Button>
                                </div>
                                <div className="max-h-[400px] overflow-auto bg-black rounded-b-lg">
                                    <pre className="p-4">
                                        <code className="font-mono text-sm text-white/90">{file.content}</code>
                                    </pre>
                                </div>
                            </div>
                        ))}
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
