"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "../button"
import { toast } from "sonner"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

const ForgotPasswordForm = () => {

    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const FormSchema = z.object({
        username: z.string().min(2, {
            message: "Username must be at least 2 characters.",
        }),
        password: z.string().min(8, {
            message: "Password must be at least 8 characters long.",
        }).regex(/[A-Z]/, {
            message: "Password must contain at least one uppercase letter.",
        }).regex(/\d/, {
            message: "Password must contain at least one number.",
        })
    })
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })
    function onSubmit(data: z.infer<typeof FormSchema>) {
        toast.success("You submitted the following values")
        console.log(data)
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
                            <FormItem className="mb-6">
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter Password" {...field} />
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
                    <Button variant="primary" size="lg" className="w-full" type="submit">Submit</Button>
                </form>
            </Form>
        </>
    )
}

export default ForgotPasswordForm