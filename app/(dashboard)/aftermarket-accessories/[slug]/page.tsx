"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loader from "@/components/ui/global/Loader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axiosFunction, { axiosReturnType } from "@/utils/axiosFunction";
import {
  afterMarketAccessoriesSchema,
  AfterMarketAccessoriesType,
} from "@/validations/afterMarketAccessoriesValidations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Loader as LoaderIcon } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface AfterMarketAccessory {
  id: number;
  label: string;
}

interface AfterMarketAccessoriesResponse {
  status: string;
  message: string;
  payload: AfterMarketAccessory;
}

const fetchSingleAftermarketAccessory = async (
  id: number
): Promise<AfterMarketAccessoriesResponse | null> => {
  try {
    const response = await axiosFunction({
      urlPath: `/aftermarket-accessories/${id}`,
    });
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        "Error fetching single aftermarket accessory:",
        error.message
      );
    } else {
      console.error(
        "Unknown error occurred while fetching single aftermarket accessory:",
        error
      );
    }
    return null;
  }
};

const Page = () => {
  const { slug } = useParams();

  const {
    data: aftermarketAccessoryResponse,
    isLoading: aftermarketAccessoryLoading,
  } = useQuery<AfterMarketAccessoriesResponse | null>({
    queryKey: ["aftermarket-accessory", slug],
    queryFn: () => fetchSingleAftermarketAccessory(Number(slug)),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AfterMarketAccessoriesType>({
    resolver: zodResolver(afterMarketAccessoriesSchema),
    defaultValues: {
      label: "",
    },
  });

  useEffect(() => {
    if (aftermarketAccessoryResponse?.payload) {
      reset({
        label: aftermarketAccessoryResponse.payload.label || "",
      });
    }
  }, [aftermarketAccessoryResponse, reset]);

  const queryClient = useQueryClient();
  const updateAfterMarketAccMutation = useMutation<
    axiosReturnType,
    AxiosError,
    AfterMarketAccessoriesType
  >({
    mutationFn: (newAcc) => {
      return axiosFunction({
        urlPath: `/aftermarket-accessories/${Number(slug)}`,
        data: {
          label: newAcc.label,
        },
        method: "PUT",
        isServer: true,
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Something went wrong!";
      toast.error(message);
      console.log("Mutation error Aftermarket Accessories:", error);
    },
    onSuccess: () => {
      reset({
        label: "",
      });
      toast.success("Aftermarket Accessories updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["aftermarket-accessories"] });
    },
  });

  const onSubmit = (data: AfterMarketAccessoriesType) => {
    console.log(data);
    updateAfterMarketAccMutation.mutate(data);
  };

  if (aftermarketAccessoryLoading) {
    return <Loader />;
  }

  return (
    <Card className="w-full shadow-none border-0">
      <CardHeader className="border-b py-4">
        <CardTitle className="tracking-tight text-lg font-semibold flex justify-between items-center">
          Edit Aftermarket Accessory Setup
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
                variant={updateAfterMarketAccMutation.isPending ? "secondary" : "primary"}
                size="lg"
                className="md:w-max w-full disabled:cursor-not-allowed"
                type="submit"
                disabled={updateAfterMarketAccMutation.isPending}
              >
                Submit
                {updateAfterMarketAccMutation.isPending && (
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
