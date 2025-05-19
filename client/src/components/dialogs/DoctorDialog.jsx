"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { admin } from "@/utils/api";

const DoctorDialog = ({ open, setOpen, oldUser }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    gender: "",
    age: "",
    specialization: "",
    status: "",
  });

  useEffect(() => {
    if (oldUser) {
      setFormData({
        name: oldUser.name || "",
        phone: oldUser.phone || "",
        gender: oldUser.gender || "",
        age: oldUser.age || "",
        specialization: oldUser.specialization || "",
        status: oldUser.status || "",
      });
    } else {
      setFormData({
        name: "",
        phone: "",
        gender: "",
        age: "",
        specialization: "",
        status: "",
      });
    }
  }, [oldUser, open]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    // Your logic to create new doctor user here
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Doctor Details</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div>
            <Label className="mb-1.5">Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Full Name"
              required
            />
          </div>
          <div>
            <Label className="mb-1.5">Phone</Label>
            <Input
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="Phone Number"
              minLength={10}
              maxLength={10}
              required
            />
          </div>
          <div className="flex justify-between gap-2">
            <div className="w-1/2">
              <Label className="mb-1.5">Gender</Label>
              <Select
                onValueChange={(val) => handleChange("gender", val)}
                value={formData.gender}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-1/2">
              <Label className="mb-1.5">Age</Label>
              <Input
                type="number"
                value={formData.age}
                onChange={(e) => handleChange("age", e.target.value)}
                placeholder="Age"
                min={1}
                required
              />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-5/8">
              <Label className="mb-1.5">Specialization</Label>
              <Input
                value={formData.specialization}
                onChange={(e) => handleChange("specialization", e.target.value)}
                placeholder="e.g. Cardiologist"
                required
              />
            </div>
            <div className="w-3/8">
              <Label className="mb-1.5">Status</Label>
              <Select
                onValueChange={(val) => handleChange("status", val)}
                value={formData.status}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Away">Away</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button className="font-semibold" type="button" variant="outline">
              Close
            </Button>
          </DialogClose>
          <Button className="font-semibold" onClick={handleSubmit}>
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DoctorDialog;
