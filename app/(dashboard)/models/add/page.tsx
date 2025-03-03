"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axiosFunction, { axiosReturnType } from "@/utils/axiosFunction";
import { modelsSchema, ModelType } from "@/validations/modelsValidations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader as LoaderIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form"; // Import Controller
import { toast } from "sonner";
import Select from "react-select";
import { CompanyResponse } from "../../companies/page";
import Loader from "@/components/ui/global/Loader";
import { AxiosError } from "axios";

const fetchCompanies = async (): Promise<CompanyResponse | null> => {
  try {
    const response = await axiosFunction({
      urlPath: "/companies",
    });
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching companies:", error.message);
    } else {
      console.error("Unknown error occurred while fetching companies:", error);
    }
    return null;
  }
};

const Page = () => {
  const [companyOptions, setCompanyOptions] = useState<
    { label: string; value: number }[]
  >([]);

  const { data: companiesResponse, isLoading: companiesLoading } =
    useQuery<CompanyResponse | null>({
      queryKey: ["model-companies"],
      queryFn: fetchCompanies,
    });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ModelType>({
    resolver: zodResolver(modelsSchema),
  });

  useEffect(() => {
    if (companiesResponse?.payload) {
      const temp = companiesResponse.payload.map((item) => ({
        label: item.name,
        value: Number(item.id),
      }));

      setCompanyOptions(temp);
    }
  }, [companiesResponse]);

  const queryClient = useQueryClient();
  const addModelMutation = useMutation<axiosReturnType, AxiosError, ModelType>({
    mutationFn: (newModel) => {
      return axiosFunction({
        urlPath: `/models`,
        data: {
          modelName: newModel.modelName,
          company: newModel.company,
        },
        method: "POST",
        isServer: true,
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Something went wrong!";
      toast.error(message);
      console.log("Mutation error Models:", error);
    },
    onSuccess: () => {
      reset();
      toast.success("Models added successfully!");
      queryClient.invalidateQueries({ queryKey: ["models"] });
    },
  });

  const onSubmit = (data: ModelType) => {
    console.log(data);
    addModelMutation.mutate(data);
  };

  if (companiesLoading) {
    return <Loader />;
  }

  return (
    <Card className="w-full shadow-none border-0">
      <CardHeader className="border-b py-4">
        <CardTitle className="tracking-tight text-lg font-semibold flex justify-between items-center">
          Add Model Setup
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
                <Label className="text-charcoal" htmlFor="modelName">
                  Model Name
                  <span className="text-red-500"> *</span>
                </Label>
                <Input
                  {...register("modelName")}
                  type="text"
                  placeholder="Enter Model Name"
                  className="w-full"
                  id="modelName"
                />
                {errors.modelName && (
                  <p className="text-red-500 text-xs">
                    {errors.modelName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-charcoal" htmlFor="company">
                  Company
                  <span className="text-red-500"> *</span>
                </Label>
                <Controller
                  name="company"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={companyOptions}
                      placeholder="Select a company"
                      className="w-full"
                      onChange={(selectedOption) =>
                        field.onChange(
                          selectedOption ? selectedOption.value : null
                        )
                      }
                      value={
                        companyOptions.find(
                          (option) => Number(option.value) === field.value
                        ) || null
                      }
                    />
                  )}
                />
                {errors.company && (
                  <p className="text-red-500 text-xs">
                    {errors.company.message}
                  </p>
                )}
              </div>

              <Button
                variant={`${
                  addModelMutation.isPending ? "secondary" : "primary"
                }`}
                size="lg"
                className="md:w-max w-full disabled:cursor-not-allowed"
                type="submit"
                disabled={addModelMutation.isPending}
              >
                Submit
                {addModelMutation.isPending && (
                  <LoaderIcon className="animate-spin ml-2" />
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
