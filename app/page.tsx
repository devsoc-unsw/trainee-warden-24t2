"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  // Set it to go to keyword home page for now
  // We can edit this tsx files and create a home page to access different games if we have time
  useEffect(() => {
    router.push("/keyword");
  }, []);

  return null;
}