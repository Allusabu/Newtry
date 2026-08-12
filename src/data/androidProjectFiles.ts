import { ProjectFile } from '../types';

/**
 * Complete Android Studio project files for "AutoTyper Keyboard".
 * Implemented in Kotlin using Android's standard InputMethodService (IME).
 */
export const androidProjectFiles: ProjectFile[] = [
  {
    path: 'AndroidManifest.xml',
    name: 'AndroidManifest.xml',
    category: 'manifest',
    description: 'Declares MainActivity and the AutoTyperKeyboardService as an Input Method Editor (IME).',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.autotyper.keyboard">

    <!-- 
        No sensitive permissions required! 
        This is a standard Android Input Method Editor (IME) service.
        Does NOT require Accessibility, Root, or Overlay permissions.
    -->

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.AutoTyperKeyboard">

        <!-- 
            Main Configuration Activity:
            Allows user to enter/paste text, set speed, toggles, and enable keyboard.
        -->
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:label="@string/app_name"
            android:theme="@style/Theme.AutoTyperKeyboard">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- 
            AutoTyper Input Method Service:
            Declares the custom keyboard service that Android recognizes as an IME.
            Requires android.permission.BIND_INPUT_METHOD to prevent unauthorized binding.
        -->
        <service
            android:name=".AutoTyperKeyboardService"
            android:exported="true"
            android:label="@string/keyboard_service_name"
            android:permission="android.permission.BIND_INPUT_METHOD">
            <intent-filter>
                <action android:name="android.view.InputMethod" />
            </intent-filter>

            <!-- Links to res/xml/method.xml defining keyboard metadata -->
            <meta-data
                android:name="android.view.im"
                android:resource="@xml/method" />
        </service>

    </application>

</manifest>`
  },
  {
    path: 'build.gradle.kts',
    name: 'build.gradle.kts (Root)',
    category: 'gradle',
    description: 'Top-level Gradle build configuration file.',
    content: `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    id("com.android.application") version "8.4.0" apply false
    id("org.jetbrains.kotlin.android") version "1.9.23" apply false
}`
  },
  {
    path: 'settings.gradle.kts',
    name: 'settings.gradle.kts',
    category: 'gradle',
    description: 'Gradle repository settings and module inclusions.',
    content: `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "AutoTyper Keyboard"
include(":app")`
  },
  {
    path: 'app/build.gradle.kts',
    name: 'app/build.gradle.kts',
    category: 'gradle',
    description: 'App module dependencies and Android SDK compile options.',
    content: `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.autotyper.keyboard"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.autotyper.keyboard"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
    kotlinOptions {
        jvmTarget = "1.8"
    }
    buildFeatures {
        viewBinding = true
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.13.0")
    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("com.google.android.material:material:1.11.0")
    implementation("androidx.constraintlayout:constraintlayout:2.1.4")
    
    // Kotlin Coroutines for async typing execution
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.8.0")
}`
  },
  {
    path: 'app/src/main/java/com/autotyper/keyboard/SettingsManager.kt',
    name: 'SettingsManager.kt',
    category: 'kotlin',
    description: 'Handles persistent storage of user settings using SharedPreferences.',
    content: `package com.autotyper.keyboard

import android.content.Context
import android.content.SharedPreferences

/**
 * SettingsManager
 * 
 * Provides centralized thread-safe reading and writing of persistent settings
 * using Android SharedPreferences. Used by both MainActivity and AutoTyperKeyboardService.
 */
class SettingsManager(context: Context) {

    private val prefs: SharedPreferences = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    companion object {
        private const val PREFS_NAME = "autotyper_preferences"
        private const val KEY_SAVED_TEXT = "key_saved_text"
        private const val KEY_TYPING_SPEED_MS = "key_typing_speed_ms"
        private const val KEY_RANDOM_PAUSES = "key_random_pauses"
        private const val KEY_TYPO_SIMULATION = "key_typo_simulation"

        // Default values
        const val DEFAULT_TEXT = "Hello! This is an automated typing test with AutoTyper Keyboard."
        const val DEFAULT_SPEED_MS = 100 // Default 100ms per character
        const val DEFAULT_RANDOM_PAUSES = true
        const val DEFAULT_TYPO_SIMULATION = true
    }

    /**
     * Save text entered by the user in the main app screen.
     */
    fun saveText(text: String) {
        prefs.edit().putString(KEY_SAVED_TEXT, text).apply()
    }

    /**
     * Retrieve stored typing text.
     */
    fun getText(): String {
        return prefs.getString(KEY_SAVED_TEXT, DEFAULT_TEXT) ?: DEFAULT_TEXT
    }

    /**
     * Save typing speed delay per character (50ms - 300ms).
     */
    fun saveSpeedMs(speedMs: Int) {
        // Clamp speed value between 50ms and 300ms
        val clampedSpeed = speedMs.coerceIn(50, 300)
        prefs.edit().putInt(KEY_TYPING_SPEED_MS, clampedSpeed).apply()
    }

    /**
     * Retrieve typing speed in milliseconds per character.
     */
    fun getSpeedMs(): Int {
        return prefs.getInt(KEY_TYPING_SPEED_MS, DEFAULT_SPEED_MS)
    }

    /**
     * Save whether natural random pauses are enabled.
     */
    fun saveRandomPauses(enabled: Boolean) {
        prefs.edit().putBoolean(KEY_RANDOM_PAUSES, enabled).apply()
    }

    /**
     * Retrieve random pauses setting state.
     */
    fun getRandomPauses(): Boolean {
        return prefs.getBoolean(KEY_RANDOM_PAUSES, DEFAULT_RANDOM_PAUSES)
    }

    /**
     * Save whether typo simulation & auto-correction is enabled.
     */
    fun saveTypoSimulation(enabled: Boolean) {
        prefs.edit().putBoolean(KEY_TYPO_SIMULATION, enabled).apply()
    }

    /**
     * Retrieve typo simulation setting state.
     */
    fun getTypoSimulation(): Boolean {
        return prefs.getBoolean(KEY_TYPO_SIMULATION, DEFAULT_TYPO_SIMULATION)
    }

    /**
     * Save all settings atomically in a single editor commit.
     */
    fun saveAll(text: String, speedMs: Int, randomPauses: Boolean, typoSimulation: Boolean) {
        prefs.edit()
            .putString(KEY_SAVED_TEXT, text)
            .putInt(KEY_TYPING_SPEED_MS, speedMs.coerceIn(50, 300))
            .putBoolean(KEY_RANDOM_PAUSES, randomPauses)
            .putBoolean(KEY_TYPO_SIMULATION, typoSimulation)
            .apply()
    }
}`
  },
  {
    path: 'app/src/main/java/com/autotyper/keyboard/TypingEngine.kt',
    name: 'TypingEngine.kt',
    category: 'kotlin',
    description: 'Core typing logic for committing text character-by-character into InputConnection.',
    content: `package com.autotyper.keyboard

import android.view.inputmethod.InputConnection
import kotlinx.coroutines.*
import kotlin.random.Random

/**
 * Interface callback to report progress and status updates back to the Keyboard Service UI.
 */
interface TypingEngineCallback {
    fun onProgress(current: Int, total: Int)
    fun onStatusChanged(statusText: String)
    fun onFinished()
    fun onError(errorMessage: String)
}

/**
 * TypingEngine
 * 
 * Manages character-by-character automated text injection via Android's InputConnection.
 * Supports realistic typing delay, random delays/pauses, and typo simulation with auto-correction.
 */
class TypingEngine {

    private var typingJob: Job? = null
    private val scope = CoroutineScope(Dispatchers.Main + SupervisorJob())

    @Volatile var isTyping: Boolean = false
        private set

    @Volatile var isPaused: Boolean = false
        private set

    private var currentIndex = 0
    private var textToType = ""
    private var speedMs = 100L
    private var enableRandomPauses = true
    private var enableTypoSimulation = true

    // QWERTY keyboard neighbor lookup map for realistic typo simulation
    private val qwertyNeighbors = mapOf(
        'a' to listOf('s', 'q', 'w', 'z'),
        'b' to listOf('v', 'g', 'h', 'n'),
        'c' to listOf('x', 'd', 'f', 'v'),
        'd' to listOf('s', 'e', 'r', 'f', 'c', 'x'),
        'e' to listOf('w', 's', 'd', 'r'),
        'f' to listOf('d', 'r', 't', 'g', 'v', 'c'),
        'g' to listOf('f', 't', 'y', 'h', 'b', 'v'),
        'h' to listOf('g', 'y', 'u', 'j', 'n', 'b'),
        'i' to listOf('u', 'j', 'k', 'o'),
        'j' to listOf('h', 'u', 'i', 'k', 'm', 'n'),
        'k' to listOf('j', 'i', 'o', 'l', 'm'),
        'l' to listOf('k', 'o', 'p'),
        'm' to listOf('n', 'j', 'k'),
        'n' to listOf('b', 'h', 'j', 'm'),
        'o' to listOf('i', 'k', 'l', 'p'),
        'p' to listOf('o', 'l'),
        'q' to listOf('w', 'a'),
        'r' to listOf('e', 'd', 'f', 't'),
        's' to listOf('a', 'w', 'e', 'd', 'x', 'z'),
        't' to listOf('r', 'f', 'g', 'y'),
        'u' to listOf('y', 'h', 'j', 'i'),
        'v' to listOf('c', 'f', 'g', 'b'),
        'w' to listOf('q', 'a', 's', 'e'),
        'x' to listOf('z', 's', 'd', 'c'),
        'y' to listOf('t', 'g', 'h', 'u'),
        'z' to listOf('a', 's', 'x')
    )

    /**
     * Start or restart typing from the beginning.
     */
    fun startTyping(
        text: String,
        inputConnection: InputConnection?,
        speedMs: Long,
        enableRandomPauses: Boolean,
        enableTypoSimulation: Boolean,
        callback: TypingEngineCallback
    ) {
        if (inputConnection == null) {
            callback.onError("No active input field target found.")
            return
        }

        if (text.isEmpty()) {
            callback.onError("No text saved to type. Open main app to set text.")
            return
        }

        stopTyping() // Cancel any ongoing job

        this.textToType = text
        this.speedMs = speedMs.coerceIn(50L, 300L)
        this.enableRandomPauses = enableRandomPauses
        this.enableTypoSimulation = enableTypoSimulation
        this.currentIndex = 0
        this.isTyping = true
        this.isPaused = false

        callback.onStatusChanged("Typing started...")

        typingJob = scope.launch {
            try {
                while (currentIndex < textToType.length && isTyping) {
                    // Check for pause state
                    while (isPaused && isTyping) {
                        callback.onStatusChanged("Paused ($currentIndex/\${textToType.length})")
                        delay(200)
                    }

                    if (!isTyping) break

                    val targetChar = textToType[currentIndex]

                    // Decide whether to simulate a typo for letters
                    val simulateTypo = enableTypoSimulation && 
                            targetChar.isLetter() && 
                            Random.nextFloat() < 0.10f // 10% chance of typo on letters

                    if (simulateTypo) {
                        val wrongChar = getNearbyTypoChar(targetChar)
                        callback.onStatusChanged("Simulating typo: '$wrongChar' -> '$targetChar'")
                        
                        // 1. Commit typo character
                        inputConnection.commitText(wrongChar.toString(), 1)
                        delay(speedMs + Random.nextLong(20, 80))

                        // 2. Backspace / delete the wrong character
                        inputConnection.deleteSurroundingText(1, 0)
                        delay(120L + Random.nextLong(30, 90))

                        // 3. Commit the correct character
                        inputConnection.commitText(targetChar.toString(), 1)
                    } else {
                        // Standard character insertion via Android InputConnection
                        inputConnection.commitText(targetChar.toString(), 1)
                    }

                    currentIndex++
                    callback.onProgress(currentIndex, textToType.length)
                    callback.onStatusChanged("Typing: $currentIndex / \${textToType.length} chars")

                    // Calculate delay for next character
                    var currentDelay = speedMs + Random.nextLong(-15L, 15L)
                    currentDelay = currentDelay.coerceAtLeast(30L)

                    // Optional extra pause on punctuation or spaces
                    if (enableRandomPauses) {
                        if (targetChar in listOf('.', '!', '?', ',', '\n')) {
                            currentDelay += Random.nextLong(300L, 700L)
                        } else if (targetChar == ' ' && Random.nextFloat() < 0.15f) {
                            currentDelay += Random.nextLong(150L, 400L)
                        }
                    }

                    delay(currentDelay)
                }

                if (isTyping) {
                    isTyping = false
                    callback.onStatusChanged("Typing Complete! ($currentIndex/\${textToType.length})")
                    callback.onFinished()
                }

            } catch (e: CancellationException) {
                // Job was cancelled cleanly
            } catch (e: Exception) {
                isTyping = false
                callback.onError("Error during typing: \${e.localizedMessage}")
            }
        }
    }

    /**
     * Pause typing execution without resetting progress.
     */
    fun pauseTyping(callback: TypingEngineCallback) {
        if (isTyping && !isPaused) {
            isPaused = true
            callback.onStatusChanged("Paused ($currentIndex/\${textToType.length})")
        }
    }

    /**
     * Resume typing execution from current index.
     */
    fun resumeTyping(callback: TypingEngineCallback) {
        if (isTyping && isPaused) {
            isPaused = false
            callback.onStatusChanged("Resuming typing...")
        }
    }

    /**
     * Stop typing execution and reset state.
     */
    fun stopTyping() {
        isTyping = false
        isPaused = false
        typingJob?.cancel()
        typingJob = null
    }

    /**
     * Clean up coroutine scope when service is destroyed.
     */
    fun destroy() {
        stopTyping()
        scope.cancel()
    }

    /**
     * Finds a realistic nearby key on a QWERTY layout for typo simulation.
     */
    private fun getNearbyTypoChar(original: Char): Char {
        val lower = original.lowercaseChar()
        val neighbors = qwertyNeighbors[lower]
        val typoChar = if (!neighbors.isNullOrEmpty()) {
            neighbors.random()
        } else {
            ('a'..'z').random()
        }
        return if (original.isUpperCase()) typoChar.uppercaseChar() else typoChar
    }
}`
  },
  {
    path: 'app/src/main/java/com/autotyper/keyboard/AutoTyperKeyboardService.kt',
    name: 'AutoTyperKeyboardService.kt',
    category: 'kotlin',
    description: 'Custom InputMethodService handling keyboard layout lifecycle, UI controls, and text injection.',
    content: `package com.autotyper.keyboard

import android.content.Intent
import android.inputmethodservice.InputMethodService
import android.view.View
import android.view.inputmethod.EditorInfo
import android.widget.Button
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import com.google.android.material.button.MaterialButton

/**
 * AutoTyperKeyboardService
 * 
 * Android Input Method Editor (IME) implementation extending InputMethodService.
 * Renders the custom keyboard UI with Start, Stop, Pause/Resume buttons and progress tracking.
 * Inserts characters into any active app via currentInputConnection.
 */
class AutoTyperKeyboardService : InputMethodService(), TypingEngineCallback {

    private lateinit var settingsManager: SettingsManager
    private val typingEngine = TypingEngine()

    private var btnStart: Button? = null
    private var btnStop: Button? = null
    private var btnPauseResume: Button? = null
    private var btnSettings: MaterialButton? = null
    private var progressBar: ProgressBar? = null
    private var tvStatus: TextView? = null
    private var tvProgressCount: TextView? = null

    // Quick manual key buttons
    private var btnKeySpace: View? = null
    private var btnKeyBackspace: View? = null
    private var btnKeyEnter: View? = null

    override fun onCreate() {
        super.onCreate()
        settingsManager = SettingsManager(this)
    }

    /**
     * Inflates and returns the primary keyboard view layout.
     */
    override fun onCreateInputView(): View {
        val layout = layoutInflater.inflate(R.layout.keyboard_view, null)

        // Bind control buttons
        btnStart = layout.findViewById(R.id.btnStart)
        btnStop = layout.findViewById(R.id.btnStop)
        btnPauseResume = layout.findViewById(R.id.btnPauseResume)
        btnSettings = layout.findViewById(R.id.btnSettings)

        // Bind progress and status views
        progressBar = layout.findViewById(R.id.progressBar)
        tvStatus = layout.findViewById(R.id.tvStatus)
        tvProgressCount = layout.findViewById(R.id.tvProgressCount)

        // Bind quick keyboard action keys
        btnKeySpace = layout.findViewById(R.id.btnKeySpace)
        btnKeyBackspace = layout.findViewById(R.id.btnKeyBackspace)
        btnKeyEnter = layout.findViewById(R.id.btnKeyEnter)

        setupListeners()
        updateUIState()

        return layout
    }

    /**
     * Called whenever an input field gains focus and the keyboard becomes visible.
     */
    override fun onStartInputView(info: EditorInfo?, restarting: Boolean) {
        super.onStartInputView(info, restarting)
        // Refresh status when keyboard appears
        if (!typingEngine.isTyping) {
            val textLen = settingsManager.getText().length
            tvStatus?.text = "Ready to type $textLen characters"
            tvProgressCount?.text = "0 / $textLen"
            progressBar?.progress = 0
        }
    }

    /**
     * Setup click listeners for control buttons and quick typing keys.
     */
    private fun setupListeners() {
        // Start typing button
        btnStart?.setOnClickListener {
            val textToType = settingsManager.getText()
            val speedMs = settingsManager.getSpeedMs().toLong()
            val randomPauses = settingsManager.getRandomPauses()
            val typoSimulation = settingsManager.getTypoSimulation()

            typingEngine.startTyping(
                text = textToType,
                inputConnection = currentInputConnection,
                speedMs = speedMs,
                enableRandomPauses = randomPauses,
                enableTypoSimulation = typoSimulation,
                callback = this
            )
            updateUIState()
        }

        // Pause / Resume toggle button
        btnPauseResume?.setOnClickListener {
            if (typingEngine.isPaused) {
                typingEngine.resumeTyping(this)
            } else if (typingEngine.isTyping) {
                typingEngine.pauseTyping(this)
            }
            updateUIState()
        }

        // Stop typing button
        btnStop?.setOnClickListener {
            typingEngine.stopTyping()
            tvStatus?.text = "Stopped"
            progressBar?.progress = 0
            updateUIState()
        }

        // Settings button opens MainActivity
        btnSettings?.setOnClickListener {
            val intent = Intent(this, MainActivity::class.java).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            startActivity(intent)
        }

        // Manual Space Key
        btnKeySpace?.setOnClickListener {
            currentInputConnection?.commitText(" ", 1)
        }

        // Manual Backspace Key
        btnKeyBackspace?.setOnClickListener {
            currentInputConnection?.deleteSurroundingText(1, 0)
        }

        // Manual Enter Key
        btnKeyEnter?.setOnClickListener {
            currentInputConnection?.commitText("\n", 1)
        }
    }

    /**
     * Dynamically updates button states based on engine state.
     */
    private fun updateUIState() {
        val isTyping = typingEngine.isTyping
        val isPaused = typingEngine.isPaused

        btnStart?.isEnabled = !isTyping
        btnStop?.isEnabled = isTyping
        btnPauseResume?.isEnabled = isTyping

        if (isPaused) {
            btnPauseResume?.text = "Resume"
        } else {
            btnPauseResume?.text = "Pause"
        }
    }

    // --- TypingEngineCallback implementations ---

    override fun onProgress(current: Int, total: Int) {
        val percentage = if (total > 0) (current * 100) / total else 0
        progressBar?.progress = percentage
        tvProgressCount?.text = "$current / $total ($percentage%)"
    }

    override fun onStatusChanged(statusText: String) {
        tvStatus?.text = statusText
        updateUIState()
    }

    override fun onFinished() {
        tvStatus?.text = "Finished!"
        progressBar?.progress = 100
        updateUIState()
    }

    override fun onError(errorMessage: String) {
        tvStatus?.text = "Error: $errorMessage"
        Toast.makeText(this, errorMessage, Toast.LENGTH_SHORT).show()
        updateUIState()
    }

    override fun onDestroy() {
        typingEngine.destroy()
        super.onDestroy()
    }
}`
  },
  {
    path: 'app/src/main/java/com/autotyper/keyboard/MainActivity.kt',
    name: 'MainActivity.kt',
    category: 'kotlin',
    description: 'Main app screen for editing saved text, adjusting settings, enabling IME, and testing.',
    content: `package com.autotyper.keyboard

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.provider.Settings
import android.text.Editable
import android.text.TextWatcher
import android.view.inputmethod.InputMethodManager
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.card.MaterialCardView
import com.google.android.material.materialswitch.MaterialSwitch
import com.google.android.material.slider.Slider
import com.google.android.material.textfield.TextInputEditText

/**
 * MainActivity
 * 
 * Provides the user configuration screen for AutoTyper Keyboard:
 * - Enter/paste custom text.
 * - Adjust typing speed (50ms - 300ms per char).
 * - Toggle Random Pauses and Typo Simulation.
 * - Persistent storage with SettingsManager.
 * - Guide to enable and activate the AutoTyper Keyboard IME in Android settings.
 */
class MainActivity : AppCompatActivity() {

    private lateinit var settingsManager: SettingsManager

    private lateinit var etInputText: TextInputEditText
    private lateinit var tvCharCount: TextView
    private lateinit var tvSpeedValue: TextView
    private lateinit var sliderSpeed: Slider
    private lateinit var switchRandomPauses: MaterialSwitch
    private lateinit var switchTypoSimulation: MaterialSwitch
    private lateinit var btnSave: Button
    private lateinit var btnClear: Button
    private lateinit var btnEnableKeyboard: Button
    private lateinit var btnSelectKeyboard: Button
    private lateinit var tvImeStatus: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate()
        setContentView(R.layout.activity_main)

        settingsManager = SettingsManager(this)

        // Bind layout views
        etInputText = findViewById(R.id.etInputText)
        tvCharCount = findViewById(R.id.tvCharCount)
        tvSpeedValue = findViewById(R.id.tvSpeedValue)
        sliderSpeed = findViewById(R.id.sliderSpeed)
        switchRandomPauses = findViewById(R.id.switchRandomPauses)
        switchTypoSimulation = findViewById(R.id.switchTypoSimulation)
        btnSave = findViewById(R.id.btnSave)
        btnClear = findViewById(R.id.btnClear)
        btnEnableKeyboard = findViewById(R.id.btnEnableKeyboard)
        btnSelectKeyboard = findViewById(R.id.btnSelectKeyboard)
        tvImeStatus = findViewById(R.id.tvImeStatus)

        loadSavedSettings()
        setupListeners()
    }

    override fun onResume() {
        super.onResume()
        checkImeStatus()
    }

    /**
     * Load existing settings into UI controls.
     */
    private fun loadSavedSettings() {
        val text = settingsManager.getText()
        val speedMs = settingsManager.getSpeedMs()
        val randomPauses = settingsManager.getRandomPauses()
        val typoSimulation = settingsManager.getTypoSimulation()

        etInputText.setText(text)
        updateCharCount(text.length)

        sliderSpeed.value = speedMs.toFloat()
        tvSpeedValue.text = "$speedMs ms / char"

        switchRandomPauses.isChecked = randomPauses
        switchTypoSimulation.isChecked = typoSimulation
    }

    /**
     * Wire up input listeners and action buttons.
     */
    private fun setupListeners() {
        // Character counter watcher
        etInputText.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                updateCharCount(s?.length ?: 0)
            }
            override fun afterTextChanged(s: Editable?) {}
        })

        // Speed slider change listener
        sliderSpeed.addOnChangeListener { _, value, _ ->
            val speed = value.toInt()
            tvSpeedValue.text = "$speed ms / char"
        }

        // Save button
        btnSave.setOnClickListener {
            val text = etInputText.text?.toString() ?: ""
            val speedMs = sliderSpeed.value.toInt()
            val randomPauses = switchRandomPauses.isChecked
            val typoSimulation = switchTypoSimulation.isChecked

            settingsManager.saveAll(text, speedMs, randomPauses, typoSimulation)
            Toast.makeText(this, "Settings Saved Successfully!", Toast.LENGTH_SHORT).show()
        }

        // Clear text button
        btnClear.setOnClickListener {
            etInputText.setText("")
        }

        // Button 1: Open System Language & Input settings to enable keyboard
        btnEnableKeyboard.setOnClickListener {
            val intent = Intent(Settings.ACTION_INPUT_METHOD_SETTINGS)
            startActivity(intent)
        }

        // Button 2: Open Input Method Picker to switch active keyboard
        btnSelectKeyboard.setOnClickListener {
            val imm = getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
            imm.showInputMethodPicker()
        }
    }

    /**
     * Update character counter label.
     */
    private fun updateCharCount(count: Int) {
        tvCharCount.text = "$count Characters"
    }

    /**
     * Check whether AutoTyper Keyboard is enabled in system settings.
     */
    private fun checkImeStatus() {
        val imm = getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
        val enabledList = imm.enabledInputMethodList
        val isEnabled = enabledList.any { it.packageName == packageName }

        if (isEnabled) {
            tvImeStatus.text = "Keyboard Status: ENABLED in Android Settings ✓"
            tvImeStatus.setTextColor(getColor(R.color.color_success))
        } else {
            tvImeStatus.text = "Keyboard Status: NOT ENABLED YET (Click button below)"
            tvImeStatus.setTextColor(getColor(R.color.color_warning))
        }
    }
}`
  },
  {
    path: 'app/src/main/res/layout/activity_main.xml',
    name: 'activity_main.xml',
    category: 'xml',
    description: 'Material 3 layout for MainActivity config screen.',
    content: `<?xml version="1.0" encoding="utf-8"?>
<ScrollView xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="?android:attr/colorBackground"
    android:fillViewport="true">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical"
        android:padding="20dp">

        <!-- App Header Card -->
        <com.google.android.material.card.MaterialCardView
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginBottom="16dp"
            app:cardCornerRadius="16dp"
            app:cardElevation="2dp">

            <LinearLayout
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:orientation="vertical"
                android:padding="20dp">

                <TextView
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:text="AutoTyper Keyboard"
                    android:textSize="22sp"
                    android:textStyle="bold"
                    android:textColor="?attr/colorPrimary" />

                <TextView
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:layout_marginTop="4dp"
                    android:text="Automated Input Method Editor for Android"
                    android:textSize="14sp"
                    android:textColor="?android:attr/textColorSecondary" />

                <TextView
                    android:id="@+id/tvImeStatus"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:layout_marginTop="12dp"
                    android:text="Checking IME Status..."
                    android:textSize="13sp"
                    android:textStyle="bold" />
            </LinearLayout>
        </com.google.android.material.card.MaterialCardView>

        <!-- IME Activation Step Card -->
        <com.google.android.material.card.MaterialCardView
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginBottom="16dp"
            app:cardCornerRadius="16dp"
            app:cardElevation="1dp">

            <LinearLayout
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:orientation="vertical"
                android:padding="16dp">

                <TextView
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:text="Keyboard Setup Steps"
                    android:textSize="16sp"
                    android:textStyle="bold" />

                <LinearLayout
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:layout_marginTop="12dp"
                    android:orientation="horizontal">

                    <Button
                        android:id="@+id/btnEnableKeyboard"
                        style="@style/Widget.Material3.Button.OutlinedButton"
                        android:layout_width="0dp"
                        android:layout_height="wrap_content"
                        android:layout_weight="1"
                        android:layout_marginEnd="6dp"
                        android:text="1. Enable IME" />

                    <Button
                        android:id="@+id/btnSelectKeyboard"
                        style="@style/Widget.Material3.Button.TonalButton"
                        android:layout_width="0dp"
                        android:layout_height="wrap_content"
                        android:layout_weight="1"
                        android:layout_marginStart="6dp"
                        android:text="2. Select IME" />
                </LinearLayout>
            </LinearLayout>
        </com.google.android.material.card.MaterialCardView>

        <!-- Saved Text Input Section -->
        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Saved Text to Auto-Type"
            android:textSize="16sp"
            android:textStyle="bold"
            android:layout_marginBottom="8dp" />

        <com.google.android.material.textfield.TextInputLayout
            style="@style/Widget.Material3.TextInputLayout.OutlinedBox"
            android:layout_width="match_parent"
            android:layout_height="wrap_content">

            <com.google.android.material.textfield.TextInputEditText
                android:id="@+id/etInputText"
                android:layout_width="match_parent"
                android:layout_height="140dp"
                android:gravity="top|start"
                android:hint="Type or paste text to be typed automatically..."
                android:inputType="textMultiLine" />
        </com.google.android.material.textfield.TextInputLayout>

        <RelativeLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="6dp"
            android:layout_marginBottom="16dp">

            <TextView
                android:id="@+id/tvCharCount"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_alignParentStart="true"
                android:text="0 Characters"
                android:textSize="13sp"
                android:textColor="?android:attr/textColorSecondary" />

            <Button
                android:id="@+id/btnClear"
                style="@style/Widget.Material3.Button.TextButton"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_alignParentEnd="true"
                android:text="Clear Text" />
        </RelativeLayout>

        <!-- Settings Options Card -->
        <com.google.android.material.card.MaterialCardView
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginBottom="20dp"
            app:cardCornerRadius="16dp">

            <LinearLayout
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:orientation="vertical"
                android:padding="16dp">

                <!-- Speed Slider -->
                <RelativeLayout
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content">

                    <TextView
                        android:layout_width="wrap_content"
                        android:layout_height="wrap_content"
                        android:text="Typing Speed Delay"
                        android:textSize="15sp"
                        android:textStyle="bold" />

                    <TextView
                        android:id="@+id/tvSpeedValue"
                        android:layout_width="wrap_content"
                        android:layout_height="wrap_content"
                        android:layout_alignParentEnd="true"
                        android:text="100 ms / char"
                        android:textSize="14sp"
                        android:textStyle="bold"
                        android:textColor="?attr/colorPrimary" />
                </RelativeLayout>

                <com.google.android.material.slider.Slider
                    android:id="@+id/sliderSpeed"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:valueFrom="50"
                    android:valueTo="300"
                    android:stepSize="10"
                    android:value="100" />

                <!-- Toggle: Random Pauses -->
                <com.google.android.material.materialswitch.MaterialSwitch
                    android:id="@+id/switchRandomPauses"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:text="Random Pauses (Simulates natural punctuation delays)"
                    android:textSize="14sp" />

                <!-- Toggle: Typo Simulation -->
                <com.google.android.material.materialswitch.MaterialSwitch
                    android:id="@+id/switchTypoSimulation"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:text="Typo Simulation (Occasional mistakes &amp; corrections)"
                    android:textSize="14sp" />

            </LinearLayout>
        </com.google.android.material.card.MaterialCardView>

        <!-- Save Button -->
        <Button
            android:id="@+id/btnSave"
            android:layout_width="match_parent"
            android:layout_height="56dp"
            android:text="Save Settings"
            android:textSize="16sp"
            android:textStyle="bold" />

        <!-- Testing Sandbox Input -->
        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="24dp"
            android:layout_marginBottom="8dp"
            android:text="Live Keyboard Testing Box"
            android:textSize="16sp"
            android:textStyle="bold" />

        <com.google.android.material.textfield.TextInputLayout
            style="@style/Widget.Material3.TextInputLayout.OutlinedBox"
            android:layout_width="match_parent"
            android:layout_height="wrap_content">

            <com.google.android.material.textfield.TextInputEditText
                android:layout_width="match_parent"
                android:layout_height="100dp"
                android:gravity="top|start"
                android:hint="Focus here with AutoTyper Keyboard active..."
                android:inputType="textMultiLine" />
        </com.google.android.material.textfield.TextInputLayout>

    </LinearLayout>
</ScrollView>`
  },
  {
    path: 'app/src/main/res/layout/keyboard_view.xml',
    name: 'keyboard_view.xml',
    category: 'xml',
    description: 'Custom Material Keyboard layout containing control panel and status views.',
    content: `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:orientation="vertical"
    android:background="#1E1E2E"
    android:padding="12dp">

    <!-- Top Status & Progress Bar -->
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        android:gravity="center_vertical"
        android:layout_marginBottom="8dp">

        <TextView
            android:id="@+id/tvStatus"
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:text="Ready to type"
            android:textColor="#FFFFFF"
            android:textSize="13sp"
            android:textStyle="bold"
            android:ellipsize="end"
            android:maxLines="1" />

        <TextView
            android:id="@+id/tvProgressCount"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="0 / 0"
            android:textColor="#A6ADC8"
            android:textSize="12sp" />
    </LinearLayout>

    <ProgressBar
        android:id="@+id/progressBar"
        style="?android:attr/progressBarStyleHorizontal"
        android:layout_width="match_parent"
        android:layout_height="6dp"
        android:layout_marginBottom="12dp"
        android:max="100"
        android:progress="0"
        android:progressTint="#89B4FA" />

    <!-- Control Buttons Panel -->
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        android:layout_marginBottom="12dp">

        <Button
            android:id="@+id/btnStart"
            android:layout_width="0dp"
            android:layout_height="48dp"
            android:layout_weight="1"
            android:layout_marginEnd="4dp"
            android:text="Start"
            android:textSize="13sp"
            android:backgroundTint="#A6E3A1"
            android:textColor="#11111B" />

        <Button
            android:id="@+id/btnPauseResume"
            android:layout_width="0dp"
            android:layout_height="48dp"
            android:layout_weight="1"
            android:layout_marginStart="4dp"
            android:layout_marginEnd="4dp"
            android:text="Pause"
            android:textSize="13sp"
            android:backgroundTint="#F9E2AF"
            android:textColor="#11111B" />

        <Button
            android:id="@+id/btnStop"
            android:layout_width="0dp"
            android:layout_height="48dp"
            android:layout_weight="1"
            android:layout_marginStart="4dp"
            android:layout_marginEnd="4dp"
            android:text="Stop"
            android:textSize="13sp"
            android:backgroundTint="#F38BA8"
            android:textColor="#11111B" />

        <com.google.android.material.button.MaterialButton
            android:id="@+id/btnSettings"
            style="@style/Widget.Material3.Button.IconButton"
            android:layout_width="48dp"
            android:layout_height="48dp"
            android:layout_marginStart="4dp"
            app:icon="@android:drawable/ic_menu_preferences"
            app:iconTint="#FFFFFF" />
    </LinearLayout>

    <!-- Quick Action Keyboard Row -->
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="44dp"
        android:orientation="horizontal">

        <Button
            android:id="@+id/btnKeySpace"
            android:layout_width="0dp"
            android:layout_height="match_parent"
            android:layout_weight="2"
            android:layout_marginEnd="4dp"
            android:text="SPACE"
            android:textSize="11sp"
            android:backgroundTint="#313244"
            android:textColor="#CDD6F4" />

        <Button
            android:id="@+id/btnKeyBackspace"
            android:layout_width="0dp"
            android:layout_height="match_parent"
            android:layout_weight="1"
            android:layout_marginStart="2dp"
            android:layout_marginEnd="2dp"
            android:text="⌫"
            android:textSize="14sp"
            android:backgroundTint="#313244"
            android:textColor="#CDD6F4" />

        <Button
            android:id="@+id/btnKeyEnter"
            android:layout_width="0dp"
            android:layout_height="match_parent"
            android:layout_weight="1"
            android:layout_marginStart="4dp"
            android:text="↵ ENTER"
            android:textSize="11sp"
            android:backgroundTint="#89B4FA"
            android:textColor="#11111B" />
    </LinearLayout>

</LinearLayout>`
  },
  {
    path: 'app/src/main/res/xml/method.xml',
    name: 'method.xml',
    category: 'xml',
    description: 'Input Method Editor (IME) subtype and settings activity metadata configuration.',
    content: `<?xml version="1.0" encoding="utf-8"?>
<input-method xmlns:android="http://schemas.android.com/apk/res/android"
    android:settingsActivity="com.autotyper.keyboard.MainActivity"
    android:isDefault="false">

    <subtype
        android:label="@string/subtype_en_US"
        android:imeSubtypeLocale="en_US"
        android:imeSubtypeMode="keyboard" />

</input-method>`
  },
  {
    path: 'app/src/main/res/values/strings.xml',
    name: 'strings.xml',
    category: 'xml',
    description: 'Localized text string resources.',
    content: `<resources>
    <string name="app_name">AutoTyper Keyboard</string>
    <string name="keyboard_service_name">AutoTyper Automated Keyboard</string>
    <string name="subtype_en_US">English (US) - AutoTyper</string>
</resources>`
  },
  {
    path: 'app/src/main/res/values/colors.xml',
    name: 'colors.xml',
    category: 'xml',
    description: 'Color palette definition.',
    content: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="purple_500">#6200EE</color>
    <color name="purple_700">#3700B3</color>
    <color name="teal_200">#03DAC5</color>
    <color name="teal_700">#018786</color>
    <color name="black">#FF000000</color>
    <color name="white">#FFFFFFFF</color>
    
    <color name="color_success">#2E7D32</color>
    <color name="color_warning">#C62828</color>
</resources>`
  },
  {
    path: 'app/src/main/res/values/themes.xml',
    name: 'themes.xml',
    category: 'xml',
    description: 'Light Material 3 theme definition.',
    content: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="Theme.AutoTyperKeyboard" parent="Theme.Material3.DayNight.NoActionBar">
        <!-- Primary brand colors -->
        <item name="colorPrimary">@color/purple_500</item>
        <item name="colorSecondary">@color/teal_200</item>
    </style>
</resources>`
  },
  {
    path: 'app/src/main/res/values-night/themes.xml',
    name: 'themes.xml (Night)',
    category: 'xml',
    description: 'Dark mode theme variant.',
    content: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="Theme.AutoTyperKeyboard" parent="Theme.Material3.DayNight.NoActionBar">
        <item name="colorPrimary">#BB86FC</item>
        <item name="colorSecondary">#03DAC6</item>
    </style>
</resources>`
  }
];
