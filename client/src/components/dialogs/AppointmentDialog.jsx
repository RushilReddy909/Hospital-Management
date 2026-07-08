// components/AppointmentDialog.jsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, Loader2 } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api";

const AppointmentDialog = ({
  open,
  setOpen,
  form,
  selectedDoctor,
  appointment,
  mode = "create",
}) => {
  const isEdit = mode === "edit";
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: (values) =>
      isEdit
        ? api.put(`/appointment/${appointment._id}`, values)
        : api.post("/appointment", values),
    onSuccess: () => {
      toast.success(
        isEdit
          ? "Appointment rescheduled successfully"
          : "Appointment scheduled successfully"
      );
      // Refresh any appointment lists currently cached
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey.some(
            (key) =>
              typeof key === "string" && key.toLowerCase().includes("appointment")
          ),
      });
      setOpen(false);
    },
    onError: (err) => {
      toast.error("Appointment could not be scheduled");
      console.error(err);
    },
  });

  const handleSubmit = (values) => saveMutation.mutate(values);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Reschedule Appointment" : "Confirm Appointment"}
          </DialogTitle>
          <DialogDescription>
            {selectedDoctor
              ? `Edit details for appointment with Dr. ${selectedDoctor.name}`
              : ""}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="doctorID"
              render={({ field }) => <input type="hidden" {...field} />}
            />
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-3 w-1/2">
                    <FormLabel>Date of Appointment</FormLabel>
                    <Popover modal>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="w-full justify-between font-normal"
                          >
                            {field.value
                              ? field.value.toLocaleDateString()
                              : "Select date"}
                            <ChevronDownIcon />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          captionLayout="dropdown"
                          onSelect={(date) => field.onChange(date)}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="timeSlot"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-3 w-1/2">
                    <FormLabel>Time Slot</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a time slot" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Morning">Morning</SelectItem>
                          <SelectItem value="Afternoon">Afternoon</SelectItem>
                          <SelectItem value="Evening">Evening</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Explain your symptoms or reason..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="w-full flex justify-end">
              <Button
                type="submit"
                className="font-semibold"
                disabled={saveMutation.isPending}
              >
                {saveMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {isEdit ? "Updating..." : "Confirming..."}
                  </>
                ) : isEdit ? (
                  "Update"
                ) : (
                  "Confirm"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDialog;
