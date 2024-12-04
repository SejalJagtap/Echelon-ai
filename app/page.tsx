'use client'
import Image from "next/image";
import { VideoScreen } from "./components/VideoScreen";
import { Instructions } from "./components/IntructionPanel";
import { Navbar } from "./components/Navbar";
import { PermissionPanel } from "./components/PermissionPanel";
import { useState } from "react"

export default function Home() {
  const [showPermissionPanel, setShowPermissionPanel] = useState<boolean>(false)

  const handleStartClick = () => {
    setShowPermissionPanel(true)
  }
  return (
    <div className="flex flex-col justify-center min-h-screen font-[family-name:var(--font-geist-sans)]">
      <Navbar></Navbar>
      <main className="lg:flex p-24">
        <VideoScreen hasPermission />
        {showPermissionPanel ? <PermissionPanel /> : <Instructions onStart={handleStartClick} />}


      </main>

    </div>
  );
}
