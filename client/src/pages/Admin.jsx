import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Archive,
  ChartNoAxesCombined,
  ClipboardPlus,
  LogOut,
  Logs,
  Settings,
  Users,
} from "lucide-react";
import React, { useState } from "react";
import Analytics from "./admin/Analytics";
import UserManagement from "./admin/UserManagement";
import Appointments from "./admin/Appointments";
import Log from "./admin/Logs";
import Records from "./admin/Records";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();
  const [component, setComponent] = useState(<Analytics />);
  const menu = [
    {
      title: "System Analytics",
      icon: ChartNoAxesCombined,
      component: <Analytics />,
    },
    { title: "User Management", icon: Users, component: <UserManagement /> },
    {
      title: "Manage Appointments",
      icon: ClipboardPlus,
      component: <Appointments />,
    },
    { title: "Medical Records", icon: Archive, component: <Records /> },
    { title: "Server Logs", icon: Logs, component: <Log /> },
  ];

  return (
    <>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem className={"flex justify-between p-2"}>
                <Avatar className={"w-8 h-8"}>
                  <AvatarImage src="" alt="@Hospital" />
                  <AvatarFallback>
                    <Settings />
                  </AvatarFallback>
                </Avatar>
                <p variant={"destructive"} className={"font-semibold text-xl"}>
                  Admin Panel
                </p>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarSeparator />
          <SidebarContent className={"p-2"}>
            <SidebarMenu className={"gap-2"}>
              {menu.map((item) => (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    className={
                      "p-5 font-semibold hover:bg-green-500 hover:text-white transition-colors"
                    }
                    asChild
                  >
                    <button
                      type="button"
                      onClick={() => setComponent(item.component)}
                    >
                      <item.icon />
                      {item.title}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarSeparator />
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  className={
                    "p-5 font-semibold hover:bg-red-500 hover:text-white transition-colors"
                  }
                  onClick={() => {
                    localStorage.removeItem("token");
                    navigate("/login");
                  }}
                >
                  <LogOut />
                  <p>Logout</p>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4 z-50">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </header>
          <main>{component}</main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
};

export default Admin;
