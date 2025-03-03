"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axiosFunction, { axiosReturnType } from "@/utils/axiosFunction";
import { companiesSchema, CompanyType } from "@/validations/companiesValidations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Loader } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const Page = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CompanyType>({
    resolver: zodResolver(companiesSchema),
  });

  const queryClient = useQueryClient();
  const addCompanyMutation = useMutation<
    axiosReturnType,
    AxiosError,
    CompanyType
  >({
    mutationFn: (newCompany) => {
      return axiosFunction({
        urlPath: "/companies",
        data: {
          name: newCompany.name,
        },
        method: "POST",
        isServer: true,
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Something went wrong!";
      toast.error(message);
      console.log("Mutation error Company:", error);
    },
    onSuccess: () => {
      reset();
      toast.success("Company added successfully!");
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });

  const onSubmit = (data: CompanyType) => {
    console.log(data);
    addCompanyMutation.mutate(data);
  };
  return (
    <Card className="w-full shadow-none border-0">
      <CardHeader className="border-b py-4">
        <CardTitle className="tracking-tight text-lg font-semibold flex justify-between items-center">
          Add Company Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full">
        <div className="pt-6 w-full">
          <form
            className="w-full flex flex-col gap-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="space-y-6 lg:w-1/2 w-full">
              <div className="space-y-2">
                <Label className="text-charcoal" htmlFor="name">
                  Company Name
                  <span className="text-red-500"> *</span>
                </Label>
                <Input
                  {...register("name")}
                  type="text"
                  placeholder="Enter company name"
                  className="w-full"
                  id="name"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs">{errors.name.message}</p>
                )}
              </div>

              <Button
                variant={`${
                    addCompanyMutation.isPending ? "secondary" : "primary"
                }`}
                // variant={"primary"}
                size="lg"
                className="md:w-max w-full disabled:cursor-not-allowed"
                type="submit"
                disabled={addCompanyMutation.isPending}
              >
                Submit
                {addCompanyMutation.isPending && (
                  <Loader className="animate-spin ml-2" />
                )}
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default Page;