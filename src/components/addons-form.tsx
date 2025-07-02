"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ChevronRight, KeyRound, DollarSign } from "lucide-react";

interface AddonsFormProps {
  onComplete: (choices: { auth: boolean; monetization: boolean }) => void;
}

export function AddonsForm({ onComplete }: AddonsFormProps) {
  const [includeAuth, setIncludeAuth] = useState(false);
  const [includeMonetization, setIncludeMonetization] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({ auth: includeAuth, monetization: includeMonetization });
  };

  return (
    <Card className="w-full animate-in fade-in-50">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Optional Add-ons</CardTitle>
        <CardDescription>
          Include common features like user accounts or monetization in your plan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
              <div className="flex items-center gap-4">
                <KeyRound className="w-6 h-6 text-primary" />
                <div className="space-y-0.5">
                  <Label htmlFor="auth-switch" className="text-base font-medium">
                    Add User Authentication
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Enable user sign-up, sign-in, and profile features.
                  </p>
                </div>
              </div>
              <Switch
                id="auth-switch"
                checked={includeAuth}
                onCheckedChange={setIncludeAuth}
              />
            </div>
            <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
               <div className="flex items-center gap-4">
                <DollarSign className="w-6 h-6 text-primary" />
                <div className="space-y-0.5">
                  <Label htmlFor="monetization-switch" className="text-base font-medium">
                    Add Monetization
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Include a strategy for revenue (e.g., subscriptions, ads).
                  </p>
                </div>
              </div>
              <Switch
                id="monetization-switch"
                checked={includeMonetization}
                onCheckedChange={setIncludeMonetization}
              />
            </div>
          </div>
          <Button type="submit" className="w-full text-lg py-6" size="lg">
            Continue
            <ChevronRight className="ml-2" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
