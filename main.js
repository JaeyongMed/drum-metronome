// main.js

// Audio Input Setup
let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let compressorNode = audioContext.createDynamicsCompressor();
compressorNode.threshold.setValueAtTime(-50, audioContext.currentTime); // Set initial noise gate threshold

navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        let source = audioContext.createMediaStreamSource(stream);
        source.connect(compressorNode);
    })
    .catch(err => console.log('Error: ' + err));

// Noise Gate Functionality
document.getElementById('noiseGateThreshold').addEventListener('input', function(event) {
    compressorNode.threshold.setValueAtTime(event.target.value, audioContext.currentTime);
});

// Sound Visualization
let p = new p5();
p.draw = () => {
    p.background(0);
    let analyserNode = audioContext.createAnalyser();
    let waveform = new Uint8Array(analyserNode.frequencyBinCount);
    analyserNode.getByteTimeDomainData(waveform);
    for (let i = 0; i < waveform.length; i++) {
        let x = p.map(i, 0, waveform.length, 0, p.width);
        let y = p.map(waveform[i], 0, 256, p.height, 0);
        p.stroke(255);
        p.line(x, p.height / 2, x, y);
    }
};

// Beat Analysis
function analyzeBeat(waveform) {
    let bpm = calculateBPM(waveform);
    let timingDeviation = calculateTimingDeviation(waveform);
    displayBeatFeedback(bpm, timingDeviation);
}

function calculateBPM(waveform) {
    // Placeholder for actual BPM calculation
    return 120; // Assume a constant 120 BPM for this example
}

function calculateTimingDeviation(waveform) {
    // Placeholder for actual timing deviation calculation
    return 0; // Assume no timing deviation for this example
}

// UI Interaction Logic
document.getElementById('startButton').addEventListener('click', startAudioProcessing);
document.getElementById('stopButton').addEventListener('click', stopAudioProcessing);

function startAudioProcessing() {
    // Logic to start audio processing
    audioContext.resume();
}

function stopAudioProcessing() {
    // Logic to stop audio processing
    audioContext.suspend();
}

// Visual Indicators for Beat Feedback
function displayBeatFeedback(bpm, timingDeviation) {
    // Logic to display visual feedback based on beat analysis
    // This could involve changing colors, shapes, or other visual elements on the canvas
    p.background(bpm, 255, 255, 1 - timingDeviation);
}

// Apply User Settings
const userSettings = loadUserSettings();
if (userSettings) {
    document.getElementById('volume').value = userSettings.volume;
    document.getElementById('noiseGateThreshold').value = userSettings.noiseGateThreshold;
}

function loadUserSettings() {
    // Load user settings from localStorage
    return JSON.parse(localStorage.getItem('userSettings'));
}

// Optimization
requestAnimationFrame(p.draw);