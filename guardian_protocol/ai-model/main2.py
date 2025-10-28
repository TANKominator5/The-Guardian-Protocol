import joblib
from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn

# Initialize the FastAPI app
app = FastAPI(
    title="Campus Security Model API",
    description="API for the Random Forest security model",
    version="1.0"
)

# Load the trained scikit-learn model
# This assumes the .pkl file is in the same directory as this script
try: 
    model = joblib.load("campus_security_rf_model.pkl")
    # Get the class names and feature order from the loaded model
    model_classes = model.classes_
    model_feature_order = model.feature_names_in_
except FileNotFoundError:
    print("ERROR: Model file 'campus_security_rf_model.pkl' not found.")
    model = None
except Exception as e:
    print(f"ERROR: Could not load model. {e}")
    model = None

# Define the input data structure using Pydantic
# This matches the feature_names_in_ from your model
class SecurityInput(BaseModel):
    duration_min: float
    previous_misconduct_count: int
    hour: float
    source_Swipe: int
    source_WiFi: int
    location_Hostel: int
    location_Lab_1: int  # Pydantic doesn't allow '-' in variable names
    location_Lab_2: int
    location_Library: int
    location_Main_Gate: int
    location_Sports_Ground: int
    action_Entry: int
    action_Exit: int
    action_Sighted: int

    # This allows FastAPI to correctly map the input JSON
    # 'location_Lab-1' -> location_Lab_1
    class Config:
        alias_generator = lambda string: string.replace("_", "-")
        allow_population_by_field_name = True


# Define the prediction endpoint
@app.post("/predict")
async def predict_security_status(data: SecurityInput):
    """
    Receives security data and returns a prediction from the model.

    - **duration_min**: Duration in minutes (float)
    - **previous_misconduct_count**: Count of past incidents (int)
    - **hour**: Hour of the day (float, e.g., 14.5 for 2:30 PM)
    - **source_Swipe**: 1 if source is Swipe, 0 otherwise (int)
    - **source_WiFi**: 1 if source is WiFi, 0 otherwise (int)
    - **location_Hostel**: 1 if location is Hostel, 0 otherwise (int)
    - **location_Lab-1**: 1 if location is Lab-1, 0 otherwise (int)
    - **location_Lab-2**: 1 if location is Lab-2, 0 otherwise (int)
    - **location_Library**: 1 if location is Library, 0 otherwise (int)
    - **location_Main Gate**: 1 if location is Main Gate, 0 otherwise (int)
    - **location_Sports Ground**: 1 if location is Sports Ground, 0 otherwise (int)
    - **action_Entry**: 1 if action is Entry, 0 otherwise (int)
    - **action_Exit**: 1 if action is Exit, 0 otherwise (int)
    - **action_Sighted**: 1 if action is Sighted, 0 otherwise (int)
    """
    if model is None:
        return {"error": "Model not loaded. Check server logs."}

    try:
        # Create the feature list in the exact order the model expects
        # We use model_feature_order to be certain
        features = [
            data.duration_min,
            data.previous_misconduct_count,
            data.hour,
            data.source_Swipe,
            data.source_WiFi,
            data.location_Hostel,
            data.location_Lab_1,
            data.location_Lab_2,
            data.location_Library,
            data.location_Main_Gate,
            data.location_Sports_Ground,
            data.action_Entry,
            data.action_Exit,
            data.action_Sighted
        ]

        # Make prediction
        # We wrap `features` in another list to make it a 2D array (1 sample, 14 features)
        prediction_index = model.predict([features])
        
        # Get the human-readable class name
        predicted_class = prediction_index[0]

        return {
            "prediction": predicted_class,
            "model_features_expected": model_feature_order.tolist(),
            "all_possible_classes": model_classes.tolist()
        }
    except Exception as e:
        return {"error": f"Error during prediction: {str(e)}"}

# Define a root endpoint for checking if the API is running
@app.get("/")
def read_root():
    return {"message": "Campus Security Model API is running"}

# Run the app
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)