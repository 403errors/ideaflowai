"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Copy, PartyPopper } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SummaryDisplayProps {
  ideaSummary: string;
  answers: Record<string, string>;
  techStack: string[];
}

function generateSummary(ideaSummary: string, answers: Record<string, string>, techStack: string[]): string {
    let summary = "## Application Development Plan\n\n";
    
    summary += "### Extracted Idea\n";
    summary += `${ideaSummary}\n\n`;
    
    summary += "### User Selections\n";
    summary += "Here are the choices made during the refinement process:\n\n";
    Object.entries(answers).forEach(([question, answer]) => {
        summary += `- **${question}**\n  - ${answer}\n`;
    });
    
    if (techStack.length > 0) {
        summary += "\n### Recommended Technology\n";
        summary += "Based on a web application type, the following tech stacks are recommended:\n";
        techStack.forEach(stack => {
            summary += `- ${stack}\n`;
        });
    }

    return summary;
}


export function SummaryDisplay({ ideaSummary, answers, techStack }: SummaryDisplayProps) {
    const [summary, setSummary] = useState('');
    const { toast } = useToast();

    useEffect(() => {
        const initialSummary = generateSummary(ideaSummary, answers, techStack);
        setSummary(initialSummary);
    }, [ideaSummary, answers, techStack]);

    const handleCopy = () => {
        navigator.clipboard.writeText(summary);
        toast({
            title: "Copied to clipboard!",
            description: "Your application plan is ready to be shared.",
        });
    };

    return (
        <Card className="w-full animate-in fade-in-50">
            <CardHeader>
                <div className="flex justify-center mb-4">
                    <PartyPopper className="w-16 h-16 text-primary" />
                </div>
                <CardTitle className="font-headline text-3xl text-center">Your Final App Plan</CardTitle>
                <CardDescription className="text-center">
                    Here is the complete summary of your application. You can edit it below or copy it to your clipboard.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <Label htmlFor="summary-editor" className="text-lg font-medium">Plan Summary (Editable)</Label>
                    <Textarea
                        id="summary-editor"
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        rows={20}
                        className="mt-2 font-mono text-sm bg-background/50"
                    />
                </div>
                <Button onClick={handleCopy} className="w-full text-lg py-6" size="lg">
                    <Copy className="mr-2" />
                    Copy Plan
                </Button>
            </CardContent>
        </Card>
    );
}
