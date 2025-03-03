"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../button";
import { toast } from "sonner";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Loader } from "lucide-react";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axiosFunction, { axiosReturnType } from "@/utils/axiosFunction";
import { AxiosError } from "axios";

const LoginForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const FormSchema = z.object({
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    password: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters long.",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
      })
      .regex(/\d/, {
        message: "Password must contain at least one number.",
      }),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const authenticateUserMutation = useMutation<
    axiosReturnType,
    AxiosError,
    z.infer<typeof FormSchema>
  >({
    mutationFn: (credentials) => {
      return axiosFunction({
        urlPath: "/users/login",
        data: {
          username: credentials.username,
          password: credentials.password,
        },
        method: "POST",
        isServer: true,
      });
    },
    onSuccess: (data) => {
      toast.success("Login Successfully!");
      setCookie(
        "lalascar-token",
        data.payload.user_info.bearer_token as string,
        { secure: false }
      );
      setCookie("menus", JSON.stringify(data.payload.menu), { secure: false });
      setCookie(
        "userInfo",
        JSON.stringify({
          email: data.payload.user_info.email,
          fullname: data.payload.user_info.fullname,
          image: data.payload.user_info.image,
          phone: data.payload.user_info.phone,
          user_id: data.payload.user_info.id,
        }),
        { secure: false }
      );
      router.push("/");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Something went wrong!";
      toast.error(message);
      console.log("Mutation error:", error);
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    authenticateUserMutation.mutate(data);
    // setCookie("lalascar-token", data.username, { maxAge: 60 * 60 * 24 * 30 });
    // router.push("/");
  }
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="mb-6">
                <FormControl>
                  <Input placeholder="Enter Username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="mb-2">
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter Password"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-3 flex items-center w-[16px]"
                    >
                      {showPassword ? <Eye /> : <EyeOff />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mb-6 text-right">
            <Link
              href="/forgot-password"
              className="text-xs text-charcoal inline-block underline underline-offset-4 hover:no-underline transition-all duration-300"
            >
              Forgot Password?
            </Link>
          </div>

          <Button
            variant={`${
              authenticateUserMutation.isPending ? "secondary" : "primary"
            }`}
            size="lg"
            className="md:w-max w-full disabled:cursor-not-allowed"
            type="submit"
            disabled={authenticateUserMutation.isPending}
          >
            Sign in
            {authenticateUserMutation.isPending && (
              <Loader className="animate-spin ml-2" />
            )}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default LoginForm;
