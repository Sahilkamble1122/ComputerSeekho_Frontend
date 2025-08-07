'use client';

import React, { useEffect, useState } from 'react';
import Headerbar from './components/Headerbar';
import Sidebar from './components/Sidebar';
import FollowUpTable from './dashboard/page';
import { Button } from "@/components/ui/button";
import Link from 'next/link';

const Page = () => {

  //fetching data comes here


  // create a state for the admin which has logged in and pass it to follow up table 
  // also side bar(can use context)

  return (
    <>
      {/* <h1 className="text-2xl font-semibold mb-4">Welcome, {admin.name} 👋</h1> // uncomment after db is created */}
      <FollowUpTable/>
    </>
  );
};

export default Page;