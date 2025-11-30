from flask import Blueprint, request, jsonify, current_app
import pandas as pd
import pickle
import os
from werkzeug.utils import secure_filename
import numpy as np

predict_route = Blueprint('predict', __name__)

# Load model and encoder at startup
MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'models', 'RandomForest.pkl')
ENCODER_PATH = os.path.join(os.path.dirname(__file__), '..', 'models', 'label_encoder.pkl')

try:
    with open(MODEL_PATH, 'rb') as f:
        model = pickle.load(f)
    with open(ENCODER_PATH, 'rb') as f:
        label_encoder = pickle.load(f)
    print("Model and encoder loaded successfully")
except Exception as e:
    print(f"Error loading model or encoder: {str(e)}")
    model = None
    label_encoder = None

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() == 'csv'

@predict_route.route('/api/predict', methods=['POST'])
def predict():
    if model is None or label_encoder is None:
        return jsonify({
            "error": "Model not loaded. Please ensure model.pkl and encoder.pkl are in the models/ folder"
        }), 500

    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    
    if not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type. Please upload a CSV file"}), 400
    
    try:
        # Read CSV file
        df = pd.read_csv(file)
        
        # Validate dataset has required columns
        if len(df.columns) < 82:
            return jsonify({
                "error": f"Dataset must have at least 82 features. Found {len(df.columns)} columns"
            }), 400
        
        # Store original indices for patient IDs
        patient_ids = df.index.tolist()
        
        # Make predictions
        predictions_encoded = model.predict(df)
        predictions_proba = model.predict_proba(df)
        
        # Inverse transform to get original disease names
        predictions = label_encoder.inverse_transform(predictions_encoded)
        
        # Get feature importances if available
        if hasattr(model, 'feature_importances_'):
            feature_importances = model.feature_importances_
        elif hasattr(model, 'coef_'):
            feature_importances = np.abs(model.coef_).mean(axis=0)
        else:
            feature_importances = np.ones(len(df.columns))
        
        # Prepare response
        results = []
        for idx, (patient_id, pred, proba) in enumerate(zip(patient_ids, predictions, predictions_proba)):
            # Get confidence for predicted class
            confidence = float(np.max(proba) * 100)
            
            # Get top 10 feature contributors
            feature_importance_pairs = list(zip(df.columns, feature_importances))
            feature_importance_pairs.sort(key=lambda x: x[1], reverse=True)
            
            top_features = [
                {
                    "feature": str(feature),
                    "importance": float(importance * 100)
                }
                for feature, importance in feature_importance_pairs[:10]
            ]
            
            results.append({
                "patientId": int(patient_id) + 1,
                "prediction": str(pred),
                "confidence": round(confidence, 2),
                "topFeatures": top_features
            })
        
        return jsonify({
            "predictions": results,
            "totalPatients": len(results)
        }), 200
        
    except Exception as e:
        return jsonify({
            "error": f"Error processing file: {str(e)}"
        }), 500
