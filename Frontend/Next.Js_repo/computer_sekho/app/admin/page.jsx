'use client';

import React, { useEffect, useState } from 'react';
import Headerbar from './components/Headerbar';
import Sidebar from './components/Sidebar';
import FollowUpTable from './Followuptable/page';
import { Button } from "@/components/ui/button";
import Link from 'next/link';

const Page = () => {

  //fetching data comes here

  return (
    <>
      {/* <h1 className="text-2xl font-semibold mb-4">Welcome, {admin.name} 👋</h1> // uncomment after db is created */}

      <Button asChild variant="outline">
        <Link href="/admin/AddEnquiry">Add Enquiry</Link>
      </Button>

      <FollowUpTable/>
    </>
  );
};

export default Page;