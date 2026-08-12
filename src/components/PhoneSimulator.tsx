import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Settings, RefreshCw, Terminal, CheckCircle2, Sparkles, Wifi, Battery, Volume2 } from 'lucide-react';
import { AutoTyperSettings } from '../types';

export const PhoneSimulator: React.FC = () => {
  // Settings state matching SharedPreferences
  const [settings, setSettings] = useState<AutoTyperSettings>({
    text: "Welcome to AutoTyper Keyboard! This text is being typed automatically character by character using Android's InputMethodService.",
    speedMs: 100,
    randomPauses: true,
    typoSimulation: true,
  });

  // Saved feedback message
  const [saveMessage, setSaveMessage] = useState(false);

  // Phone screen tab: 'main_app' | 'test_target'
  const [activePhoneTab, setActivePhoneTab] = useState<'main_app' | 'test_target'>('test_target');

  // Input connection target text inside phone simulator
  const [targetText, setTargetText] = useState('');

  // Typing engine state
  const [isTyping, setIsTyping] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [statusText, setStatusText] = useState('Ready to type');
  const [progressPercent, setProgressPercent] = useState(0);

  // Debug log output showing exact InputConnection events
  const [logs, setLogs] = useState<Array<{ id: number; message: string; type: 'commit' | 'delete' | 'pause' | 'status' }>>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Ref to store typing timeout handle
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(isTyping);
  const isPausedRef = useRef(isPaused);
  const currentIndexRef = useRef(currentIndex);

  isTypingRef.current = isTyping;
  isPausedRef.current = isPaused;
  currentIndexRef.current = currentIndex;

  const addLog = (message: string, type: 'commit' | 'delete' | 'pause' | 'status') => {
    setLogs((prev) => [...prev.slice(-40), { id: Date.now() + Math.random(), message, type }]);
  };

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Handle Save Settings click
  const handleSaveSettings = () => {
    setSaveMessage(true);
    addLog(`SharedPreferences updated: speed=${settings.speedMs}ms, pause=${settings.randomPauses}, typo=${settings.typoSimulation}`, 'status');
    setTimeout(() => setSaveMessage(false), 2000);
  };

  // Preset text options
  const setPresetText = (preset: string) => {
    setSettings((prev) => ({ ...prev, text: preset }));
  };

  // Keyboard controls
  const handleStartTyping = () => {
    if (settings.text.length === 0) {
      setStatusText('Error: No text saved');
      return;
    }

    setIsTyping(true);
    setIsPaused(false);
    setCurrentIndex(0);
    setTargetText('');
    setStatusText('Typing started...');
    setProgressPercent(0);
    addLog(`TypingEngine.startTyping(textLength=${settings.text.length}, speedMs=${settings.speedMs})`, 'status');

    runTypingStep(0, '');
  };

  const handlePauseResume = () => {
    if (!isTyping) return;
    if (isPaused) {
      setIsPaused(false);
      setStatusText('Resuming typing...');
      addLog('TypingEngine: Resumed', 'status');
      runTypingStep(currentIndexRef.current, targetText);
    } else {
      setIsPaused(true);
      setStatusText('Paused');
      if (timerRef.current) clearTimeout(timerRef.current);
      addLog('TypingEngine: Paused', 'pause');
    }
  };

  const handleStopTyping = () => {
    setIsTyping(false);
    setIsPaused(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    setStatusText('Stopped');
    addLog('TypingEngine: Stopped by user', 'status');
  };

  // Core typing step function mimicking Kotlin TypingEngine
  const runTypingStep = (idx: number, currentStr: string) => {
    if (!isTypingRef.current || isPausedRef.current) return;

    const fullText = settings.text;
    if (idx >= fullText.length) {
      setIsTyping(false);
      setStatusText('Typing Finished!');
      setProgressPercent(100);
      addLog('TypingEngine: Finished typing all characters', 'status');
      return;
    }

    const charToType = fullText[idx];
    const isLetter = /[a-zA-Z]/.test(charToType);
    const shouldSimulateTypo = settings.typoSimulation && isLetter && Math.random() < 0.12;

    if (shouldSimulateTypo) {
      // Simulate typo
      const wrongChars = 'qwertyuiopasdfghjklzxcvbnm';
      const wrongChar = wrongChars[Math.floor(Math.random() * wrongChars.length)];
      
      setStatusText(`Typo simulated: '${wrongChar}' -> '${charToType}'`);
      addLog(`commitText("${wrongChar}", 1) [TYPO]`, 'commit');

      // 1. Commit typo
      setTargetText(currentStr + wrongChar);

      // 2. Schedule backspace and correct insertion
      timerRef.current = setTimeout(() => {
        if (!isTypingRef.current || isPausedRef.current) return;

        addLog(`deleteSurroundingText(1, 0) [BACKSPACE]`, 'delete');
        setTargetText(currentStr); // Backspacing

        timerRef.current = setTimeout(() => {
          if (!isTypingRef.current || isPausedRef.current) return;

          addLog(`commitText("${charToType}", 1) [CORRECT]`, 'commit');
          const updatedStr = currentStr + charToType;
          setTargetText(updatedStr);

          finishStep(idx, updatedStr);
        }, 120);
      }, settings.speedMs + 40);

    } else {
      // Standard commitText
      const updatedStr = currentStr + charToType;
      setTargetText(updatedStr);
      addLog(`commitText("${charToType === '\n' ? '\\n' : charToType}", 1)`, 'commit');

      finishStep(idx, updatedStr);
    }
  };

  const finishStep = (idx: number, updatedStr: string) => {
    const nextIdx = idx + 1;
    setCurrentIndex(nextIdx);
    
    const pct = Math.round((nextIdx / settings.text.length) * 100);
    setProgressPercent(pct);
    setStatusText(`Typing: ${nextIdx} / ${settings.text.length} chars (${pct}%)`);

    // Calculate delay
    let delay = settings.speedMs + Math.floor(Math.random() * 30 - 15);
    delay = Math.max(30, delay);

    // Random pauses
    const charToType = settings.text[idx];
    if (settings.randomPauses) {
      if (['.', '!', '?', ',', '\n'].includes(charToType)) {
        delay += Math.floor(Math.random() * 400 + 300);
        addLog(`Pause delay added on punctuation '${charToType}'`, 'pause');
      } else if (charToType === ' ' && Math.random() < 0.15) {
        delay += Math.floor(Math.random() * 250 + 100);
      }
    }

    timerRef.current = setTimeout(() => {
      runTypingStep(nextIdx, updatedStr);
    }, delay);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Intro banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 mb-8 text-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-sm mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Interactive IME Execution Sandbox</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Live Android AutoTyper Simulator</h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Test how the Kotlin <code className="text-indigo-300">AutoTyperKeyboardService</code> and <code className="text-indigo-300">TypingEngine</code> perform character-by-character text injection via Android's <code className="text-indigo-300">InputConnection</code> in real time.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActivePhoneTab('main_app')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${
                activePhoneTab === 'main_app'
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              Main App Config Screen
            </button>
            <button
              onClick={() => setActivePhoneTab('test_target')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${
                activePhoneTab === 'test_target'
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              IME Keyboard In Action
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Virtual Android Device Frame */}
        <div className="lg:col-span-6 flex justify-center">
          
          <div className="w-full max-w-[390px] bg-slate-950 rounded-[44px] p-4 shadow-2xl border-4 border-slate-800 relative">
            
            {/* Phone Notch / Speaker */}
            <div className="w-32 h-5 bg-slate-900 rounded-b-2xl mx-auto flex items-center justify-center mb-2 z-20 relative">
              <div className="w-10 h-1 bg-slate-800 rounded-full" />
            </div>

            {/* Android Status Bar */}
            <div className="flex items-center justify-between px-4 py-1 text-[11px] font-semibold text-slate-400">
              <span>9:41</span>
              <div className="flex items-center space-x-1.5">
                <Wifi className="w-3 h-3" />
                <Volume2 className="w-3 h-3" />
                <Battery className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Android Screen Container */}
            <div className="bg-slate-900 rounded-[28px] overflow-hidden min-h-[580px] flex flex-col justify-between border border-slate-800 relative">
              
              {/* Screen Top Bar */}
              <div className="bg-indigo-950/80 border-b border-indigo-900/50 p-3.5 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-xs text-white">AutoTyper Keyboard</h3>
                  <p className="text-[10px] text-indigo-300">com.autotyper.keyboard</p>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => setActivePhoneTab('main_app')}
                    className={`px-2 py-1 text-[10px] rounded font-medium ${
                      activePhoneTab === 'main_app' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    App UI
                  </button>
                  <button
                    onClick={() => setActivePhoneTab('test_target')}
                    className={`px-2 py-1 text-[10px] rounded font-medium ${
                      activePhoneTab === 'test_target' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Target Field
                  </button>
                </div>
              </div>

              {/* Screen Body */}
              <div className="p-4 flex-1 overflow-y-auto space-y-4">
                
                {activePhoneTab === 'main_app' ? (
                  /* MainActivity UI View */
                  <div className="space-y-3.5 text-slate-200 text-xs">
                    
                    {/* Header Card */}
                    <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                      <div className="font-bold text-slate-100 mb-0.5">Settings & Text Manager</div>
                      <div className="text-[11px] text-emerald-400 font-medium">✓ IME Service Registered in Android</div>
                    </div>

                    {/* Presets */}
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">Quick Text Presets:</label>
                      <div className="flex flex-wrap gap-1">
                        <button
                          onClick={() => setPresetText("Hello World! This is a quick test of AutoTyper Keyboard.")}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-[10px] text-slate-300"
                        >
                          Short Greeting
                        </button>
                        <button
                          onClick={() => setPresetText("Automated input methods allow fast typing without accessibility services.")}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-[10px] text-slate-300"
                        >
                          Technical Note
                        </button>
                      </div>
                    </div>

                    {/* Text Box */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[11px] font-semibold text-slate-300">Saved Typing Text:</label>
                        <span className="text-[10px] text-indigo-400 font-mono">{settings.text.length} chars</span>
                      </div>
                      <textarea
                        value={settings.text}
                        onChange={(e) => setSettings({ ...settings, text: e.target.value })}
                        className="w-full h-24 bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
                        placeholder="Type text to save..."
                      />
                    </div>

                    {/* Controls */}
                    <div className="bg-slate-800/50 p-3 rounded-xl space-y-3 border border-slate-700/50">
                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="font-semibold text-slate-300">Typing Speed Delay:</span>
                          <span className="text-indigo-400 font-bold">{settings.speedMs} ms / char</span>
                        </div>
                        <input
                          type="range"
                          min="50"
                          max="300"
                          step="10"
                          value={settings.speedMs}
                          onChange={(e) => setSettings({ ...settings, speedMs: Number(e.target.value) })}
                          className="w-full accent-indigo-500 h-1 bg-slate-700 rounded-lg cursor-pointer"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-slate-300">Random Pauses</span>
                        <input
                          type="checkbox"
                          checked={settings.randomPauses}
                          onChange={(e) => setSettings({ ...settings, randomPauses: e.target.checked })}
                          className="w-4 h-4 accent-indigo-600 rounded"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-300">Typo Simulation</span>
                        <input
                          type="checkbox"
                          checked={settings.typoSimulation}
                          onChange={(e) => setSettings({ ...settings, typoSimulation: e.target.checked })}
                          className="w-4 h-4 accent-indigo-600 rounded"
                        />
                      </div>
                    </div>

                    {/* Save Button */}
                    <button
                      onClick={handleSaveSettings}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow transition-colors flex items-center justify-center space-x-1 text-xs"
                    >
                      {saveMessage ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                          <span>Saved to SharedPreferences!</span>
                        </>
                      ) : (
                        <span>Save Settings</span>
                      )}
                    </button>

                  </div>
                ) : (
                  /* Test Target Input View */
                  <div className="space-y-3 text-slate-200">
                    <div className="bg-indigo-950/40 p-3 rounded-xl border border-indigo-800/40 text-[11px]">
                      <span className="font-semibold text-indigo-300">Active Input Focus: </span>
                      <span className="text-slate-300">Messages App Target Field</span>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[11px] font-semibold text-slate-400">Received Input Stream:</label>
                        <button
                          onClick={() => setTargetText('')}
                          className="text-[10px] text-slate-400 hover:text-white flex items-center space-x-0.5"
                        >
                          <RefreshCw className="w-2.5 h-2.5" />
                          <span>Clear</span>
                        </button>
                      </div>
                      <div className="w-full min-h-[140px] bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white font-mono break-words shadow-inner relative">
                        {targetText ? (
                          <span>{targetText}<span className="animate-pulse font-bold text-indigo-400">|</span></span>
                        ) : (
                          <span className="text-slate-600 italic">Focused input field waiting for AutoTyper Keyboard IME...</span>
                        )}
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-400 bg-slate-800/40 p-2.5 rounded-lg border border-slate-800">
                      💡 Click <strong>Start</strong> on the keyboard panel below to trigger <code className="text-indigo-300">currentInputConnection.commitText()</code>.
                    </div>
                  </div>
                )}

              </div>

              {/* Bottom Fixed Component: Virtual AutoTyper IME Keyboard View */}
              <div className="bg-slate-950 border-t border-slate-800 p-3 text-slate-100 shadow-xl">
                
                {/* Keyboard Header / Progress */}
                <div className="flex items-center justify-between text-[11px] mb-1 font-sans">
                  <span className="font-bold text-indigo-300 truncate max-w-[200px]">{statusText}</span>
                  <span className="text-slate-400 font-mono text-[10px]">{progressPercent}%</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-2.5">
                  <div
                    className="bg-indigo-500 h-full transition-all duration-150"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* Keyboard Control Toolbar */}
                <div className="grid grid-cols-4 gap-1.5 mb-2">
                  <button
                    onClick={handleStartTyping}
                    disabled={isTyping && !isPaused}
                    className={`py-1.5 rounded text-[11px] font-bold flex items-center justify-center space-x-1 transition-colors ${
                      isTyping && !isPaused
                        ? 'bg-slate-800 text-slate-600'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Start</span>
                  </button>

                  <button
                    onClick={handlePauseResume}
                    disabled={!isTyping}
                    className={`py-1.5 rounded text-[11px] font-bold flex items-center justify-center space-x-1 transition-colors ${
                      !isTyping
                        ? 'bg-slate-800 text-slate-600'
                        : 'bg-amber-600 hover:bg-amber-500 text-white'
                    }`}
                  >
                    <Pause className="w-3 h-3 fill-current" />
                    <span>{isPaused ? 'Resume' : 'Pause'}</span>
                  </button>

                  <button
                    onClick={handleStopTyping}
                    disabled={!isTyping}
                    className={`py-1.5 rounded text-[11px] font-bold flex items-center justify-center space-x-1 transition-colors ${
                      !isTyping
                        ? 'bg-slate-800 text-slate-600'
                        : 'bg-rose-600 hover:bg-rose-500 text-white'
                    }`}
                  >
                    <Square className="w-3 h-3 fill-current" />
                    <span>Stop</span>
                  </button>

                  <button
                    onClick={() => setActivePhoneTab('main_app')}
                    className="py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] font-bold flex items-center justify-center"
                    title="Open Main App Settings"
                  >
                    <Settings className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Quick Action Key Row */}
                <div className="flex space-x-1 text-[10px]">
                  <button
                    onClick={() => {
                      setTargetText((prev) => prev + ' ');
                      addLog('commitText(" ", 1) [MANUAL SPACE]', 'commit');
                    }}
                    className="flex-1 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 font-semibold"
                  >
                    SPACE
                  </button>
                  <button
                    onClick={() => {
                      setTargetText((prev) => prev.slice(0, -1));
                      addLog('deleteSurroundingText(1, 0) [MANUAL BACKSPACE]', 'delete');
                    }}
                    className="w-12 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 font-semibold"
                  >
                    ⌫
                  </button>
                  <button
                    onClick={() => {
                      setTargetText((prev) => prev + '\n');
                      addLog('commitText("\\n", 1) [MANUAL ENTER]', 'commit');
                    }}
                    className="w-16 py-1 bg-indigo-700 hover:bg-indigo-600 rounded text-white font-semibold"
                  >
                    ENTER
                  </button>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Right Column: Live InputConnection Event Logs */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-200 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Terminal className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-lg text-white">InputConnection Call Monitor</h3>
              </div>
              <button
                onClick={() => setLogs([])}
                className="text-xs text-slate-400 hover:text-white"
              >
                Clear Log
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-3">
              Monitors low-level calls sent from Kotlin's <code className="text-indigo-300">TypingEngine</code> to Android's <code className="text-indigo-300">InputConnection</code> interface:
            </p>

            <div
              ref={logContainerRef}
              className="bg-slate-950 rounded-xl p-4 h-[380px] overflow-y-auto font-mono text-xs space-y-1.5 border border-slate-800/80 shadow-inner"
            >
              {logs.length === 0 ? (
                <div className="text-slate-600 italic py-12 text-center">
                  No InputConnection calls recorded yet. Click "Start" on the keyboard simulator to initiate typing.
                </div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="flex items-start space-x-2">
                    <span className="text-slate-600 select-none text-[10px]">
                      {new Date(log.id).toLocaleTimeString()}
                    </span>
                    <span
                      className={`font-medium ${
                        log.type === 'commit'
                          ? 'text-emerald-400'
                          : log.type === 'delete'
                          ? 'text-rose-400'
                          : log.type === 'pause'
                          ? 'text-amber-400'
                          : 'text-indigo-300'
                      }`}
                    >
                      {log.message}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Engine Summary Card */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Engine Configuration Highlights</span>
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Speed Range</span>
                <span className="font-bold text-slate-200">50ms – 300ms per char</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Storage Engine</span>
                <span className="font-bold text-slate-200">Android SharedPreferences</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Typo Backspacing</span>
                <span className="font-bold text-slate-200">deleteSurroundingText(1, 0)</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Thread Management</span>
                <span className="font-bold text-slate-200">Kotlin Coroutines (SupervisorJob)</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
