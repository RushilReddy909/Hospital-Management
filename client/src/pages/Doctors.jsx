import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Phone,
  User,
  Cake,
  Stethoscope,
  ChevronDownIcon,
} from "lucide-react";
import { api } from "@/utils/api";
import { toast } from "react-toastify";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  doctorID: z.string(),
  date: z.date().refine((d) => d >= new Date(new Date().setHours(0, 0, 0, 0)), {
    message: "Date cannot be in the past",
  }),
  reason: z.string().min(1, { message: "Reason cannot be empty" }),
  timeSlot: z.enum(["Morning", "Afternoon", "Evening"], {
    errorMap: () => ({ message: "Select a valid time slot" }),
  }),
});

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      doctorID: "",
      date: new Date(),
      reason: "",
      timeSlot: "Morning",
    },
  });

  const onSubmit = async (data) => {
    try {
      await api.post("/appointment", data);
      toast.success("Appointment scheduled successfully");
      setOpen(false);
    } catch (err) {
      toast.error("Appointment could not be scheduled");
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get("/doctor");
        setDoctors(res.data.data);
      } catch (err) {
        toast.error("Failed to fetch doctors");
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Meet Our Doctors</h2>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {doctors.map((doctor) => (
          <Card
            key={doctor._id}
            className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <CardContent className="flex justify-between items-center">
              <div className="flex flex-col space-y-1">
                <h3 className="text-xl font-bold">Dr. {doctor.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mb-3">
                  <Stethoscope size={16} /> {doctor.specialization}
                </p>
                <p className="text-sm flex items-center gap-1 my-1">
                  <Cake size={16} /> Age: {doctor.age}
                </p>
                <p className="text-sm flex items-center gap-1 my-1">
                  <User size={16} /> Gender: {doctor.gender}
                </p>
                <p className="text-sm flex items-center gap-1 my-1">
                  <Phone size={16} /> {doctor.phone}
                </p>
                <Badge
                  variant={
                    doctor.status === "Active" ? "default" : "destructive"
                  }
                  className="mt-2 w-fit font-bold"
                >
                  {doctor.status}
                </Badge>
              </div>
              <Avatar className="w-30 h-30 ml-4">
                <AvatarImage src="" alt={doctor.name} />
                <AvatarFallback>
                  {doctor.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </CardContent>
            <CardFooter className="pt-4">
              <Button
                className="w-full font-semibold"
                onClick={() => {
                  setSelectedDoctor(doctor);
                  form.reset({
                    doctorID: doctor._id,
                    date: new Date(),
                    reason: "",
                    timeSlot: "Morning",
                  });
                  setOpen(true);
                }}
                disabled={doctor.status === "Away"}
              >
                Book Appointment
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Appointment</DialogTitle>
            <DialogDescription>
              {selectedDoctor
                ? `Fill in the details to schedule an appointment with Dr. ${selectedDoctor.name}`
                : ""}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      <Popover>
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
                        <PopoverContent
                          className="w-auto overflow-hidden p-0"
                          align="start"
                        >
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
                <Button type="submit" className="font-semibold">
                  Confirm
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Doctors;
