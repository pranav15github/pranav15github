// logic.js

function calculateMotorOutput(joystickX, joystickY, maxRadius, sliderValuePercent, topRPM) {
    // Calculate distance from center
    const dist = Math.sqrt(joystickX * joystickX + joystickY * joystickY);

    // Normalize distance to get throttle (0 to 1)
    // Clamp at 1 if outside the radius (though UI should prevent this visually)
    let throttle = dist / maxRadius;
    if (throttle > 1) throttle = 1;

    // Calculate RPM based on throttle and slider limit
    // When inner circle touches outer circle (throttle = 1), it reaches slider % of topRPM
    const limitFactor = sliderValuePercent / 100;
    const rpm = topRPM * limitFactor * throttle;

    // Calculate angle in degrees
    // Using standard mathematical angle (0 is right, 90 is up/down depending on Y axis)
    // In screen coordinates usually Y is down, so negative Y is up.
    // Let's assume standard Cartesian for logic, UI will handle screen coordinates.
    const angleRad = Math.atan2(joystickY, joystickX);
    let angleDeg = angleRad * (180 / Math.PI);

    // Normalize angle to 0-360 if needed, but -180 to 180 is often standard

    return {
        rpm: Math.round(rpm), // Round to integer for display
        angle: parseFloat(angleDeg.toFixed(2)),
        throttle: parseFloat(throttle.toFixed(2))
    };
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { calculateMotorOutput };
}
