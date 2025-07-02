"use client";

import { useCallback, useMemo, useState } from "react";
import { AppHeader } from "@/components/app-header";
import { IdeaForm } from "@/components/idea-form";
import { McqForm } from "@/components/mcq-form";
import { SummaryDisplay } from "@/components/summary-display";
import { TechStackForm } from "@/components/tech-stack-form";
import { Progress } from "@/components/ui/progress";
import { ProjectSetupDisplay } from "@/components/project-setup-display";
import { useRouter } from "next/navigation";
import { AddonsForm } from "@/components/addons-form";

type Step = "idea" | "ui_ux" | "features" | "flow_extras" | "addons" | "tech_stack" | "summary" | "setup";
type McqAnswers = Record<string, string>;
type AddonChoices = { auth: boolean; monetization: boolean };

const EMPTY_ANSWERS = {};

export default function CreatePage() {
  const [step, setStep] = useState<Step>("idea");
  
  const [originalIdea, setOriginalIdea] = useState("");
  const [ideaSummary, setIdeaSummary] = useState("");
  const [uiUxAnswers, setUiUxAnswers] = useState<McqAnswers>({});
  const [featureAnswers, setFeatureAnswers] = useState<McqAnswers>({});
  const [flowAnswers, setFlowAnswers] = useState<McqAnswers>({});
  const [addons, setAddons] = useState<AddonChoices>({ auth: false, monetization: false });
  const [techStack, setTechStack] = useState<string[]>([]);
  const [finalSummary, setFinalSummary] = useState("");
  
  const router = useRouter();

  const steps: Step[] = ["idea", "ui_ux", "features", "flow_extras", "addons", "tech_stack", "summary", "setup"];
  const currentStepIndex = steps.indexOf(step);
  const totalProgressSteps = steps.length -1; // Don't count "setup" as a progress step
  const progressValue = ((currentStepIndex) / totalProgressSteps) * 100;

  const handleIdeaExtracted = useCallback((summary: string, original: string) => {
    setIdeaSummary(summary);
    setOriginalIdea(original);
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
    setStep("addons");
  }, []);

  const handleAddonsComplete = useCallback((choices: AddonChoices) => {
    setAddons(choices);
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
      case "addons":
        return <AddonsForm onComplete={handleAddonsComplete} />;
      case "tech_stack":
        return <TechStackForm onComplete={handleTechStackComplete} />;
      case "summary":
        return (
          <SummaryDisplay
            ideaSummary={ideaSummary}
            answers={{ ...uiUxAnswers, ...featureAnswers, ...flowAnswers }}
            techStack={techStack}
            addons={addons}
            onComplete={handleSummaryComplete}
          />
        );
      case "setup":
        return <ProjectSetupDisplay finalSummary={finalSummary} originalIdea={originalIdea} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          {step !== "setup" && (
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
