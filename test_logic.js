// test_logic.js
const { calculateMotorOutput } = require('./logic.js');

const TOP_RPM = 1000;
const MAX_RADIUS = 70;

function runTest(description, joystickX, joystickY, sliderPercent, expectedRpm) {
    const result = calculateMotorOutput(joystickX, joystickY, MAX_RADIUS, sliderPercent, TOP_RPM);

    // Check RPM
    // We allow a small error margin for floating point, but calculateMotorOutput rounds RPM
    const actualRpm = result.rpm;

    // Check Angle (optional, but good to verify)
    const angle = result.angle;

    const pass = Math.abs(actualRpm - expectedRpm) <= 1;

    console.log(`Test: ${description}`);
    console.log(`  Input: X=${joystickX}, Y=${joystickY}, Slider=${sliderPercent}%`);
    console.log(`  Expected RPM: ${expectedRpm}, Actual RPM: ${actualRpm}`);
    console.log(`  Angle: ${angle}`);
    console.log(`  Result: ${pass ? 'PASS' : 'FAIL'}`);
    console.log('---');

    return pass;
}

// Tests
let allPassed = true;

// 1. Center -> 0 RPM
allPassed &= runTest("Center Position", 0, 0, 50, 0);

// 2. Full Throw, 50% Slider -> 50% TopRPM (500)
allPassed &= runTest("Full Throw Right, 50% Slider", MAX_RADIUS, 0, 50, 500);

// 3. Full Throw, 100% Slider -> 100% TopRPM (1000)
allPassed &= runTest("Full Throw Up, 100% Slider", 0, MAX_RADIUS, 100, 1000);

// 4. Half Throw, 100% Slider -> 50% TopRPM (500)
allPassed &= runTest("Half Throw Left, 100% Slider", -MAX_RADIUS/2, 0, 100, 500);

// 5. Full Throw, 0% Slider -> 0 RPM
allPassed &= runTest("Full Throw Down, 0% Slider", 0, -MAX_RADIUS, 0, 0);

// 6. Outside Radius (should clamp), 50% Slider -> 50% TopRPM (500)
allPassed &= runTest("Outside Radius (Clamped), 50% Slider", MAX_RADIUS * 2, 0, 50, 500);

if (allPassed) {
    console.log("All tests passed!");
    process.exit(0);
} else {
    console.error("Some tests failed!");
    process.exit(1);
}
