import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import { Slide, ToastContainer } from "react-toastify";
import { ModeToggle } from "./mode-toggle";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function Page() {
  const date = new Date();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-50 flex items-center justify-between h-16 border-b bg-background px-4">
          {/* Left Section: Sidebar + Breadcrumb */}
          <div className="flex items-center gap-3">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-6" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {months[date.getMonth()]} {date.getFullYear()}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Right Section: Theme Toggle */}
          <div className="flex items-center">
            <ModeToggle />
          </div>
        </header>

        <Outlet />
        <ToastContainer
          position="top-center"
          autoClose={4000}
          limit={4}
          hideProgressBar={false}
          newestOnTop
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss={false}
          draggable={false}
          pauseOnHover
          theme="colored"
          transition={Slide}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}
