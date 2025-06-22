"use client";

import { generateAdaptiveMCQ } from "@/ai/flows/generate-mcq";
import type { GenerateAdaptiveMCQInput, GenerateAdaptiveMCQOutput } from "@/ai/flows/generate-mcq";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Check, ChevronRight } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";

interface McqFormProps {
  category: "UI/UX" | "Features" | "Flow & Extras";
  ideaSummary: string;
  previousAnswers: Record<string, any>;
  onComplete: (answers: Record<string, string>) => void;
}

type Question = GenerateAdaptiveMCQOutput["questions"][0];

export function McqForm({ category, ideaSummary, previousAnswers, onComplete }: McqFormProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isFetching, setIsFetching] = useState(true);
  const { toast } = useToast();
  
  const titleMap = {
    "UI/UX": "Look & Feel",
    "Features": "Core Features",
    "Flow & Extras": "App Flow & Extras"
  };

  const descriptionMap = {
    "UI/UX": "Let's decide on the visual style and user experience.",
    "Features": "Now, let's nail down the key functionalities.",
    "Flow & Extras": "Finally, let's think about how users will interact with your app and any extras."
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsFetching(true);
      try {
        const input: GenerateAdaptiveMCQInput = {
          ideaSummary,
          category,
          previousAnswers,
        };
        const result = await generateAdaptiveMCQ(input);
        if (result.questions.length === 0) {
          onComplete({});
        } else {
          setQuestions(result.questions);
          const initialAnswers = result.questions.reduce((acc, q) => {
            acc[q.question] = q.recommendedOption;
            return acc;
          }, {} as Record<string, string>);
          setAnswers(initialAnswers);
        }
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "AI Error",
          description: "Failed to generate questions. Please try again.",
        });
        onComplete({}); // prevent getting stuck
      } finally {
        setIsFetching(false);
      }
    };
    fetchQuestions();
  }, [category, ideaSummary, previousAnswers, onComplete, toast]);

  const handleAnswerChange = (question: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [question]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (Object.keys(answers).length < questions.length) {
      toast({
        variant: "destructive",
        title: "Please answer all questions",
        description: "Your answers help us build a better plan.",
      });
      return;
    }
    onComplete(answers);
  };
  
  if (isFetching) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-8">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full animate-in fade-in-50">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">{titleMap[category]}</CardTitle>
        <CardDescription>{descriptionMap[category]}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {questions.map((q, index) => (
            <div key={index} className="space-y-4">
              <Label className="text-lg font-medium">{q.question}</Label>
              <RadioGroup
                value={answers[q.question]}
                onValueChange={(value) => handleAnswerChange(q.question, value)}
                className="space-y-2"
              >
                {q.options.map((option, i) => (
                  <div key={i} className={cn(
                    "flex items-center space-x-3 p-4 rounded-md border transition-all cursor-pointer",
                    answers[q.question] === option ? "border-primary bg-primary/10" : "border-border hover:bg-muted/50"
                  )}>
                    <RadioGroupItem value={option} id={`${index}-${i}`} />
                    <Label htmlFor={`${index}-${i}`} className="flex-1 text-base font-normal cursor-pointer">
                      {option}
                    </Label>
                    {option === q.recommendedOption && (
                      <Badge variant="secondary" className="bg-primary/20 text-primary hover:bg-primary/30">
                        <Check className="w-3 h-3 mr-1.5" />
                        AI Pick
                      </Badge>
                    )}
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
          <Button type="submit" className="w-full text-lg py-6" size="lg">
            Continue
            <ChevronRight className="ml-2" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
