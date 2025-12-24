"use client";

import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { Sparkles, Copy, Check, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type UIState = "initial" | "loading" | "success";

const MAX_CHARS = 500;

const EXAMPLE_PROMPTS = [
  "Portfolio for a photographer",
  "SaaS landing page with pricing",
  "Restaurant website with menu",
  "Personal blog with newsletter",
  "E-commerce store for clothing",
];

export function HeroSection() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [uiState, setUiState] = useState<UIState>("initial");
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const charCount = input.length;
  const isOverLimit = charCount > MAX_CHARS;
  const canSubmit =
    input.trim().length > 10 && !isOverLimit && uiState !== "loading";

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;

    setUiState("loading");

    try {
      const response = await fetch("/api/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to refine your idea");
      }

      const data = await response.json();
      setResult(data);
      setUiState("success");
    } catch (error) {
      setUiState("initial");
      toast.error("Something went wrong", {
        description:
          error instanceof Error
            ? error.message
            : "Please try again in a moment",
      });
    }
  }, [canSubmit, input]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      toast.success("Copied to clipboard", {
        description: "Your refined prompt is ready to paste",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy", {
        description: "Please try selecting and copying manually",
      });
    }
  }, [result]);

  const handleReset = useCallback(() => {
    setInput("");
    setResult("");
    setUiState("initial");
  }, []);

  const handleExampleClick = useCallback((example: string) => {
    setInput(example);
    textareaRef.current?.focus();
  }, []);

  // Keyboard shortcut: Cmd+Enter or Ctrl+Enter to submit
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <section className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-background to-accent/10" />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />

        {/* Floating orbs */}
        <div className="absolute top-20 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 -right-32 w-80 h-80 bg-primary/15 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
        <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />

        {/* Radial fade at bottom */}
        <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Header area with title */}
      <div className="pt-16 pb-8 px-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          <span>Prompt Engineering Made Simple</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Turn rough ideas into{" "}
          <span className="gradient-text">build-ready</span> prompts
        </h1>

        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Transform vague website concepts into clear, structured prompts that
          AI coding assistants actually understand.
        </p>
      </div>

      {/* Main content area */}
      <div className="flex-1 px-4 pb-16">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Input section */}
          {uiState !== "success" && (
            <div className="space-y-4">
              <div className="relative">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe your website idea... e.g., I need a landing page for a productivity app with a hero section, feature cards, pricing table, and contact form."
                  className={cn(
                    "min-h-[180px] resize-none text-base",
                    "placeholder:text-muted-foreground/50",
                    "focus:ring-2 focus:ring-primary/20 focus:border-primary",
                    isOverLimit &&
                      "border-destructive focus:border-destructive focus:ring-destructive/20"
                  )}
                  disabled={uiState === "loading"}
                  aria-label="Your website idea"
                />
                <div
                  className={cn(
                    "absolute bottom-3 right-3 text-xs font-medium tabular-nums",
                    isOverLimit
                      ? "text-destructive"
                      : "text-muted-foreground/50"
                  )}
                >
                  {charCount}/{MAX_CHARS}
                </div>
              </div>

              {/* Example prompts */}
              {uiState === "initial" && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs text-muted-foreground/70 py-1">
                    Try:
                  </span>
                  {EXAMPLE_PROMPTS.map((example) => (
                    <button
                      key={example}
                      onClick={() => handleExampleClick(example)}
                      className={cn(
                        "px-3 py-1 text-xs rounded-full",
                        "bg-secondary/50 hover:bg-secondary",
                        "text-muted-foreground hover:text-foreground",
                        "border border-border/50 hover:border-border",
                        "transition-all duration-200",
                        "hover:scale-105 active:scale-95"
                      )}
                    >
                      {example}
                    </button>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  size="lg"
                  className="w-full h-12 text-base font-semibold"
                >
                  {uiState === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Refining your prompt...
                    </>
                  ) : (
                    <>
                      Refine my idea
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>

              {uiState === "loading" && (
                <div className="space-y-3 pt-4">
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              )}
            </div>
          )}

          {/* Result section */}
          {uiState === "success" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-muted-foreground">
                  Your refined prompt
                </h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Start over
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className={cn(
                      "gap-2",
                      copied &&
                        "bg-green-50 border-green-200 text-green-700 hover:bg-green-50 hover:text-green-700"
                    )}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="relative rounded-lg border bg-muted/30 overflow-hidden">
                <div className="max-h-[450px] overflow-y-auto custom-scrollbar p-4">
                  <pre className="font-mono text-sm whitespace-pre-wrap leading-relaxed">
                    {result}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-4 text-sm text-muted-foreground/70">
            <span>✓ No signup</span>
            <span>✓ Instant results</span>
            <span>✓ Copy-paste ready</span>
          </div>
        </div>
      </div>
    </section>
  );
}
