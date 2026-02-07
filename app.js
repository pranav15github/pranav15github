// app.js

const TOP_RPM = 1000; // Define a top RPM for the motor
const MAX_RADIUS = 70; // Visual radius limit (container radius 100 - inner radius 30)

// DOM Elements
const slider = document.getElementById('rpm-limit');
const limitValueDisplay = document.getElementById('limit-value');
const joystickContainer = document.getElementById('joystick-container');
const joystickInner = document.getElementById('joystick-inner');
const haltBtn = document.getElementById('halt-btn');
const currentRpmDisplay = document.getElementById('current-rpm');
const currentAngleDisplay = document.getElementById('current-angle');

// State
let sliderValuePercent = parseInt(slider.value, 10);
let isDragging = false;
let joystickX = 0;
let joystickY = 0;
let activeTouchId = null;

// Update Slider
slider.addEventListener('input', (e) => {
    sliderValuePercent = parseInt(e.target.value, 10);
    limitValueDisplay.textContent = sliderValuePercent;
    updateMotor();
});

// Halt Button
haltBtn.addEventListener('click', () => {
    // Force stop
    isDragging = false;
    joystickInner.classList.remove('dragging');
    activeTouchId = null;
    resetJoystick();
});

// Joystick Logic
const startDrag = (e) => {
    e.preventDefault(); // Prevent default touch actions like scrolling
    isDragging = true;
    joystickInner.classList.add('dragging');

    if (e.changedTouches) {
        activeTouchId = e.changedTouches[0].identifier;
    } else {
        activeTouchId = null; // Mouse
    }

    handleMove(e);
};

const endDrag = (e) => {
    if (!isDragging) return;

    if (e.changedTouches) {
        // Find if our active touch ended
        for (let i = 0; i < e.changedTouches.length; i++) {
            if (e.changedTouches[i].identifier === activeTouchId) {
                stopDragging();
                return;
            }
        }
    } else {
        // Mouse up
        stopDragging();
    }
};

const stopDragging = () => {
    isDragging = false;
    activeTouchId = null;
    joystickInner.classList.remove('dragging');
    resetJoystick();
}

const handleMove = (e) => {
    if (!isDragging) return;

    let clientX, clientY;

    if (e.touches) {
        // Find the active touch
        let touch = null;
        for (let i = 0; i < e.touches.length; i++) {
            if (e.touches[i].identifier === activeTouchId) {
                touch = e.touches[i];
                break;
            }
        }
        if (!touch) return; // Active touch not found in this move event (shouldn't happen often)
        clientX = touch.clientX;
        clientY = touch.clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }

    const rect = joystickContainer.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate distance from center
    let dx = clientX - centerX;
    let dy = clientY - centerY;

    const dist = Math.sqrt(dx * dx + dy * dy);

    // Constrain to MAX_RADIUS
    if (dist > MAX_RADIUS) {
        const angle = Math.atan2(dy, dx);
        dx = Math.cos(angle) * MAX_RADIUS;
        dy = Math.sin(angle) * MAX_RADIUS;
    }

    joystickX = dx;
    joystickY = dy;

    updateVisuals();
    updateMotor();
};

const resetJoystick = () => {
    joystickX = 0;
    joystickY = 0;
    updateVisuals();
    updateMotor();
};

const updateVisuals = () => {
    joystickInner.style.transform = `translate(-50%, -50%) translate(${joystickX}px, ${joystickY}px)`;
};

const updateMotor = () => {
    if (typeof calculateMotorOutput === 'function') {
        const result = calculateMotorOutput(joystickX, joystickY, MAX_RADIUS, sliderValuePercent, TOP_RPM);

        currentRpmDisplay.textContent = result.rpm;
        currentAngleDisplay.textContent = result.angle;
    }
};

// Event Listeners
joystickContainer.addEventListener('mousedown', startDrag);
joystickContainer.addEventListener('touchstart', startDrag, { passive: false });

window.addEventListener('mousemove', handleMove);
window.addEventListener('touchmove', handleMove, { passive: false });

window.addEventListener('mouseup', endDrag);
window.addEventListener('touchend', endDrag);

// Initialize
limitValueDisplay.textContent = sliderValuePercent;
updateMotor();
