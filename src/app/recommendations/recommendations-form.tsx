"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { runFlow } from "@genkit-ai/next/client";

// Define the form schema for recommendations
const recommendationsFormSchema = z.object({
  rentalPreferences: z
    .string()
    .min(10, {
      message: "Please describe your preferences in at least 10 characters.",
    })
    .max(500),
  budget: z.coerce.number().min(1),
  apartmentSize: z.string({
    required_error: "Please select an apartment size.",
  }),
  photoDataUri: z.string().optional(),
});

// Infer the type from the schema
type RecommendationsFormValues = z.infer<typeof recommendationsFormSchema>;

export function RecommendationsForm() {
  const { toast } = useToast();
  const [output, setOutput] = useState<any>(null);
  const [running, setRunning] = useState(false);

  // Function to handle flow execution
  const getRecommendations = async (input: any) => {
    setRunning(true);
    try {
      const result = await runFlow({
        url: "/api/generateFurnitureRecommendations",
        input,
      });
      setOutput(result);
      return result;
    } catch (error) {
      console.error("Error getting recommendations:", error);
      toast({
        title: "Error",
        description: "Failed to generate recommendations. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setRunning(false);
    }
  };

  const form = useForm<RecommendationsFormValues>({
    resolver: zodResolver(recommendationsFormSchema),
    defaultValues: {
      rentalPreferences: "",
      budget: 500,
    },
    mode: "onChange",
  });

  async function onSubmit(data: RecommendationsFormValues) {
    try {
      await getRecommendations(data);
    } catch (error) {
      console.error(error);
      toast({
        title: "An error occurred",
        description: "Failed to generate recommendations. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">
      <Card>
        <CardHeader>
          <CardTitle>Tell us what you need</CardTitle>
          <CardDescription>
            Fill out the details below to get personalized furniture
            recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="rentalPreferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Style Preferences</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., modern style, neutral colors, wood materials..."
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Describe your desired style, colors, materials, etc.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Budget ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g., 500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="apartmentSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apartment Size</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select apartment size" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="small">
                            Small (Studio / 1-bed)
                          </SelectItem>
                          <SelectItem value="medium">Medium (2-bed)</SelectItem>
                          <SelectItem value="large">Large (3-bed+)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={running}>
                {running && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Get Recommendations
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className="flex flex-col lg:sticky lg:top-20">
        <CardHeader>
          <CardTitle>AI Recommendations</CardTitle>
          <CardDescription>
            Our AI's suggestions based on your input.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          {running ? (
            <div className="flex h-full min-h-[20rem] items-center justify-center rounded-lg border border-dashed">
              <div className="text-center text-muted-foreground">
                <Loader2 className="mx-auto mb-2 h-8 w-8 animate-spin text-primary" />
                <p>Our AI is curating furniture just for you...</p>
              </div>
            </div>
          ) : output ? (
            <div
              className="prose prose-sm prose-p:text-foreground prose-headings:font-headline prose-headings:text-foreground max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{
                __html: output.furnitureRecommendations.replace(
                  /\n/g,
                  "<br />"
                ),
              }}
            />
          ) : (
            <div className="flex h-full min-h-[20rem] items-center justify-center rounded-lg border border-dashed">
              <p className="text-center text-muted-foreground">
                Your personalized furniture recommendations will appear here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
