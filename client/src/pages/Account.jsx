import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import api from "@/utils/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Siren } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const [details, setDetails] = useState({});
  const [alert, setAlert] = useState(false);

  const handleSubmit = () => {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/patients/self");
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

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <ToastContainer />
      <div className="w-full max-w-4xl p-4">
        {alert && (
          <Alert className="mb-4 shadow-sm bg-red-50 border-red-300">
            <Siren color="red" className="h-6 w-6 mr-2" />
            <AlertTitle>Patient Record not Found</AlertTitle>
            <AlertDescription>
              Create an account to avail services
            </AlertDescription>
          </Alert>
        )}

        <Card className="p-6 shadow-md rounded-2xl bg-white">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="w-32 h-32 border shadow-md">
              <AvatarImage src="#" />
              <AvatarFallback className="text-3xl">N/A</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-semibold">Your Profile</h2>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-5 px-2 md:px-6"
          >
            {/* Name & Age */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-4/5 space-y-1.5">
                <Label htmlFor="name">Patient Name</Label>
                <Input
                  placeholder="Ex: John Doe"
                  id="name"
                  maxLength={40}
                  type="text"
                  required
                />
              </div>
              <div className="w-full md:w-1/5 space-y-1.5">
                <Label htmlFor="age">Age</Label>
                <Input id="age" type="number" required min={1} max={120} />
              </div>
            </div>

            {/* Gender & Phone */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/3  space-y-1.5">
                <Label htmlFor="gender">Gender</Label>
                <Select>
                  <SelectTrigger id="gender" className="w-full">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full md:w-2/3 space-y-1.5">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex border rounded-md overflow-hidden">
                  <select className="bg-gray-100 px-3 border-r outline-none text-sm">
                    <option value="+91">+91</option>
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                  </select>
                  <Input
                    required
                    type="text"
                    maxLength={10}
                    placeholder="9876543210"
                    className="border-0 focus:ring-0 focus:outline-none"
                  />
                </div>
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
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <Button className="font-semibold px-6 py-2">Update</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
