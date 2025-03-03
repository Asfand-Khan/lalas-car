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
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, MoreHorizontal, Plus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import * as XLSX from "xlsx";

interface StandardFeature {
  id: number;
  label: string;
  created_at: string;
  updated_at: string;
}

interface StandardFeaturesResponse {
  status: string;
  message: string;
  payload: StandardFeature[];
}

const fetchStandardFeatures =
  async (): Promise<StandardFeaturesResponse | null> => {
    try {
      const response = await axiosFunction({
        urlPath: "/standard-features",
      });
      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error fetching standard features:", error.message);
      } else {
        console.error(
          "Unknown error occurred while fetching standard features:",
          error
        );
      }
      return null;
    }
  };

const Page = () => {
  const router = useRouter();

  const {
    data: standardFeaturesResponse,
    isLoading: standardFeaturesLoading,
  } = useQuery<StandardFeaturesResponse | null>({
    queryKey: ["standard-features"],
    queryFn: fetchStandardFeatures,
  });

  if (standardFeaturesLoading) {
    return <Loader />;
  }

  return (
    <>
      <SubNav
        title="Standard Features"
        showDatePicker={false}
        showDataTableFilters={false}
      />
      <Card className="w-full shadow-none border-0">
        <CardHeader className="border-b py-4">
          <CardTitle className="tracking-tight text-lg font-semibold flex justify-between items-center">
            <span>Explore your standard features</span>
            <div>
              <Button
                variant="primary"
                className="text-left py-1"
                onClick={() => router.push(`/standard-features/add`)}
              >
                Add Standard Feature
                <Plus className="ml-1 h-4 w-4" size={20} />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {standardFeaturesResponse &&
          standardFeaturesResponse.status === "1" &&
          standardFeaturesResponse.payload.length > 0 ? (
            <>
              <DataTable
                columns={
                  [
                    {
                      accessorKey: "id",
                      header: "ID",
                    },
                    {
                      accessorKey: "label",
                      header: "Label",
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
                                    router.push(`/standard-features/${record.id}`)
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
                  ] as ColumnDef<StandardFeature>[]
                }
                data={standardFeaturesResponse.payload}
                exportConfig={{
                  excel: {
                    enabled: true,
                    fileName: "standard-features.xlsx",

                    exportFunction: (data) => {
                      const ws = XLSX.utils.json_to_sheet(data);
                      const wb = XLSX.utils.book_new();
                      XLSX.utils.book_append_sheet(wb, ws, "Data");
                      XLSX.writeFile(wb, "standard-features.xlsx");
                    },
                  },
                  csv: {
                    enabled: true,
                    fileName: "standard-features.csv",
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
                        link.setAttribute(
                          "download",
                          "standard-features.csv"
                        );
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
