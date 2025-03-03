"use client";

import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Loader from "@/components/ui/global/Loader";
import SubNav from "@/components/ui/global/SubNav";
import axiosFunction from "@/utils/axiosFunction";
import getPageRights from "@/utils/getPageRights";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, MoreHorizontal, Plus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import * as XLSX from "xlsx";

// Define the type for each user in the 'payload' array
interface User {
  id: number;
  fullname: string;
  email: string;
  username: string;
  hashedPassword: string; // Hashed password as a string
  phone: string;
  image: string; // Filename or path to the image
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
}

// Define the type for the entire response
interface UsersResponse {
  status: string; // Could be "1" | "0" if it’s a success/failure flag
  message: string;
  payload: User[];
}

const fetchUsers = async (): Promise<UsersResponse | null> => {
  try {
    const response = await axiosFunction({
      urlPath: "/users",
    });
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching Users:", error.message);
    } else {
      console.error("Unknown error occurred while fetching Users:", error);
    }
    return null;
  }
};

const Page = () => {
  const router = useRouter();

  const { data: usersResponse, isLoading: usersLoading } =
    useQuery<UsersResponse | null>({
      queryKey: ["users"],
      queryFn: fetchUsers,
    });

  if (usersLoading) {
    return <Loader />;
  }

  return (
    <>
      <SubNav
        title="Users"
        showDatePicker={false}
        showDataTableFilters={false}
      />
      <Card className="w-full shadow-none border-0">
        <CardHeader className="border-b py-4">
          <CardTitle className="tracking-tight text-lg font-semibold flex justify-between items-center">
            <span>Explore your users</span>
            {/* {rights?.can_create === true && ( */}
              <>
                <div>
                  <Button
                    variant="primary"
                    className="text-left py-1"
                    onClick={() => router.push(`/users/add`)}
                  >
                    Add User
                    <Plus className="ml-1 h-4 w-4" size={20} />
                  </Button>
                </div>
              </>
            {/* )} */}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {usersResponse &&
          usersResponse.status === "1" &&
          usersResponse.payload.length > 0 ? (
            <>
              <DataTable
                columns={
                  [
                    {
                      accessorKey: "id",
                      header: "ID",
                    },
                    {
                      accessorKey: "fullname",
                      header: "Fullname",
                    },
                    {
                      accessorKey: "email",
                      header: "Email",
                    },
                    {
                      accessorKey: "username",
                      header: "Username",
                    },
                    {
                      accessorKey: "phone",
                      header: "Phone",
                    },
                    {
                      header: "Actions",
                      id: "actions",
                      cell: ({ row }) => {
                        const record = row.original;
                        return (
                          <>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="h-8 w-8 p-0 focus-visible:ring-0"
                                >
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() => {
                                    console.log("Edit: ", record);
                                    router.push(`/users/${record.id}`);
                                  }}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onSelect={(e) => {
                                    e.preventDefault();
                                    console.log("Delete: ", record);
                                  }}
                                >
                                  <Trash className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </>
                        );
                      },
                    },
                  ] as ColumnDef<User>[]
                }
                data={usersResponse.payload}
                exportConfig={{
                  excel: {
                    enabled: true,
                    fileName: "users.xlsx",

                    exportFunction: (data) => {
                      const ws = XLSX.utils.json_to_sheet(data);
                      const wb = XLSX.utils.book_new();
                      XLSX.utils.book_append_sheet(wb, ws, "Data");
                      XLSX.writeFile(wb, "users.xlsx");
                    },
                  },
                  csv: {
                    enabled: true,
                    fileName: "users.csv",
                    exportFunction: (data) => {
                      const ws = XLSX.utils.json_to_sheet(data);
                      const csv = XLSX.utils.sheet_to_csv(ws);
                      const blob = new Blob([csv], {
                        type: "text/csv;charset=utf-8;",
                      });
                      const link = document.createElement("a");
                      if (link.download !== undefined) {
                        const url = URL.createObjectURL(blob);
                        link.setAttribute("href", url);
                        link.setAttribute("download", "users.csv");
                        link.style.visibility = "hidden";
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }
                    },
                  },
                }}
              />
            </>
          ) : (
            <div className="flex items-center flex-col justify-center">
              <span className="text-primary-100 font-bold mt-5">
                No Data Found!
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default Page;
