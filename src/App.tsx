import React, { useState } from "react";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import Workspace from "./components/Workspace";

export default function App() {
  const [currentView, setView] = useState<"landing" | "workspace">("landing");
  const [workspacePreset, setWorkspacePreset] = useState<string>("");

  const handleSetWorkspacePreset = (preset: string) => {
    setWorkspacePreset(preset);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of the sticky navbar approx
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="bg-[#0A0A0F] min-h-screen text-[#e4e1ed] font-sans antialiased overflow-x-hidden">
      {/* Sticky Top-Bar Navbar */}
      <Navbar 
        currentView={currentView} 
        setView={setView} 
        scrollToSection={scrollToSection} 
      />

      {/* Main View Renderer */}
      <main id="main-content">
        {currentView === "landing" ? (
          <LandingPage 
            setView={setView} 
            setWorkspacePreset={handleSetWorkspacePreset} 
          />
        ) : (
          <Workspace 
            presetName={workspacePreset} 
          />
        )}
      </main>
    </div>
  );
}
