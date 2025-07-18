import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Stethoscope, Info } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { api } from "@/utils/api";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

const formSchema = z.object({
  symptoms: z.string().min(1, "Please enter at least one symptom."),
});

const commonDiseases = [
  "Diabetes",
  "Hypertension",
  "Malaria",
  "Dengue",
  "Tuberculosis",
  "Asthma",
  "COVID-19",
  "Typhoid",
  "Anemia",
  "Pneumonia",
];

const Prediction = () => {
  const [result, setResult] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptoms: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      const response = await api.post("/disease/predict", {
        symptoms: values.symptoms.split(",").map((s) => s.trim().toLowerCase()),
      });

      setResult(response.data.data.prediction || "Disease not found");
    } catch (error) {
      toast.error(`❌ Error: ${error.response?.data?.error || error.message}`);
      setResult(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 gap-6">
      <Card className="w-full max-w-xl shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Stethoscope className="text-blue-500 dark:text-blue-400" />
            <CardTitle className="text-2xl font-bold">
              Disease Predictor
            </CardTitle>
          </div>
          <p className="text-sm text-muted-foreground pt-1">
            Enter symptoms (comma separated) to predict possible diseases.
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="symptoms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Symptoms</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., fever, cough, headache"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full font-semibold"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />{" "}
                    Predicting...
                  </>
                ) : (
                  "Predict"
                )}
              </Button>
            </form>
          </Form>
          {result && (
            <div className="mt-6 p-4 bg-blue-100 dark:bg-blue-900/30 text-center rounded-md">
              <p className="text-lg font-semibold">🧠 Prediction Result:</p>
              <p className="text-xl text-blue-700 dark:text-blue-300 font-bold">
                {result}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="w-full max-w-xl shadow-md border dark:border-zinc-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Common Diseases
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-5 w-5 text-muted-foreground cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent className="text-sm max-w-xs">
                This is a list of frequently encountered diseases for your
                reference.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardHeader>
        <CardContent>
          <ul className="grid grid-cols-2 gap-y-2 text-sm text-muted-foreground">
            {commonDiseases.map((disease, index) => (
              <li key={index} className="pl-4 list-disc">
                {disease}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Prediction;
