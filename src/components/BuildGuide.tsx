import React from 'react';
import { Smartphone, CheckCircle, Terminal, Cpu, PlayCircle, Settings, FileCheck } from 'lucide-react';

export const BuildGuide: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-200">
        <h2 className="text-2xl font-bold text-white mb-2">Android Studio Step-by-Step Build & Installation Guide</h2>
        <p className="text-sm text-slate-400">
          Follow these simple steps to compile, deploy, and enable the <strong>AutoTyper Keyboard</strong> on any Android device or emulator.
        </p>
      </div>

      {/* Step Cards */}
      <div className="space-y-6">
        
        {/* Step 1 */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 text-slate-200 flex items-start space-x-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-base shrink-0">
            1
          </div>
          <div className="space-y-2 flex-1">
            <h3 className="font-bold text-lg text-white">Download & Extract Project</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Click the <strong>Export Android Project (.ZIP)</strong> button at the top right of this app to download <code className="text-indigo-300">AutoTyperKeyboard_AndroidProject.zip</code>.
            </p>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-400 font-mono">
              Unzip AutoTyperKeyboard_AndroidProject.zip into your workspace directory.
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 text-slate-200 flex items-start space-x-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-base shrink-0">
            2
          </div>
          <div className="space-y-2 flex-1">
            <h3 className="font-bold text-lg text-white">Open in Android Studio & Gradle Sync</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Launch Android Studio (Hedgehog 2023.1.1 or newer recommended) and select <strong>Open...</strong>. Navigate to the extracted <code className="text-indigo-300">AutoTyperKeyboard</code> folder.
            </p>
            <ul className="list-disc list-inside text-xs text-slate-400 space-y-1 pl-1">
              <li>Android Studio will automatically detect Kotlin 1.9+ and Gradle 8.4+.</li>
              <li>Allow Gradle to sync dependencies (<code className="text-slate-300">androidx.core:core-ktx</code>, <code className="text-slate-300">material:1.11.0</code>, <code className="text-slate-300">kotlinx-coroutines</code>).</li>
            </ul>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 text-slate-200 flex items-start space-x-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-base shrink-0">
            3
          </div>
          <div className="space-y-2 flex-1">
            <h3 className="font-bold text-lg text-white">Compile & Deploy to Android Device / Emulator</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Connect a physical Android phone via USB debugging or start an Android Virtual Device (AVD) running API 24 (Android 7.0) or higher.
            </p>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono">
              Click Run 'app' (Shift + F10 or green Play button) in Android Studio.
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 text-slate-200 flex items-start space-x-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-base shrink-0">
            4
          </div>
          <div className="space-y-2 flex-1">
            <h3 className="font-bold text-lg text-white">Enable AutoTyper Keyboard in Android System Settings</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Once installed, open the <strong>AutoTyper Keyboard</strong> app on your Android device:
            </p>
            <ol className="list-decimal list-inside text-xs text-slate-300 space-y-1.5 pl-1">
              <li>Tap <strong>1. Enable IME</strong> button. Android Settings will open under <em>System &gt; Languages &amp; Input &gt; On-screen keyboard</em>.</li>
              <li>Toggle <strong>AutoTyper Automated Keyboard</strong> to <strong>ON</strong>.</li>
              <li>Return to the app and tap <strong>2. Select IME</strong> button to choose AutoTyper Keyboard as your active input method.</li>
            </ol>
          </div>
        </div>

        {/* Step 5 */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 text-slate-200 flex items-start space-x-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-base shrink-0">
            5
          </div>
          <div className="space-y-2 flex-1">
            <h3 className="font-bold text-lg text-white">Test Auto-Typing in Any App</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Open any app containing a text field (e.g. WhatsApp, Google Keep, Notes, Browser, or the testing box in MainActivity):
            </p>
            <ul className="list-disc list-inside text-xs text-slate-300 space-y-1 pl-1">
              <li>Tap inside any text field so the AutoTyper Keyboard appears.</li>
              <li>Tap the green <strong>Start</strong> button on the keyboard toolbar.</li>
              <li>Watch as text is injected character-by-character into the active field!</li>
            </ul>
          </div>
        </div>

      </div>

      {/* Security & Verification Card */}
      <div className="bg-indigo-950/40 border border-indigo-800/60 rounded-2xl p-6 text-indigo-200 space-y-2">
        <h4 className="font-bold text-white flex items-center space-x-2 text-base">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span>Standalone & Zero External Dependencies Guarantee</span>
        </h4>
        <p className="text-xs text-indigo-200 leading-relaxed">
          This Android Studio project relies 100% on standard Android SDK libraries (<code className="text-white">androidx.appcompat</code>, <code className="text-white">google.material</code>, <code className="text-white">kotlinx.coroutines</code>). It requires <strong>no internet access</strong>, no cloud APIs, no ads, no telemetry, and no root permissions.
        </p>
      </div>

    </div>
  );
};
