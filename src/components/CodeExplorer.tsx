import React, { useState } from 'react';
import { FileCode, Copy, Check, Download, Folder, FileText, ChevronRight, Search } from 'lucide-react';
import { androidProjectFiles } from '../data/androidProjectFiles';
import { ProjectFile } from '../types';

export const CodeExplorer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<ProjectFile>(
    androidProjectFiles.find((f) => f.name.includes('AutoTyperKeyboardService')) || androidProjectFiles[0]
  );
  const [activeCategory, setActiveCategory] = useState<'all' | 'kotlin' | 'xml' | 'gradle' | 'manifest'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const filteredFiles = androidProjectFiles.filter((file) => {
    const matchesCategory = activeCategory === 'all' || file.category === activeCategory;
    const matchesSearch =
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.path.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingleFile = () => {
    const blob = new Blob([selectedFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = selectedFile.name.split(' ')[0];
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Android Studio Source Code Explorer</h2>
          <p className="text-sm text-slate-400 mt-1">
            Complete Android Studio Kotlin codebase adhering 100% to project structure, Android InputMethodService specs, and Material 3 design.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
          {(['all', 'kotlin', 'xml', 'gradle', 'manifest'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* File Tree Sidebar */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter files..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="text-xs font-bold text-slate-400 tracking-wider uppercase px-1">
            Project Files ({filteredFiles.length})
          </div>

          {/* File list */}
          <div className="space-y-1 max-h-[560px] overflow-y-auto pr-1">
            {filteredFiles.map((file) => {
              const isSelected = selectedFile.path === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between group ${
                    isSelected
                      ? 'bg-indigo-600/20 text-white border border-indigo-500/40'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <FileCode
                      className={`w-4 h-4 shrink-0 ${
                        file.category === 'kotlin'
                          ? 'text-purple-400'
                          : file.category === 'xml'
                          ? 'text-amber-400'
                          : file.category === 'gradle'
                          ? 'text-emerald-400'
                          : 'text-indigo-400'
                      }`}
                    />
                    <div className="truncate">
                      <div className="font-semibold truncate">{file.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono truncate">{file.path}</div>
                    </div>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${isSelected ? 'text-indigo-400 translate-x-0.5' : 'text-slate-600 opacity-0 group-hover:opacity-100'}`} />
                </button>
              );
            })}
          </div>

        </div>

        {/* Code Viewer Main Panel */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          
          {/* File Title Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs text-indigo-400 font-semibold bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800/60">
                  {selectedFile.path}
                </span>
                <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                  [{selectedFile.category}]
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1.5">{selectedFile.description}</p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={handleCopyCode}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors border border-slate-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>

              <button
                onClick={handleDownloadSingleFile}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save File</span>
              </button>
            </div>
          </div>

          {/* Syntax Highlighted Code Window */}
          <div className="bg-slate-950 rounded-xl p-4 overflow-x-auto border border-slate-800/80 font-mono text-xs text-slate-200 leading-relaxed shadow-inner max-h-[560px]">
            <pre>
              <code>{selectedFile.content}</code>
            </pre>
          </div>

        </div>

      </div>
    </div>
  );
};
