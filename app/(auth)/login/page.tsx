import React from 'react'
import type { Metadata } from "next";
import Auth from '@/components/ui/auth/Auth';

export const metadata: Metadata = {
  title: "Login | Lala's Car",
  description: "Lala's Car"
};

const Page = () => {
  return (
    <Auth />
  )
}

export default Page