"use client";

import React, { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Slide, toast, ToastContainer } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DoctorDialog from "@/components/dialogs/DoctorDialog";
import { admin } from "@/utils/api";
import PatientDialog from "@/components/dialogs/PatientDialog";

const UserManagement = () => {
  const [data, setData] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});

  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [roleData, setRoleData] = useState(null);
  const [viewOnly, setViewOnly] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await admin.get("/users");
        setData(res.data.data);
      } catch (err) {
        console.log(`${err}`);
      }
    };
    fetchData();
  }, []);

  const fetchRoleData = async (user) => {
    if (!user) return;
    try {
      const res = await admin(`/${user.role}s/${user._id}`);
      setRoleData(res.data.data);
      setModalOpen(true);
    } catch (err) {
      toast.error("Error fetching Data");
    }
  };

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => row.getValue("name"),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => row.getValue("email"),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const currentUser = row.original;

        const handleRoleChange = (newRole) => {
          if (newRole === currentUser.role) return;
          setSelectedUser(currentUser);
          setNewRole(newRole);
          setViewOnly(false);
          setRoleData(null);
          setModalOpen(true);
        };

        return (
          <Select value={currentUser.role} onValueChange={handleRoleChange}>
            <SelectTrigger className="w-auto">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel className="font-semibold">Update Role</SelectLabel>
                <SelectSeparator />
                {["admin", "doctor", "patient"].map((role) => (
                  <SelectItem key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </SelectItem>
                ))}
                <SelectSeparator />
                <SelectItem value="user" disabled>
                  User
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 shadow border">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(row.original._id);
                  toast.success("ID copied to clipboard");
                }}
              >
                Copy User ID
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  const user = row.original;
                  setSelectedUser(user);
                  setNewRole(row.original.role);
                  setViewOnly(true);
                  setRoleData(null);
                  await fetchRoleData(user);
                }}
              >
                More Info
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      sorting,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full p-4">
      <h2 className="text-xl font-semibold mb-4">User Management</h2>
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Filter by name"
          value={table.getColumn("name")?.getFilterValue() ?? ""}
          onChange={(e) =>
            table.getColumn("name")?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />
        <Input
          placeholder="Filter by email"
          value={table.getColumn("email")?.getFilterValue() ?? ""}
          onChange={(e) =>
            table.getColumn("email")?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="font-semibold">
              Add User <Plus />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              {["Doctor", "Patient", "Admin"].map((role) => (
                <DropdownMenuItem key={role}>{role}</DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead className="font-semibold" key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>

      <ToastContainer
        limit={3}
        position="top-center"
        autoClose={2500}
        hideProgressBar
        theme="colored"
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        closeOnClick
        transition={Slide}
      />

      {newRole === "doctor" && (
        <DoctorDialog
          open={modalOpen}
          setOpen={setModalOpen}
          oldUser={selectedUser}
          roleData={roleData}
          viewOnly={viewOnly}
        />
      )}
      {newRole === "patient" && (
        <PatientDialog
          open={modalOpen}
          setOpen={setModalOpen}
          oldUser={selectedUser}
          roleData={roleData}
          viewOnly={viewOnly}
        />
      )}
      {newRole === "admin" && (
        <AdminDialog
          open={modalOpen}
          setOpen={setModalOpen}
          oldUser={selectedUser}
          roleData={roleData}
          viewOnly={viewOnly}
        />
      )}
    </div>
  );
};

export default UserManagement;
