import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { api } from "@/utils/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Copy, Ellipsis, Siren } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectGroup } from "@radix-ui/react-select";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Profile = () => {
  const [details, setDetails] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    description: "",
  });
  const [alert, setAlert] = useState(false);

  const handleSubmit = async () => {
    try {
      const res = await api.post("/patient", formData);
      setDetails(res.data.data);
      toast.success("Profile updated successfully!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        theme: "colored",
      });
    } catch (err) {
      toast.error(
        err.response?.data?.errors?.[0] || "Failed to update profile",
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          theme: "colored",
        }
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/patient");
        setDetails(res.data.data);
      } catch (err) {
        if (err.response?.status !== 404) {
          toast.error(
            err.response?.data?.message || "Error fetching your data",
            {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: true,
              theme: "colored",
            }
          );
        } else {
          setAlert(true);
        }
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (details.name) {
      setFormData({
        name: details.name || "",
        age: details.age || "",
        gender: details.gender || "",
        phone: details.phone || "",
        description: details.description || "",
      });
    }
  }, [details]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <ToastContainer />
      <div className="w-full max-w-4xl p-4 flex flex-col gap-3">
        {alert && (
          <Alert className="mb-1 shadow-sm bg-red-50 border-red-300">
            <Siren color="red" className="h-6 w-6 mr-2" />
            <AlertTitle>Patient Record not Found</AlertTitle>
            <AlertDescription>
              Create an account to avail services
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-3">
          <Card className="w-full lg:w-3/8">
            <CardContent className="flex flex-col items-center gap-2">
              <Avatar className="w-32 h-32">
                <AvatarImage src="#" />
                <AvatarFallback className="text-3xl">N/A</AvatarFallback>
              </Avatar>
              <h1 className="text-2xl">Your Profile</h1>
              <div className="flex gap-1">
                <p>ID:</p>
                <Badge
                  variant="secondary"
                  className="text-zinc-500 flex items-center gap-1 cursor-pointer"
                  onClick={() => {
                    if (details.userID) {
                      navigator.clipboard.writeText(details.userID);
                      toast.success("Copied to clipboard", {
                        position: "bottom-right",
                        autoClose: 2000,
                        hideProgressBar: true,
                        theme: "light",
                      });
                    }
                  }}
                >
                  <TooltipProvider>
                    <Tooltip delayDuration={300}>
                      <TooltipTrigger asChild>
                        <div className="flex gap-1 not-hover:text-transparent">
                          {details.userID || "Invalid"}
                          {details.userID && <Copy className="h-4 w-4 ml-1" />}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>This is your unique ID </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Badge>
              </div>
              <Button variant={"outline"} className={"mt-2.5 justify-self-end"}>
                Upload Picture
              </Button>
            </CardContent>
          </Card>
          <Card className="w-full lg:w-5/8 px-2">
            <CardContent className="flex flex-col gap-2">
              <div className="flex gap-2">
                <p className="font-semibold w-3/8">Full Name</p>
                <p className="text-zinc-400 w-5/8">{details.name || "N/A"}</p>
              </div>
              <Separator />
              <div className="flex gap-2">
                <p className="font-semibold w-3/8">Age</p>
                <p className="text-zinc-400 w-5/8">{details.age || "N/A"}</p>
              </div>
              <Separator />
              <div className="flex gap-2">
                <p className="font-semibold w-3/8">Gender</p>
                <p className="text-zinc-400 w-5/8">{details.gender || "N/A"}</p>
              </div>
              <Separator />
              <div className="flex gap-2">
                <p className="font-semibold w-3/8">Phone</p>
                <p className="text-zinc-400 w-5/8">{details.phone || "N/A"}</p>
              </div>
              <Separator />
              <div className="flex items-start gap-2">
                <p className="font-semibold w-3/8">Medical Description</p>
                <div className="flex justify-between items-center gap-1 w-5/8">
                  <p className="text-zinc-400 truncate max-w-[250px]">
                    {details.description || "N/A"}
                  </p>
                  {details.description && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="text-zinc-700 hover:text-white transition-colors hover:bg-zinc-700 border-2 border-zinc-700 rounded-sm shadow-sm hover:shadow-md">
                          <Ellipsis className="w-4 h-4" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="max-w-sm max-h-48 overflow-y-auto text-sm text-zinc-700">
                        {details.description}
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              </div>
              <Separator />
              <div className="flex justify-between mt-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="font-semibold">Edit Details</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>Edit Details</DialogTitle>
                    <DialogDescription>
                      Make Changes to your profile here and click save to
                      update.
                    </DialogDescription>
                    <form className="mt-3 space-y-5 px-2">
                      {/* Name & Age */}
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-4/5 space-y-1.5">
                          <Label htmlFor="name">Patient Name</Label>
                          <Input
                            placeholder="Ex: John Doe"
                            id="name"
                            maxLength={40}
                            type="text"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div className="w-full md:w-1/5 space-y-1.5">
                          <Label htmlFor="age">Age</Label>
                          <Input
                            id="age"
                            type="number"
                            required
                            min={1}
                            max={120}
                            value={formData.age}
                            onChange={(e) =>
                              setFormData({ ...formData, age: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      {/* Gender & Phone */}
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-1/3  space-y-1.5">
                          <Label htmlFor="gender">Gender</Label>
                          <Select
                            value={formData.gender}
                            onValueChange={(val) =>
                              setFormData({ ...formData, gender: val })
                            }
                          >
                            <SelectTrigger id="gender" className="w-full">
                              <SelectValue placeholder="Select Gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="w-full md:w-2/3 space-y-1.5">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            required
                            type="text"
                            maxLength={10}
                            placeholder="9876543210"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                phone: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <div className="space-y-1.5">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          required
                          id="description"
                          placeholder="Enter medical description"
                          className="min-h-[120px]"
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              description: e.target.value,
                            })
                          }
                        />
                      </div>

                      {/* Submit */}
                      <DialogFooter>
                        <DialogClose asChild>
                          <div className="flex justify-end">
                            <Button
                              type="button"
                              onClick={handleSubmit}
                              className="font-semibold px-6 py-2"
                            >
                              Update
                            </Button>
                          </div>
                        </DialogClose>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
                <Button className={"font-semibold"} variant={"destructive"}>
                  Request Deletion
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <p className="text-center text-3xl">Your Appointments</p>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
