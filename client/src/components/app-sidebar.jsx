import * as React from "react";
import { BriefcaseMedical, Home, ShieldPlus, UsersRound } from "lucide-react";
import { DatePicker } from "@/components/date-picker";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEffect } from "react";
import { api } from "@/utils/api";
import { useState } from "react";
import { Link } from "react-router-dom";

const hospital = {
  name: "NeoCure Hospital",
  desc: "World Class Hospital",
  avatar: "/avatars/shadcn.jpg",
};

const items = [
  {
    title: "Home Page",
    url: "/",
    icon: Home,
  },
  {
    title: "Book an Appointment",
    url: "/appointments",
    icon: BriefcaseMedical,
  },
  {
    title: "Our Doctors",
    url: "/doctors",
    icon: UsersRound,
  },
  {
    title: "Services",
    url: "/services",
    icon: ShieldPlus,
  },
];

export function AppSidebar({ ...props }) {
  const [user, setUser] = useState({
    name: "",
    email: "",
    avatar: "",
  });

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const res = await api.get("/user");
        setUser({ ...res.data.data, avatar: "" });
      } catch (err) {
        console.log("Could not retrieve Data");
      }
    };

    getUserInfo();
  }, []);

  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-sidebar-border h-16 border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Link to="/">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={hospital.avatar} alt={hospital.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold">{hospital.name}</span>
                  <span className="truncate text-xs">{hospital.desc}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <DatePicker />
        <SidebarSeparator className="mx-0" />
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={
                      "p-5 font-semibold  hover:bg-green-500 hover:text-white transition-all"
                    }
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
