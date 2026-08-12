import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { PhoneSimulator } from './components/PhoneSimulator';
import { CodeExplorer } from './components/CodeExplorer';
import { BuildGuide } from './components/BuildGuide';
import { ArchitectureCard } from './components/ArchitectureCard';

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'code' | 'guide' | 'architecture'>('simulator');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Header & Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'simulator' && <PhoneSimulator />}
        {activeTab === 'code' && <CodeExplorer />}
        {activeTab === 'guide' && <BuildGuide />}
        {activeTab === 'architecture' && <ArchitectureCard />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            AutoTyper Keyboard — Complete Android Studio Kotlin IME Project
          </div>
          <div className="text-slate-600">
            Powered by Android SDK InputMethodService &amp; Coroutines
          </div>
        </div>
      </footer>

    </div>
  );
}
