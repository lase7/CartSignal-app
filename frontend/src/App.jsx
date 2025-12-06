import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // --- State ---
  const [formData, setFormData] = useState({
    total_orders: 20,
    avg_days_between_orders: 7.0,
    avg_shopping_hour: 14.0,
    avg_basket_position: 5.0,
    organic_ratio: 0.10,
    produce_ratio: 0.10,
    snack_ratio: 0.10,
    late_night_ratio: 0.0
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- Handlers ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) });
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://127.0.0.1:8000/predict', formData);
      setPrediction(res.data);
    } catch (error) {
      console.error(error);
      alert("Is the Backend Running?");
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      {/* --- HEADER --- */}
      <header style={styles.header}>
        <h1 style={styles.title}>🛒 CartSignal Architect</h1>
        <p style={styles.subtitle}>Behavioral Propensity Engine</p>
      </header>

      <div style={styles.grid}>
        
        {/* --- LEFT COLUMN: CONTROLS --- */}
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>Shopper Behavior Signals</h3>
          
          {/* Slider: Total Orders */}
          <SliderControl 
            label="Total Lifetime Orders" 
            name="total_orders" 
            val={formData.total_orders} 
            min="0" max="100" step="1" 
            onChange={handleChange} 
          />

          {/* Slider: Days Between Orders */}
          <SliderControl 
            label="Avg Days Between Orders" 
            name="avg_days_between_orders" 
            val={formData.avg_days_between_orders} 
            min="0" max="30" step="1" 
            onChange={handleChange} 
          />

          {/* Slider: Shopping Hour */}
          <SliderControl 
            label="Avg Shopping Hour (24h)" 
            name="avg_shopping_hour" 
            val={formData.avg_shopping_hour} 
            min="0" max="23" step="1" 
            onChange={handleChange} 
          />

          <h3 style={{...styles.sectionTitle, marginTop: '30px'}}>Basket DNA</h3>

          {/* Slider: Organic */}
          <SliderControl 
            label="Organic Ratio (Health)" 
            name="organic_ratio" 
            val={formData.organic_ratio} 
            min="0" max="1" step="0.1" 
            onChange={handleChange} 
          />

           {/* Slider: Basket Position */}
           <SliderControl 
            label="Avg Basket Position (Volume)" 
            name="avg_basket_position" 
            val={formData.avg_basket_position} 
            min="0" max="30" step="1" 
            onChange={handleChange} 
          />

          <button 
            onClick={handlePredict}
            disabled={loading}
            style={loading ? styles.buttonDisabled : styles.button}
          >
            {loading ? "Processing..." : "RUN PREDICTION MODEL"}
          </button>
        </div>

        {/* --- RIGHT COLUMN: RESULTS --- */}
        <div style={styles.resultsCard}>
          <h3 style={styles.sectionTitle}>Real-Time Prediction</h3>
          
          {prediction ? (
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <div style={styles.scoreCircle}>
                {(prediction.propensity_score * 100).toFixed(0)}%
              </div>
              
              <h2 style={{ 
                color: prediction.is_baby_shopper ? '#00ff88' : '#888',
                fontSize: '2rem', margin: '20px 0' 
              }}>
                {prediction.segment}
              </h2>

              {prediction.is_baby_shopper === 1 && (
                <div style={styles.alertBox}>
                  <strong>🎯 TARGET IDENTIFIED</strong><br/>
                  User exhibits high-propensity behavior matching the "New Parent" profile.
                </div>
              )}
            </div>
          ) : (
            <div style={styles.placeholder}>
              <p>Adjust the sliders on the left to simulate a user profile.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// --- Helper Component for Sliders ---
const SliderControl = ({ label, name, val, min, max, step, onChange }) => (
  <div style={{ marginBottom: '20px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
      <label style={{ color: '#ccc', fontSize: '0.9rem' }}>{label}</label>
      <span style={{ color: '#00d4ff', fontWeight: 'bold' }}>{val}</span>
    </div>
    <input 
      type="range" 
      name={name} 
      value={val} 
      min={min} 
      max={max} 
      step={step} 
      onChange={onChange}
      style={{ width: '100%', cursor: 'pointer', accentColor: '#00d4ff' }} 
    />
  </div>
);

// --- CSS Styles (Dark Mode) ---
const styles = {
  container: {
    backgroundColor: '#121212', // Deep Black
    minHeight: '100vh',
    color: 'white',
    padding: '2rem',
    fontFamily: '"Segoe UI", Roboto, Helvetica, sans-serif'
  },
  header: {
    textAlign: 'center',
    marginBottom: '3rem'
  },
  title: {
    fontSize: '2.5rem',
    margin: 0,
    background: 'linear-gradient(90deg, #00d4ff, #00ff88)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  subtitle: {
    color: '#666',
    marginTop: '0.5rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr', // Split 50/50
    gap: '2rem',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  card: {
    backgroundColor: '#1e1e1e', // Dark Grey Card
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
  },
  resultsCard: {
    backgroundColor: '#1e1e1e',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sectionTitle: {
    borderBottom: '1px solid #333',
    paddingBottom: '10px',
    marginBottom: '20px',
    color: '#fff',
    marginTop: 0
  },
  button: {
    width: '100%',
    padding: '15px',
    marginTop: '20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background 0.3s'
  },
  buttonDisabled: {
    width: '100%',
    padding: '15px',
    marginTop: '20px',
    backgroundColor: '#333',
    color: '#666',
    border: 'none',
    borderRadius: '8px',
    cursor: 'not-allowed'
  },
  scoreCircle: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    border: '5px solid #00d4ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2.5rem',
    fontWeight: 'bold',
    margin: '0 auto',
    color: '#00d4ff'
  },
  alertBox: {
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    border: '1px solid #00ff88',
    color: '#00ff88',
    padding: '15px',
    borderRadius: '8px',
    marginTop: '20px'
  },
  placeholder: {
    color: '#555',
    textAlign: 'center',
    fontStyle: 'italic'
  }
};

export default App;