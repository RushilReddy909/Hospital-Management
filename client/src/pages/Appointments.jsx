import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/utils/api";
import { ChevronDownIcon, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const schema = z.object({
  date: z
    .date({
      required_error: "Date is required",
    })
    .refine((d) => d >= new Date(new Date().setHours(0, 0, 0, 0)), {
      message: "Date cannot be in the past",
    }),
  reason: z.string().min(1, { message: "Reason cannot be empty" }),
  timeSlot: z.enum(["Morning", "Afternoon", "Evening"], {
    errorMap: () => ({ message: "Select a valid time slot" }),
  }),
});

const Appointments = () => {
  const [doctors, setDoctors] = useState(null);
  const [open, setOpen] = useState(false);
  const [doctor, setDoctor] = useState(null);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date(),
      reason: "",
      timeSlot: "Morning",
    },
  });

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/appointment", {
        doctorID: doctor.doctorID,
        ...data,
      });

      toast.success("Appointment scheduled successfully");
      setOpen(false);
    } catch (err) {
      toast.error("Appointment could not be scheduled");
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchDoctors = async (req, res) => {
      try {
        const res = await api.get("/patient/doctors");
        setDoctors(res.data.data);
      } catch (err) {
        toast.error("Couldn't retrieve doctors");
        console.log(err);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className="flex justify-center h-full p-5">
      {doctors && doctors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
          {doctors
            .filter((doctor) => doctor.status === "Active")
            .map((doctor) => (
              <Card
                key={doctor.doctorID}
                className="p-4 shadow-md h-[250px] flex flex-col justify-between"
              >
                {/* Top: Info + Avatar */}
                <div className="flex gap-4">
                  {/* Left: Header + Content */}
                  <div className="flex-1 w-[60%]">
                    <CardHeader className="p-0">
                      <CardTitle className="text-xl font-semibold">
                        Dr. {doctor.name}
                      </CardTitle>
                      <CardDescription className="text-sm text-zinc-500">
                        {doctor.specialization}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 pt-2 text-sm space-y-1 text-zinc-600">
                      <p>
                        <span className="font-medium">Phone:</span>{" "}
                        {doctor.phone}
                      </p>
                      <p>
                        <span className="font-medium">Gender:</span>{" "}
                        {doctor.gender}
                      </p>
                      <p>
                        <span className="font-medium">Age:</span> {doctor.age}
                      </p>
                    </CardContent>
                  </div>

                  {/* Right: Avatar */}
                  <div className="flex items-center justify-center w-[40%]">
                    <AspectRatio ratio={1 / 1}>
                      <Avatar className="w-full h-full flex items-center justify-center bg-muted">
                        <AvatarFallback className="flex items-center justify-center w-full h-full">
                          <User className="w-10 h-10 text-zinc-500" />
                        </AvatarFallback>
                      </Avatar>
                    </AspectRatio>
                  </div>
                </div>

                {/* Bottom: Common Footer */}
                <CardFooter className="pt-4">
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => {
                          setDoctor(doctor);
                          setOpen(true);
                          form.reset();
                        }}
                        className={"w-full font-semibold"}
                      >
                        Book Appointment
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirm Appointment</DialogTitle>
                        <DialogDescription>
                          Fill in the details to schedule an appointment with
                          Dr. {doctor.name}
                        </DialogDescription>
                      </DialogHeader>

                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(onSubmit)}
                          className="space-y-4"
                        >
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
                                          id="date"
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
                                        onSelect={(date) => {
                                          field.onChange(date);
                                        }}
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
                                      <SelectTrigger className={"w-full"}>
                                        <SelectValue placeholder="Select a time slot" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Morning">
                                          Morning
                                        </SelectItem>
                                        <SelectItem value="Afternoon">
                                          Afternoon
                                        </SelectItem>
                                        <SelectItem value="Evening">
                                          Evening
                                        </SelectItem>
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
                            <Button type="submit" className={"font-semibold"}>
                              Confirm
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}
        </div>
      ) : (
        <h1 className="text-2xl font-semibold">
          No doctors available, try again later
        </h1>
      )}
    </div>
  );
};

export default Appointments;
