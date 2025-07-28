import React from 'react'
import Headerbar from './components/Headerbar'
import Sidebar from './components/Sidebar'
import { Button } from "@/components/ui/button"
import  Link  from 'next/link'

const page = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1">
        <Headerbar />
        <main className="p-6">
          <h1 className="text-2xl font-semibold">Welcome to Admin Dashboard</h1>
            <Button asChild variant="outline">
              <Link href="/admin/enquiry">Add Enquiry</Link>
            </Button>
        </main>
      </div>
    </div>
  )
}

export default page