"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axiosFunction, { axiosReturnType } from "@/utils/axiosFunction";
import {
  standardFeaturesSchema,
  StandardFeaturesType,
} from "@/validations/standardFeaturesValidations";
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
  } = useForm<StandardFeaturesType>({
    resolver: zodResolver(standardFeaturesSchema),
  });

  const queryClient = useQueryClient();
  const addStandardFeatureMutation = useMutation<
    axiosReturnType,
    AxiosError,
    StandardFeaturesType
  >({
    mutationFn: (newStandardFeature) => {
      return axiosFunction({
        urlPath: "/standard-features",
        data: {
          label: newStandardFeature.label,
        },
        method: "POST",
        isServer: true,
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Something went wrong!";
      toast.error(message);
      console.log("Mutation error Standard Features:", error);
    },
    onSuccess: () => {
      reset();
      toast.success("Standard Features added successfully!");
      queryClient.invalidateQueries({ queryKey: ["standard-features"] });
    },
  });

  const onSubmit = (data: StandardFeaturesType) => {
    console.log(data);
    addStandardFeatureMutation.mutate(data);
  };

  return (
    <Card className="w-full shadow-none border-0">
      <CardHeader className="border-b py-4">
        <CardTitle className="tracking-tight text-lg font-semibold flex justify-between items-center">
          Add Standard Feature Setup
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
                <Label className="text-charcoal" htmlFor="label">
                  Standard Feature Name
                  <span className="text-red-500"> *</span>
                </Label>
                <Input
                  {...register("label")}
                  type="text"
                  placeholder="Enter standard feature name"
                  className="w-full"
                  id="label"
                />
                {errors.label && (
                  <p className="text-red-500 text-xs">{errors.label.message}</p>
                )}
              </div>

              <Button
                variant={`${
                  addStandardFeatureMutation.isPending ? "secondary" : "primary"
                }`}
                // variant={"primary"}
                size="lg"
                className="md:w-max w-full disabled:cursor-not-allowed"
                type="submit"
                disabled={addStandardFeatureMutation.isPending}
              >
                Submit
                {addStandardFeatureMutation.isPending && (
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
