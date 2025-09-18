"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { useUser } from "@/app/context/user-context";
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
import { Card, CardContent } from "@/components/ui/card";
import api from "@/api";

const apartmentSizes = ["small", "medium", "large"] as const;

const profileFormSchema = z.object({
  preferences: z
    .string()
    .min(10, {
      message: "Please describe your preferences in at least 10 characters.",
    })
    .max(500, { message: "Preferences cannot be longer than 500 characters." }),
  monthly_budget: z.coerce
    .number()
    .min(1, { message: "Budget must be a positive number." }),
  apartment_size: z.enum(apartmentSizes, {
    required_error: "Please select an apartment size.",
  }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
  const { toast } = useToast();
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onChange",
  });

  async function onSubmit(data: ProfileFormValues) {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to update preferences",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/profile/preferences", data);

      toast({
        title: "Success",
        description: "Your preferences have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update preferences",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="preferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rental Preferences</FormLabel>
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
                name="monthly_budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Budget ($)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 500" {...field} />
                    </FormControl>
                    <FormDescription>
                      Your estimated monthly budget for furniture rental.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="apartment_size"
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
                    <FormDescription>
                      This helps in recommending appropriately sized furniture.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Preferences"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
