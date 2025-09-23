"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as React from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { getInitialAssessment } from "@/lib/actions";
import type { InitialMentalStateAssessmentOutput } from "@/ai/flows/initial-mental-state-assessment";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  age: z.coerce.number().min(1, { message: "Please enter a valid age." }),
  location: z.string().min(2, { message: "Please enter your location." }),
});

const ASSESSMENT_KEY = "mindful-chat-assessment-complete";

export default function InitialAssessment() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [assessmentResult, setAssessmentResult] = React.useState<InitialMentalStateAssessmentOutput | null>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    try {
      const hasCompleted = localStorage.getItem(ASSESSMENT_KEY);
      if (!hasCompleted) {
        setIsOpen(true);
      }
    } catch (error) {
      console.warn("Could not access localStorage. Assessment will show.");
      setIsOpen(true);
    }
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: undefined,
      location: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const result = await getInitialAssessment(values);
      setAssessmentResult(result);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: "We couldn't get your assessment. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleCloseDialog = () => {
    try {
      localStorage.setItem(ASSESSMENT_KEY, "true");
    } catch (error) {
      console.warn("Could not set localStorage item.");
    }
    setAssessmentResult(null);
    setIsOpen(false);
  };

  if (assessmentResult) {
    return (
      <AlertDialog open onOpenChange={handleCloseDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Thank you, {form.getValues("name")}</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-4 text-left">
                <p>{assessmentResult.mentalStateSummary}</p>
                <p>
                  <strong>Recommendations:</strong> {assessmentResult.recommendations}
                </p>
                {assessmentResult.needsQuestionnaire && (
                  <p className="font-semibold text-foreground">
                    Based on your answers, we recommend a more detailed questionnaire when you are ready.
                  </p>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleCloseDialog}>
              Start Chatting
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Welcome to Mindful Chat</DialogTitle>
          <DialogDescription>
            Let's start with a few questions to understand how we can best support you.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What's your name?</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>How old are you?</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Your age" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Where are you located?</FormLabel>
                  <FormControl>
                    <Input placeholder="City, State" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Get Started
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
