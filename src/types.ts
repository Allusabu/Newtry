export interface ProjectFile {
  path: string;
  name: string;
  category: 'kotlin' | 'xml' | 'gradle' | 'manifest';
  description: string;
  content: string;
}

export interface AutoTyperSettings {
  text: string;
  speedMs: number;
  randomPauses: boolean;
  typoSimulation: boolean;
}

export interface TypingState {
  isTyping: boolean;
  isPaused: boolean;
  currentIndex: number;
  totalLength: number;
  statusText: string;
  currentTypedText: string;
  typoChar: string | null;
}
