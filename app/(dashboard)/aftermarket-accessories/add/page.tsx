"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axiosFunction, { axiosReturnType } from "@/utils/axiosFunction";
import {
  afterMarketAccessoriesSchema,
  AfterMarketAccessoriesType,
} from "@/validations/afterMarketAccessoriesValidations";
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
  } = useForm<AfterMarketAccessoriesType>({
    resolver: zodResolver(afterMarketAccessoriesSchema),
  });

  const queryClient = useQueryClient();
  const addAfterMarketAccMutation = useMutation<
    axiosReturnType,
    AxiosError,
    AfterMarketAccessoriesType
  >({
    mutationFn: (newAcc) => {
      return axiosFunction({
        urlPath: "/aftermarket-accessories",
        data: {
          label: newAcc.label,
        },
        method: "POST",
        isServer: true,
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Something went wrong!";
      toast.error(message);
      console.log("Mutation error Aftermarket Accessories:", error);
    },
    onSuccess: () => {
      reset();
      toast.success("Aftermarket Accessories added successfully!");
      queryClient.invalidateQueries({ queryKey: ["aftermarket-accessories"] });
    },
  });

  const onSubmit = (data: AfterMarketAccessoriesType) => {
    console.log(data);
    addAfterMarketAccMutation.mutate(data);
  };
  return (
    <Card className="w-full shadow-none border-0">
      <CardHeader className="border-b py-4">
        <CardTitle className="tracking-tight text-lg font-semibold flex justify-between items-center">
          Add Aftermarket Accessory Setup
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
                  Aftermarket Accessory Name
                  <span className="text-red-500"> *</span>
                </Label>
                <Input
                  {...register("label")}
                  type="text"
                  placeholder="Enter aftermarket accessory name"
                  className="w-full"
                  id="label"
                />
                {errors.label && (
                  <p className="text-red-500 text-xs">{errors.label.message}</p>
                )}
              </div>

              <Button
                variant={`${
                  addAfterMarketAccMutation.isPending ? "secondary" : "primary"
                }`}
                // variant={"primary"}
                size="lg"
                className="md:w-max w-full disabled:cursor-not-allowed"
                type="submit"
                disabled={addAfterMarketAccMutation.isPending}
              >
                Submit
                {addAfterMarketAccMutation.isPending && (
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
