"use client";

import { useCallback, useMemo, useState } from "react";
import { AppHeader } from "@/components/app-header";
import { IdeaForm } from "@/components/idea-form";
import { McqForm } from "@/components/mcq-form";
import { SummaryDisplay } from "@/components/summary-display";
import { TechStackForm } from "@/components/tech-stack-form";
import { Progress } from "@/components/ui/progress";
import { ProjectSetupDisplay } from "@/components/project-setup-display";

type Step = "idea" | "ui_ux" | "features" | "flow_extras" | "tech_stack" | "summary" | "setup";
type McqAnswers = Record<string, string>;

const EMPTY_ANSWERS = {};

export default function Home() {
  const [step, setStep] = useState<Step>("idea");
  
  const [ideaSummary, setIdeaSummary] = useState("");
  const [uiUxAnswers, setUiUxAnswers] = useState<McqAnswers>({});
  const [featureAnswers, setFeatureAnswers] = useState<McqAnswers>({});
  const [flowAnswers, setFlowAnswers] = useState<McqAnswers>({});
  const [techStack, setTechStack] = useState<string[]>([]);
  const [finalSummary, setFinalSummary] = useState("");

  const steps: Step[] = ["idea", "ui_ux", "features", "flow_extras", "tech_stack", "summary", "setup"];
  const currentStepIndex = steps.indexOf(step);
  const totalProgressSteps = steps.indexOf("summary");
  const progressValue = (currentStepIndex / totalProgressSteps) * 100;

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

  const handleSummaryComplete = useCallback((summary: string) => {
    setFinalSummary(summary);
    setStep("setup");
  }, []);

  const flowExtrasPreviousAnswers = useMemo(() => ({ ...uiUxAnswers, ...featureAnswers }), [uiUxAnswers, featureAnswers]);

  const renderStep = () => {
    switch (step) {
      case "idea":
        return <IdeaForm onIdeaExtracted={handleIdeaExtracted} />;
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
            onComplete={handleSummaryComplete}
          />
        );
      case "setup":
        return <ProjectSetupDisplay finalSummary={finalSummary} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          {currentStepIndex < totalProgressSteps && (
            <div className="mb-8">
              <Progress value={progressValue} className="w-full" />
              <p className="text-center text-sm text-muted-foreground mt-2">Step {currentStepIndex + 1} of {totalProgressSteps}</p>
            </div>
          )}
          {renderStep()}
        </div>
      </main>
    </div>
  );
}
