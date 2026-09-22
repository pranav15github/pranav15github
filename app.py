from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

# Basic logic to simulate forecasting
@app.route('/')
def index():
    return render_template('dashboard.html')

@app.route('/api/forecast', methods=['POST'])
def forecast():
    data = request.json
    origin = data.get('origin', 'Unknown')
    destination = data.get('destination', 'Unknown')
    cargo_volume = float(data.get('cargo_volume', 0))
    duration = data.get('contract_duration', 'Short-term')

    # Simple heuristic-based recommendations
    vessel_type = "Handysize"
    if cargo_volume > 100000:
        vessel_type = "Capesize"
    elif cargo_volume > 60000:
        vessel_type = "Panamax"
    elif cargo_volume > 40000:
        vessel_type = "Supramax"

    # Simulated freight rate forecasting logic
    forecast_rates = {
        "1_month": 15.5,
        "3_months": 16.2,
        "6_months": 15.8
    }

    insights = {
        "optimal_entry": "Market softening in next 2 weeks. Advise securing contract in early next month.",
        "idle_management": "Consider slow steaming on return leg or finding backhaul cargo from nearby hub.",
        "risk_warnings": "Potential port congestion at destination due to monsoon season approaching."
    }

    return jsonify({
        "status": "success",
        "route": f"{origin} to {destination}",
        "vessel_recommendation": vessel_type,
        "forecast_rates_usd_per_ton": forecast_rates,
        "insights": insights
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
