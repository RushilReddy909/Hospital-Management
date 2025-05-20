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
import { toast } from "react-toastify";
import { Textarea } from "../ui/textarea";

const PatientDialog = ({ open, setOpen, oldUser, roleData, viewOnly }) => {
  const [edit, setEdit] = useState(false);
  const [orgData, setOrgData] = useState(null);
  const [formData, setFormData] = useState({
    patientID: "",
    name: "",
    phone: "",
    gender: "",
    age: "",
    description: "",
  });

  useEffect(() => {
    const dat = roleData
      ? {
          patientID: roleData.patientID || "",
          name: roleData.name || "",
          phone: roleData.phone || "",
          gender: roleData.gender || "",
          age: roleData.age || "",
          description: roleData.description || "",
        }
      : {
          patientID: oldUser._id || "",
          name: "",
          phone: "",
          gender: "",
          age: "",
          description: "",
        };

    setFormData(dat);
    setOrgData(dat);
    setEdit(!viewOnly);
  }, [oldUser, open]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (viewOnly) {
      try {
        await admin.put(`/patients/${orgData.patientID}`, formData);
        toast.success("Succesfully updated");
      } catch (err) {
        toast.error("Error updating");
        console.log(err);
      }
    } else {
      try {
        await admin.delete(`${oldUser.role}s/${oldUser._id}`);
        await admin.post("/patients", formData);
        toast.success("Succesfully added");
      } catch (err) {
        toast.error("Error adding");
        console.log(err);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Patient Details</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div>
            <Label className="mb-1.5">Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Full Name"
              required
              disabled={!edit}
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
              disabled={!edit}
            />
          </div>
          <div className="flex justify-between gap-2">
            <div className="w-1/2">
              <Label className="mb-1.5">Gender</Label>
              <Select
                onValueChange={(val) => handleChange("gender", val)}
                value={formData.gender}
                disabled={!edit}
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
                disabled={!edit}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Textarea
              placeholder="Enter patient description"
              disabled={!edit}
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              className="font-semibold"
              type="button"
              variant="outline"
              onClick={() => {
                if (edit) {
                  setFormData(orgData); // Reset changes
                }
              }}
            >
              {edit ? "Cancel" : "Close"}
            </Button>
          </DialogClose>

          <Button
            className="font-semibold"
            onClick={() => {
              if (!edit) {
                setEdit(true); // Enable editing
              } else {
                handleSubmit(); // Submit data
              }
            }}
          >
            {edit ? "Save" : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PatientDialog;
