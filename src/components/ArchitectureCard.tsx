import React from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, Cpu, Zap, Code2, Layers } from 'lucide-react';

export const ArchitectureCard: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Hero Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-200">
        <div className="flex items-center space-x-3 text-indigo-400 font-semibold text-sm mb-2">
          <ShieldCheck className="w-5 h-5" />
          <span>Android Input Method Editor (IME) Architecture</span>
        </div>
        <h2 className="text-2xl font-bold text-white">Why Standard InputMethodService is 100% Safe</h2>
        <p className="text-sm text-slate-400 mt-2 leading-relaxed">
          The <strong>AutoTyper Keyboard</strong> is engineered as a standard Android Input Method Editor (IME). Unlike dangerous accessibility overlays or gesture injection hacks, standard IMEs insert text strictly through the system <code className="text-indigo-300">InputConnection</code> when explicitly chosen by the user.
        </p>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Recommended: InputMethodService */}
        <div className="bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-6 space-y-4">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="text-lg text-white">InputMethodService (Used Here)</h3>
          </div>
          
          <ul className="space-y-3 text-xs text-slate-300">
            <li className="flex items-start space-x-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Explicit User Selection:</strong> Activated only when the user chooses it as their active system keyboard.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>InputConnection Protocol:</strong> Uses <code className="text-emerald-300 font-mono">commitText(...)</code> and <code className="text-emerald-300 font-mono">deleteSurroundingText(...)</code> to send text directly to the focused input view.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Google Play Compliant:</strong> 100% compliant with Google Play policy. No special dangerous permission declarations required.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Zero Overlay Risks:</strong> Cannot read or control other apps without user focus.</span>
            </li>
          </ul>
        </div>

        {/* Banned Hacks: AccessibilityService & Overlays */}
        <div className="bg-slate-900/90 border border-rose-500/30 rounded-2xl p-6 space-y-4">
          <div className="flex items-center space-x-2 text-rose-400 font-bold">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-lg text-white">Forbidden Automation Hacks</h3>
          </div>

          <ul className="space-y-3 text-xs text-slate-400">
            <li className="flex items-start space-x-2">
              <span className="text-rose-400 font-bold">•</span>
              <span><strong>AccessibilityService:</strong> Exploiting accessibility APIs for automation gets apps banned on Google Play.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-rose-400 font-bold">•</span>
              <span><strong>UiAutomation / Instrumentation:</strong> Works only in root/testing environments, fails on consumer devices.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-rose-400 font-bold">•</span>
              <span><strong>System Overlays &amp; Click Injectors:</strong> Violate Android security sandbox and trigger malware warnings.</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Execution Flow Diagram */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 text-slate-200">
        <h3 className="font-bold text-lg text-white flex items-center space-x-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          <span>Execution Lifecycle Sequence</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center text-xs">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="font-bold text-indigo-400 mb-1">1. User Inputs Text</div>
            <div className="text-slate-400 text-[11px]">Saved into SharedPreferences in MainActivity.</div>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="font-bold text-indigo-400 mb-1">2. IME Onscreen</div>
            <div className="text-slate-400 text-[11px]">AutoTyperKeyboardService inflates keyboard_view.xml.</div>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="font-bold text-indigo-400 mb-1">3. Start Pressed</div>
            <div className="text-slate-400 text-[11px]">TypingEngine launches Coroutine loop with delay &amp; typo simulation.</div>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="font-bold text-indigo-400 mb-1">4. Text Committed</div>
            <div className="text-slate-400 text-[11px]">InputConnection inserts chars character-by-character.</div>
          </div>
        </div>
      </div>

    </div>
  );
};
