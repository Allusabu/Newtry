import JSZip from 'jszip';
import { androidProjectFiles } from '../data/androidProjectFiles';

/**
 * Generates and downloads a complete .zip archive of the Android Studio project.
 */
export async function downloadAndroidProjectZip(
  onProgress?: (percent: number) => void
): Promise<void> {
  const zip = new JSZip();

  // Root folder inside the zip
  const root = zip.folder('AutoTyperKeyboard');
  if (!root) throw new Error('Failed to create zip folder');

  // Add all Android project files
  androidProjectFiles.forEach((file) => {
    root.file(file.path, file.content);
  });

  // Generate README.md with build instructions
  root.file(
    'README.md',
    `# AutoTyper Keyboard - Android Studio Project

An automated Input Method Editor (IME) keyboard for Android built in Kotlin using standard \`InputMethodService\`.

## Features
1. **Main App Configuration**: Input custom text, set speed (50ms–300ms), toggle random pauses and typo simulation, save via SharedPreferences.
2. **InputMethodService Keyboard**: Custom keyboard view with Start, Stop, Pause/Resume, progress bar, and status indicators.
3. **Typing Engine**: Automated character-by-character insertion using \`currentInputConnection.commitText(...)\`.
4. **Typo Simulation**: Occasional typo insertion, backspace using \`deleteSurroundingText()\`, and correction.
5. **100% Google Play Safe**: No AccessibilityService, overlays, or gesture injection required.

## How to Build & Run in Android Studio

1. Open **Android Studio** (Hedgehog 2023.1.1 or newer recommended).
2. Select **Open** and select the \`AutoTyperKeyboard\` project folder.
3. Wait for **Gradle Sync** to finish.
4. Connect an Android device or start an Emulator (Android 7.0+ / API 24+).
5. Click **Run 'app'** (\`Shift + F10\`).

## Enabling the Keyboard on Android

1. Open the installed **AutoTyper Keyboard** app on your phone.
2. Tap **1. Enable IME** -> Toggle **AutoTyper Automated Keyboard** ON in System Settings.
3. Tap **2. Select IME** -> Select **AutoTyper Automated Keyboard** as active keyboard.
4. Open any app (Notes, Messaging, Browser), focus an input field, and tap **Start** on the keyboard toolbar!
`
  );

  // Generate blob
  const content = await zip.generateAsync({ type: 'blob' }, (metadata) => {
    if (onProgress) {
      onProgress(Math.round(metadata.percent));
    }
  });

  // Trigger browser download
  const url = URL.createObjectURL(content);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'AutoTyperKeyboard_AndroidProject.zip';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
