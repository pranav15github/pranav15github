document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('forecast-form');
    const resultsSection = document.getElementById('results-section');

    // Result elements
    const resVessel = document.getElementById('res-vessel');
    const resEntry = document.getElementById('res-entry');
    const resIdle = document.getElementById('res-idle');
    const resRisk = document.getElementById('res-risk');

    const rate1m = document.getElementById('rate-1m');
    const rate3m = document.getElementById('rate-3m');
    const rate6m = document.getElementById('rate-6m');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            origin: document.getElementById('origin').value,
            destination: document.getElementById('destination').value,
            cargo_volume: document.getElementById('cargo_volume').value,
            contract_duration: document.getElementById('contract_duration').value
        };

        try {
            const response = await fetch('/api/forecast', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Populate results
            resVessel.textContent = data.vessel_recommendation;
            resEntry.textContent = data.insights.optimal_entry;
            resIdle.textContent = data.insights.idle_management;
            resRisk.textContent = data.insights.risk_warnings;

            rate1m.textContent = `$${data.forecast_rates_usd_per_ton['1_month']}`;
            rate3m.textContent = `$${data.forecast_rates_usd_per_ton['3_months']}`;
            rate6m.textContent = `$${data.forecast_rates_usd_per_ton['6_months']}`;

            // Show results section
            resultsSection.style.display = 'block';

            // Scroll to results
            resultsSection.scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            console.error('Error fetching forecast:', error);
            alert('Failed to generate forecast. Please try again later.');
        }
    });
});
