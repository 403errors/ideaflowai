"use client";

import { useCallback, useMemo, useState } from "react";
import type { GenerateAdaptiveMCQOutput } from "@/ai/flows/generate-mcq";
import { AppHeader } from "@/components/app-header";
import { IdeaForm } from "@/components/idea-form";
import { McqForm } from "@/components/mcq-form";
import { SummaryDisplay } from "@/components/summary-display";
import { TechStackForm } from "@/components/tech-stack-form";
import { Progress } from "@/components/ui/progress";

type Step = "idea" | "ui_ux" | "features" | "flow_extras" | "tech_stack" | "summary";
type McqAnswers = Record<string, string>;

const EMPTY_ANSWERS = {};

export default function Home() {
  const [step, setStep] = useState<Step>("idea");
  const [loading, setLoading] = useState(false);
  const [loadingReason, setLoadingReason] = useState("AI is thinking...");
  
  const [ideaSummary, setIdeaSummary] = useState("");
  const [uiUxAnswers, setUiUxAnswers] = useState<McqAnswers>({});
  const [featureAnswers, setFeatureAnswers] = useState<McqAnswers>({});
  const [flowAnswers, setFlowAnswers] = useState<McqAnswers>({});
  const [techStack, setTechStack] = useState<string[]>([]);

  const steps: Step[] = ["idea", "ui_ux", "features", "flow_extras", "tech_stack", "summary"];
  const currentStepIndex = steps.indexOf(step);
  const progressValue = ((currentStepIndex + 1) / steps.length) * 100;

  const handleIdeaExtracted = useCallback((summary: string) => {
    setIdeaSummary(summary);
    setStep("ui_ux");
  }, []);

  const handleUiUxComplete = useCallback((answers: McqAnswers) => {
    setUiUxAnswers(answers);
    setStep("features");
  }, []);
  
  const handleFeaturesComplete = useCallback((answers: McqAnswers) => {
    setFeatureAnswers(answers);
    setStep("flow_extras");
  }, []);

  const handleFlowExtrasComplete = useCallback((answers: McqAnswers) => {
    setFlowAnswers(answers);
    setStep("tech_stack");
  }, []);
  
  const handleTechStackComplete = useCallback((stack: string[]) => {
    setTechStack(stack);
    setStep("summary");
  }, []);

  const flowExtrasPreviousAnswers = useMemo(() => ({ ...uiUxAnswers, ...featureAnswers }), [uiUxAnswers, featureAnswers]);

  const renderStep = () => {
    switch (step) {
      case "idea":
        return <IdeaForm onIdeaExtracted={handleIdeaExtracted} setLoading={setLoading} setLoadingReason={setLoadingReason} />;
      case "ui_ux":
        return (
          <McqForm
            category="UI/UX"
            ideaSummary={ideaSummary}
            previousAnswers={EMPTY_ANSWERS}
            onComplete={handleUiUxComplete}
          />
        );
      case "features":
         return (
          <McqForm
            category="Features"
            ideaSummary={ideaSummary}
            previousAnswers={uiUxAnswers}
            onComplete={handleFeaturesComplete}
          />
        );
      case "flow_extras":
        return (
          <McqForm
            category="Flow & Extras"
            ideaSummary={ideaSummary}
            previousAnswers={flowExtrasPreviousAnswers}
            onComplete={handleFlowExtrasComplete}
          />
        );
      case "tech_stack":
        return <TechStackForm onComplete={handleTechStackComplete} />;
      case "summary":
        return (
          <SummaryDisplay
            ideaSummary={ideaSummary}
            answers={{ ...uiUxAnswers, ...featureAnswers, ...flowAnswers }}
            techStack={techStack}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          {step !== "summary" && (
            <div className="mb-8">
              <Progress value={progressValue} className="w-full" />
              <p className="text-center text-sm text-muted-foreground mt-2">Step {currentStepIndex + 1} of {steps.length -1}</p>
            </div>
          )}
          {loading ? (
             <div className="flex flex-col items-center justify-center h-96">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-lg font-headline">AI is thinking...</p>
                <p className="mt-2 text-center text-muted-foreground">{loadingReason}</p>
             </div>
          ) : (
            renderStep()
          )}
        </div>
      </main>
    </div>
  );
}
