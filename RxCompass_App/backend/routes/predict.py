from flask import Blueprint, request, jsonify, current_app
import pandas as pd
import pickle
import os
from werkzeug.utils import secure_filename
import numpy as np
import shap

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
    
    # Initialize SHAP explainer for patient-specific feature contributions
    # Using TreeExplainer for Random Forest (efficient and accurate)
    try:
        explainer = shap.TreeExplainer(model)
        print("SHAP explainer initialized successfully")
    except Exception as e:
        print(f"Warning: Could not initialize SHAP explainer: {str(e)}")
        explainer = None
except Exception as e:
    print(f"Error loading model or encoder: {str(e)}")
    model = None
    label_encoder = None
    explainer = None

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
        # This gives us individual patient feature contributions instead of global importances
        patient_specific_features = {}
        use_shap = False
        
        if explainer is not None:
            try:
                print(f"Calculating SHAP values for {len(df)} patients...")
                # Calculate SHAP values for all patients at once (more efficient)
                shap_values = explainer.shap_values(df)
                
                # Debug: Check shap_values structure in detail
                print(f"SHAP values type: {type(shap_values)}")
                if isinstance(shap_values, list):
                    print(f"Multi-class SHAP: {len(shap_values)} classes")
                    for i, sv in enumerate(shap_values[:3]):  # Check first 3 classes
                        print(f"  Class {i} shape: {sv.shape}, dtype: {sv.dtype}")
                elif isinstance(shap_values, np.ndarray):
                    print(f"SHAP array shape: {shap_values.shape}, dtype: {shap_values.dtype}")
                    if len(shap_values.shape) == 3:
                        print(f"  3D array detected: (n_samples={shap_values.shape[0]}, n_features={shap_values.shape[1]}, n_classes={shap_values.shape[2]})")
                else:
                    print(f"Unexpected SHAP type: {type(shap_values)}")
                
                # Get patient data as numpy array for efficient access
                patient_data = df.values
                
                # For multi-class classification, shap_values can be a list or 3D array
                # We need to get the SHAP values for the predicted class for each patient
                for idx, (patient_id, pred_encoded) in enumerate(zip(patient_ids, predictions_encoded)):
                    # Get SHAP values for this patient
                    if isinstance(shap_values, np.ndarray) and len(shap_values.shape) == 3:
                        # 3D array: (n_samples, n_features, n_classes)
                        # Get SHAP values for this patient: shape (n_features, n_classes)
                        patient_shap = shap_values[idx, :, :]  # Shape: (82, 41)
                    elif isinstance(shap_values, list):
                        # Multi-class: shap_values is a list of arrays, each of shape (n_samples, n_features)
                        # shap_values[class_idx] has shape (n_samples, n_features)
                        # shap_values[class_idx][sample_idx] gives 1D array of shape (n_features,)
                        # We want the SHAP values for the PREDICTED class for this patient
                        class_shap_array = shap_values[pred_encoded]  # Should be shape: (n_samples, n_features)
                        
                        # Debug the actual shape we're getting
                        if idx == 0:
                            print(f"DEBUG: class_shap_array shape: {class_shap_array.shape}")
                            print(f"DEBUG: Expected shape: (n_samples={len(df)}, n_features={len(df.columns)})")
                        
                        # Extract the patient's SHAP values - ensure we get a 1D array
                        if len(class_shap_array.shape) == 2:
                            # Standard case: (n_samples, n_features)
                            # Use proper indexing to get 1D array
                            patient_shap = class_shap_array[idx, :]  # Explicitly get row, all columns
                        elif len(class_shap_array.shape) == 1:
                            # Already 1D (unexpected but handle it)
                            patient_shap = class_shap_array
                        else:
                            # Unexpected shape - log and try to fix
                            print(f"WARNING: Unexpected class_shap_array shape: {class_shap_array.shape}")
                            # Try to extract as 2D and get the row
                            if class_shap_array.shape[0] == len(df):
                                patient_shap = class_shap_array[idx, :] if len(class_shap_array.shape) >= 2 else class_shap_array[idx]
                            else:
                                # Wrong orientation - might need transpose
                                patient_shap = class_shap_array[:, idx] if class_shap_array.shape[1] == len(df) else class_shap_array[idx].flatten()
                        
                        # Ensure it's a 1D numpy array
                        patient_shap = np.asarray(patient_shap)
                        
                        # CRITICAL: Check if it's still 2D and fix it
                        if len(patient_shap.shape) > 1:
                            print(f"ERROR: patient_shap is still 2D with shape {patient_shap.shape}")
                            print(f"  class_shap_array shape: {class_shap_array.shape}")
                            print(f"  idx: {idx}, pred_encoded: {pred_encoded}")
                            # Try to extract the first row or column depending on shape
                            if patient_shap.shape[0] == len(df.columns):
                                # Shape is (n_features, n_classes) - take first column or appropriate slice
                                patient_shap = patient_shap[:, 0] if patient_shap.shape[1] > 0 else patient_shap.flatten()[:len(df.columns)]
                            elif patient_shap.shape[1] == len(df.columns):
                                # Shape is (n_classes, n_features) - take first row
                                patient_shap = patient_shap[0, :]
                            else:
                                # Unknown shape - flatten and take first n_features
                                patient_shap = patient_shap.flatten()[:len(df.columns)]
                            print(f"  Fixed patient_shap shape: {patient_shap.shape}")
                        
                        # Flatten to ensure 1D
                        patient_shap = patient_shap.flatten()
                        
                        # Verify the shape is correct
                        if len(patient_shap) != len(df.columns):
                            print(f"ERROR: patient_shap length {len(patient_shap)} != features {len(df.columns)}")
                            print(f"  patient_shap shape: {patient_shap.shape}")
                            # Force to correct length
                            if len(patient_shap) > len(df.columns):
                                patient_shap = patient_shap[:len(df.columns)]
                            else:
                                # Pad with zeros
                                padded = np.zeros(len(df.columns))
                                padded[:len(patient_shap)] = patient_shap
                                patient_shap = padded
                        
                        # Final debug for first patient
                        if idx == 0:
                            print(f"DEBUG: pred_encoded = {pred_encoded}")
                            print(f"DEBUG: class_shap_array shape: {class_shap_array.shape}")
                            print(f"DEBUG: Final patient_shap shape: {patient_shap.shape} ✓")
                            print(f"DEBUG: patient_symptoms shape: {patient_data[idx].shape}")
                    else:
                        # Binary or single output: shap_values is a single array of shape (n_samples, n_features)
                        patient_shap = shap_values[idx, :] if len(shap_values.shape) > 1 else shap_values[idx]
                        if len(patient_shap.shape) > 1:
                            patient_shap = patient_shap.flatten()
                    
                    # Get this patient's actual symptom values (1 = present, 0 = absent)
                    patient_symptoms = patient_data[idx]  # Shape: (82,)
                    
                    # Handle the case where patient_shap is 2D (n_features, n_classes)
                    if len(patient_shap.shape) == 2:
                        # patient_shap has shape (82, 41) - SHAP values for all classes
                        # Reshape patient_symptoms to (82, 1) for broadcasting
                        patient_symptoms_reshaped = patient_symptoms.reshape(-1, 1)  # Shape: (82, 1)
                        
                        # Multiply: (82, 41) * (82, 1) -> (82, 41) via broadcasting
                        symptom_contributions_all_classes = patient_shap * patient_symptoms_reshaped
                        
                        # Extract contributions for the predicted class only
                        symptom_contributions = symptom_contributions_all_classes[:, pred_encoded]  # Shape: (82,)
                    else:
                        # patient_shap is 1D: shape (82,)
                        # Calculate contribution: Only consider symptoms that are PRESENT (value = 1)
                        symptom_contributions = patient_shap * patient_symptoms  # Shape: (82,)
                    
                    # Use absolute values to rank by impact (positive or negative contribution)
                    abs_contributions = np.abs(symptom_contributions)
                    
                    # Get indices of symptoms that are present
                    present_indices = np.where(patient_symptoms > 0)[0]
                    
                    if len(present_indices) > 0:
                        # Only consider symptoms that are actually present for this patient
                        present_contributions = abs_contributions[present_indices]
                        present_features = [df.columns[i] for i in present_indices]
                        
                        # Normalize only among present symptoms to get percentages
                        total_present_contribution = np.sum(present_contributions)
                        if total_present_contribution > 0:
                            normalized_present = (present_contributions / total_present_contribution) * 100
                        else:
                            normalized_present = present_contributions
                        
                        # Create feature-symptom pairs with their normalized contribution scores
                        feature_contribution_pairs = list(zip(present_features, normalized_present))
                        # Sort by contribution (descending) - this is patient-specific!
                        feature_contribution_pairs.sort(key=lambda x: x[1], reverse=True)
                        
                        # Get top 10 contributing symptoms for THIS patient (from their present symptoms)
                        top_features = [
                            {
                                "feature": str(feature),
                                "importance": round(float(contribution), 2)  # Already in percentage
                            }
                            for feature, contribution in feature_contribution_pairs[:10]
                        ]
                    else:
                        # Fallback: if no symptoms present (shouldn't happen), use all features
                        total_contribution = np.sum(abs_contributions)
                        if total_contribution > 0:
                            normalized_contributions = (abs_contributions / total_contribution) * 100
                        else:
                            normalized_contributions = abs_contributions
                        
                        feature_contribution_pairs = list(zip(df.columns, normalized_contributions))
                        feature_contribution_pairs.sort(key=lambda x: x[1], reverse=True)
                        
                        top_features = [
                            {
                                "feature": str(feature),
                                "importance": round(float(contribution), 2)
                            }
                            for feature, contribution in feature_contribution_pairs[:10]
                        ]
                    
                    patient_specific_features[patient_id] = top_features
                    
                    # Debug: Print first few patients' top features to verify they're different
                    if idx < 5:
                        top_feat_names = [f["feature"] for f in top_features[:5]]
                        top_feat_vals = [f["importance"] for f in top_features[:5]]
                        patient_symptom_count = np.sum(patient_symptoms)
                        # Create a hash of present symptoms to verify patients are different
                        present_symptom_names = sorted([df.columns[i] for i in present_indices[:10]])  # First 10 for brevity
                        symptom_hash = hash(tuple(present_symptom_names))
                        print(f"Patient {patient_id} (predicted: {predictions[idx]}, {patient_symptom_count} symptoms present, hash: {symptom_hash})")
                        print(f"  Top 5 features: {list(zip(top_feat_names, top_feat_vals))}")
                        print(f"  Sample present symptoms: {present_symptom_names[:5]}")
                
                use_shap = True
                print(f"Successfully calculated patient-specific SHAP values for {len(patient_specific_features)} patients")
                
                # Verify patients have different features (check first 3 patients)
                if len(patient_specific_features) >= 3:
                    sample_patients = list(patient_specific_features.keys())[:3]
                    print("\n" + "="*50)
                    print("VERIFICATION: Checking if patients have different features...")
                    for pid in sample_patients:
                        top_feat_names = [f["feature"] for f in patient_specific_features[pid][:3]]
                        top_feat_vals = [f["importance"] for f in patient_specific_features[pid][:3]]
                        print(f"Patient {pid} top 3: {top_feat_names} with values: {top_feat_vals}")
                    
                    # Check if first two patients have different features
                    if len(sample_patients) >= 2:
                        p1_features = [f["feature"] for f in patient_specific_features[sample_patients[0]][:3]]
                        p2_features = [f["feature"] for f in patient_specific_features[sample_patients[1]][:3]]
                        if p1_features == p2_features:
                            print("⚠️  WARNING: First two patients have IDENTICAL top features!")
                            print("   This might mean they have the same symptoms, OR SHAP is not working correctly.")
                        else:
                            print("✓ SUCCESS: Patients have different top features - SHAP is working!")
                    print("="*50 + "\n")
                    
            except Exception as e:
                import traceback
                print(f"ERROR: Failed to calculate SHAP values!")
                print(f"Error type: {type(e).__name__}")
                print(f"Error message: {str(e)}")
                print("Full traceback:")
                print(traceback.format_exc())
                print("=" * 50)
                print("Falling back to global feature importances")
                print("NOTE: All patients will show the same top features!")
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
            
            # Create global top features as fallback
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
        shap_used_count = 0
        global_used_count = 0
        
        for idx, (patient_id, pred, proba) in enumerate(zip(patient_ids, predictions, predictions_proba)):
            # Get confidence for predicted class
            confidence = float(np.max(proba) * 100)
            
            # Use patient-specific features if available, otherwise use global
            if use_shap and patient_id in patient_specific_features:
                top_features = patient_specific_features[patient_id]
                shap_used_count += 1
            else:
                top_features = global_top_features
                global_used_count += 1
                if idx < 3:  # Debug first few
                    print(f"WARNING: Patient {patient_id} using GLOBAL features (not patient-specific)")
            
            results.append({
                "patientId": int(patient_id) + 1,
                "prediction": str(pred),
                "confidence": round(confidence, 2),
                "topFeatures": top_features
            })
        
        # Final summary
        print("=" * 50)
        print(f"SUMMARY: {shap_used_count} patients used SHAP, {global_used_count} used global features")
        if global_used_count > 0:
            print("WARNING: Some patients are using global features - they will have identical top features!")
        print("=" * 50)
        
        return jsonify({
            "predictions": results,
            "totalPatients": len(results)
        }), 200
        
    except Exception as e:
        return jsonify({
            "error": f"Error processing file: {str(e)}"
        }), 500
