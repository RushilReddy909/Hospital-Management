import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, User, Cake, Stethoscope } from "lucide-react";
import { api } from "@/utils/api";
import { toast } from "react-toastify";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);

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
                <h3 className="text-xl font-bold">{doctor.name}</h3>
                <p className="text-sm text-gray-600 flex items-center gap-1 mb-3">
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
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Doctors;
