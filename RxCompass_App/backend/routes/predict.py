from flask import Blueprint, request, jsonify, current_app
import pandas as pd
import pickle
import os
from werkzeug.utils import secure_filename
import numpy as np
import shap

predict_route = Blueprint('predict', __name__)

# Load model and encoder 
_routes_dir = os.path.dirname(os.path.abspath(__file__))
_backend_dir = os.path.dirname(_routes_dir)
MODEL_PATH = os.path.join(_backend_dir, 'models', 'RandomForest.pkl')
ENCODER_PATH = os.path.join(_backend_dir, 'models', 'label_encoder.pkl')

try:
    with open(MODEL_PATH, 'rb') as f:
        model = pickle.load(f)
    with open(ENCODER_PATH, 'rb') as f:
        label_encoder = pickle.load(f)
except Exception as e:
    print(f"Error loading model or encoder: {str(e)}")
    model = None
    label_encoder = None


def predicted_class_proba(model, X):
    probs = model.predict_proba(X)
    preds = np.argmax(probs, axis=1)
    return probs[np.arange(len(preds)), preds]

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
        
        # Calculate SHAP values for patient-specific feature contributions
        patient_specific_features = {}
        use_shap = False

        try:
            explainer = shap.Explainer(lambda x: predicted_class_proba(model, x), df)
            explanation = explainer(df)

            for i in range(len(df)):
                shap_vec = explanation.values[i]        # shape (82,)
                symptoms = df.iloc[i].values            # shape (82,)

                present = np.where(symptoms > 0)[0]
                contribs = np.abs(shap_vec[present])
                total = contribs.sum()

                if total > 0:
                    contribs = contribs / total * 100

                pairs = sorted(
                    zip(df.columns[present], contribs),
                    key=lambda x: x[1],
                    reverse=True
                )

                patient_specific_features[i] = [
                    {"feature": f, "importance": round(float(c), 2)}
                    for f, c in pairs[:10]
                ]

            use_shap = True
        except Exception:
            use_shap = False
        
        # Fallback to global feature importances if SHAP fails or is not available
        global_top_features = None
        if not use_shap:
            if hasattr(model, 'feature_importances_'):
                global_feature_importances = model.feature_importances_
            elif hasattr(model, 'coef_'):
                global_feature_importances = np.abs(model.coef_).mean(axis=0)
            else:
                global_feature_importances = np.ones(len(df.columns))

            feature_importance_pairs = list(zip(df.columns, global_feature_importances))
            feature_importance_pairs.sort(key=lambda x: x[1], reverse=True)
            global_top_features = [
                {
                    "feature": str(feature),
                    "importance": float(importance * 100)
                }
                for feature, importance in feature_importance_pairs[:10]
            ]

        # Prepare response
        results = []

        for idx, (patient_id, pred, proba) in enumerate(zip(patient_ids, predictions, predictions_proba)):
            confidence = float(np.max(proba) * 100)

            if use_shap and idx in patient_specific_features:
                top_features = patient_specific_features[idx]
            else:
                top_features = global_top_features

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
