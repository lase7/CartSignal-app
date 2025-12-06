import os
import joblib
import pandas as pd
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# --- 1. Initialize the App ---
app = FastAPI(title="CartSignal API", description="Predictive Propensity Model for Retail")

# --- 2. CORS (Cross-Origin Resource Sharing) ---
# This allows your future React frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 3. Load the Model ---
# We use a robust path method to find the model file next to this script
current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir, "cartsignal_model.joblib")

model = None
try:
    model = joblib.load(model_path)
    print(f"✅ Model loaded successfully from: {model_path}")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    print("Ensure 'cartsignal_model.joblib' is in the 'backend' folder.")

# --- 4. Define Data Schema (Must match training features exactly) ---
class UserProfile(BaseModel):
    total_orders: int
    avg_days_between_orders: float
    avg_shopping_hour: float
    avg_basket_position: float
    organic_ratio: float
    produce_ratio: float
    snack_ratio: float
    late_night_ratio: float

# --- 5. Health Check Route ---
@app.get("/")
def health_check():
    return {"status": "online", "model_status": "loaded" if model else "failed"}

# --- 6. Prediction Route ---
@app.post("/predict")
def predict_propensity(user: UserProfile):
    if not model:
        raise HTTPException(status_code=500, detail="Model is not loaded.")
    
    # Convert incoming JSON to DataFrame
    input_data = pd.DataFrame([user.dict()])
    
    # Get Prediction (0 or 1) and Probability (0.0 to 1.0)
    prediction = int(model.predict(input_data)[0])
    try:
        # Some models return [prob_0, prob_1], we want prob_1
        probability = float(model.predict_proba(input_data)[0][1])
    except:
        probability = 0.0
    
    return {
        "is_baby_shopper": prediction,
        "propensity_score": probability,
        "segment": "New Parent" if prediction == 1 else "Standard Shopper"
    }

# --- 7. Run Server (If executed directly) ---
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
