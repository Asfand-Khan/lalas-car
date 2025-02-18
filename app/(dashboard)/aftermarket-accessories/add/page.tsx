import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

const page = () => {
  return (
    <Card className="w-full shadow-none border-0">
      <CardHeader className="border-b py-4">
        <CardTitle className="tracking-tight text-lg font-semibold flex justify-between items-center">
          Add Aftermarket Accessory Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full">
      </CardContent>
    </Card>
  )
}

export default page