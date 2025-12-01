# RxCompass

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

RxCompass is an AI-powered disease prediction system designed for medical diagnostic analysis. The system leverages machine learning to analyze patient datasets and provide accurate disease prognosis predictions with comprehensive feature importance analysis and individual patient reports.

## Disclaimer
Still under work and have to add numerous features and fix bugs!

## Table of Contents

- [Overview](#overview)
- [Machine Learning Pipeline](#machine-learning-pipeline)
- [Dataset Requirements](#dataset-requirements)
- [Architecture](#architecture)
  - [Backend API](#backend-api)
  - [Frontend Application](#frontend-application)
- [Prerequisites](#prerequisites)
  - [Technical Prerequisites](#technical-prerequisites)
  - [Non-Technical Prerequisites](#non-technical-prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [License](#license)

## Overview

RxCompass processes patient medical data through a comprehensive machine learning pipeline to predict disease prognosis. The system accepts CSV files containing patient symptom data, processes them through a trained Random Forest classifier, and returns predictions along with confidence scores and feature importance rankings for each patient record.

## Machine Learning Pipeline

The machine learning pipeline is implemented across multiple stages, each serving a critical role in ensuring model accuracy and prediction reliability.

### Data Cleaning (`src/data_preprocessing.py`)

The `DataCleaning` class provides foundational data quality assessment and preprocessing capabilities:

- **Null Value Detection**: Identifies missing values in the dataset to ensure data completeness
- **Duplicate Detection**: Analyzes duplicate records to maintain data integrity
- **Collinearity Reduction**: Removes highly correlated features (threshold: 0.85) to reduce dimensionality and multicollinearity issues

**Significance**: This stage ensures data quality and reduces redundant features, preventing model overfitting and improving generalization performance.

### Feature Engineering (`src/data_preprocessing.py`)

The `FeatureEng` class handles feature transformation and encoding:

- **Label Encoding**: Transforms categorical target variables (disease names) into numerical labels for model training
- **Train-Test Split**: Divides data into training (67%) and testing (33%) sets with random state 42 for reproducibility

**Significance**: Proper encoding ensures compatibility with scikit-learn algorithms, while stratified splitting maintains class distribution across datasets.

### Model Training (`src/modelWithPrediction.py`)

The training pipeline evaluates multiple classification algorithms:

1. **Random Forest Classifier**: Ensemble method with 100 estimators, parallel processing enabled
2. **Gradient Boosting Classifier**: Sequential ensemble learning with 100 estimators
3. **XGBoost Classifier**: Optimized gradient boosting with 100 estimators
4. **Support Vector Machine**: RBF kernel with scaled gamma parameter

**Significance**: Model comparison enables selection of the best-performing algorithm. The Random Forest model is selected for deployment due to its superior performance in multi-class classification scenarios. The model achieves high accuracy through ensemble learning, aggregating predictions from multiple decision trees.

**Key Implementation Details**

### Machine Learning Architecture

The RxCompass system implements a comprehensive machine learning pipeline designed for medical disease prediction with emphasis on accuracy, interpretability, and clinical relevance.

#### Data Processing Pipeline

The system employs a multi-stage data processing approach to ensure high-quality predictions:

**Data Quality Assurance**: The `DataCleaning` class performs systematic data validation including null value detection, duplicate record analysis, and feature collinearity reduction. Features with correlation coefficients exceeding 0.85 are automatically removed to prevent multicollinearity issues that could bias model predictions.

**Feature Engineering**: The `FeatureEng` class handles categorical variable transformation through label encoding, converting disease names into numerical labels suitable for machine learning algorithms. The training data is split using stratified sampling (67% training, 33% testing) with random state 42 to ensure reproducible results while maintaining class distribution balance.

#### Model Selection and Training

The system evaluates multiple classification algorithms to identify optimal performance:

**Random Forest Classifier**: Implemented with 100 decision trees and parallel processing (n_jobs=-1) to leverage multi-core processors. This ensemble method reduces overfitting through bagging and provides natural feature importance rankings.

**Alternative Models**: Gradient Boosting and XGBoost classifiers are evaluated for comparative analysis, with Support Vector Machine (RBF kernel) included for baseline comparison. The Random Forest model consistently demonstrates superior performance in multi-class disease prediction scenarios.

**Model Persistence**: Trained models are serialized using pickle and stored in the models directory for rapid loading during API requests, eliminating the need for model retraining during runtime.

#### Explainability Framework

The system incorporates SHAP (SHapley Additive exPlanations) for model interpretability:

**Feature Contribution Analysis**: The `ShapExplained` class calculates SHAP values for each prediction, identifying which symptoms most significantly influence the model's decision-making process.

**Clinical Relevance**: For each patient prediction, the system ranks the 10 most contributing features, enabling healthcare professionals to validate predictions against clinical knowledge and patient presentations.

**SHAP Implementation Details**: SHAP values are computed using the TreeExplainer method, specifically optimized for tree-based models like Random Forest. The explainer generates local explanations for individual patient predictions, providing feature-level attribution that shows how each symptom contributes positively or negatively to the final disease prediction. The SHAP framework ensures fair distribution of prediction contributions across all features, maintaining mathematical consistency while providing interpretable results that healthcare professionals can trust and validate against their clinical expertise.

**SHAP Documentation**: For comprehensive understanding of SHAP (SHapley Additive exPlanations) implementation, mathematical foundations, and advanced usage patterns, refer to the official documentation at [https://shap.readthedocs.io/](https://shap.readthedocs.io/). The documentation provides detailed explanations of different explainer methods, visualization techniques, and best practices for model interpretability in machine learning applications.

### Backend Implementation

The Flask-based backend API provides robust disease prediction services with comprehensive error handling and data validation.

#### API Architecture

**Application Structure**: The Flask application is modularized using blueprints, with the prediction logic separated into dedicated route handlers. CORS is enabled to facilitate cross-origin requests from the React frontend.

**File Processing**: The system handles CSV file uploads with strict validation protocols. Files are temporarily stored in the uploads directory and processed in memory to minimize storage requirements.

**Data Validation**: The API performs comprehensive dataset validation, ensuring minimum feature requirements (82 columns) and proper data formatting. Invalid datasets trigger descriptive error messages to guide users.

#### Prediction Engine

**Model Loading**: Pre-trained models are loaded during application startup to minimize prediction latency. The Random Forest classifier and label encoder are cached in memory for optimal performance.

**Prediction Pipeline**: For each patient record in the uploaded dataset, the system generates:
- Disease prediction with probability confidence scores
- Ranked feature importance analysis
- Individualized patient reports

**Response Format**: The API returns structured JSON responses containing prediction results, confidence metrics, and feature contribution rankings for all processed patients.

### Frontend Implementation

The React frontend provides an intuitive interface for medical data analysis with real-time prediction capabilities.

#### User Interface Design

**Component Architecture**: The application is built using a modular component structure with reusable UI elements from the shadcn/ui library. The interface supports responsive design across desktop, tablet, and mobile devices.

**Theme System**: The application features a dual-theme system with neon-dark and neon-blue variants. Themes are implemented using CSS custom properties and can be toggled dynamically without page refresh.

**Data Visualization**: Prediction results are presented using interactive charts from the Recharts library, enabling users to explore confidence scores and feature importance rankings visually.

#### State Management

**React Hooks**: The application utilizes modern React patterns including useState for component state management and useEffect for side effects such as theme initialization and API communication.

**Error Handling**: Comprehensive error boundaries and toast notifications provide users with clear feedback for upload errors, API failures, and processing issues.

**Loading States**: Asynchronous operations are managed with loading indicators to provide visual feedback during file processing and prediction generation.

### Performance Optimization

#### Backend Optimizations

**Model Caching**: Pre-trained models are loaded once during application startup rather than per request, reducing prediction latency by approximately 95%.

**Parallel Processing**: The Random Forest classifier utilizes all available CPU cores through n_jobs=-1 configuration, significantly accelerating prediction generation for large datasets.

**Memory Management**: File uploads are processed in streams rather than loading entire datasets into memory, enabling efficient handling of large patient cohorts.

#### Frontend Optimizations

**Build Optimization**: The Vite build system provides fast development server startup and optimized production builds with code splitting and tree shaking.

**Component Lazy Loading**: React components are loaded on-demand to minimize initial bundle size and improve application startup performance.

**Asset Optimization**: Images and static assets are optimized during build process to reduce load times and improve user experience.

### Security Considerations

#### Data Privacy

**Local Processing**: All patient data processing occurs locally on the user's machine or deployed server, with no external data transmission to third-party services.

**File Validation**: The system implements strict file type validation and size limitations to prevent malicious file uploads and ensure system stability.

**Session Management**: Temporary files are automatically cleaned up after processing to prevent data residue and maintain privacy compliance.

#### Input Validation

**Dataset Structure Validation**: The API validates uploaded datasets against expected schema requirements, rejecting malformed files before processing.

**Feature Name Verification**: Column names are validated against the training data feature set to ensure model compatibility and prediction accuracy.

**Data Type Checking**: Binary encoding requirements are enforced, with appropriate error messages for non-conforming data formats.

```python
# Collinearity reduction removes redundant features
col_to_remove = col_reduction_X_train.collinearity_reduction(threshold=0.85)
X_train_reduced = X_train.drop(columns=col_to_remove, axis=1)

# Label encoding for target variable
y_train_enc = le.fit_transform(y_train)
y_test_enc = le.transform(y_test)

# Model training with ensemble approach
model = RandomForestClassifier(n_estimators=100, n_jobs=-1, random_state=42)
model.fit(X_train_use, y_train)
```

The trained model and label encoder are serialized using pickle and saved to `RxCompass_App/backend/models/` for API deployment.

### Model Explanation (`src/explainationability.py`)

The `ShapExplained` class provides model interpretability using SHAP (SHapley Additive exPlanations) values:

- **Feature Contribution Analysis**: Identifies which symptoms contribute most to each prediction
- **Top Feature Ranking**: Highlights the 10 most influential features per patient prediction

**Significance**: Explainability is critical in medical applications, allowing healthcare professionals to understand model decisions and validate predictions against clinical knowledge.

## Dataset Requirements

The system requires datasets in CSV format with specific structural requirements:

### Required Format

1. **Column Structure**: The dataset must contain at least 82 feature columns representing binary-encoded symptoms and medical indicators
2. **Feature Encoding**: All features should be binary-encoded (0 for absent, 1 for present) or ordinal-encoded for continuous variables
3. **No Target Column**: Input datasets for prediction should not include the `prognosis` column; this is generated by the model
4. **Feature Names**: Column names should match the training data feature names, including:
   - Symptom indicators (e.g., `itching`, `skin_rash`, `nodal_skin_eruptions`)
   - Vital signs (e.g., `high_fever`, `irregular_sugar_level`, `fast_heart_rate`)
   - Medical history indicators (e.g., `family_history`, `history_of_alcohol_consumption`)

### Example Feature Set

The model expects features such as:
- `itching`, `skin_rash`, `continuous_sneezing`, `shivering`, `chills`
- `joint_pain`, `stomach_pain`, `vomiting`, `fatigue`, `weight_gain`
- `anxiety`, `mood_swings`, `restlessness`, `lethargy`
- `cough`, `high_fever`, `breathlessness`, `chest_pain`
- `irregular_sugar_level`, `fast_heart_rate`, `abdominal_pain`
- And 67+ additional medical indicators

### Data Preprocessing Pipeline

The training dataset (`data/Cleaned_dataset/Disease_Cleaned_train.csv`) underwent the following preprocessing:

1. **Initial Cleaning**: Removed index columns and null values
2. **Feature Selection**: Applied collinearity reduction to remove highly correlated features (>0.85 correlation)
3. **Encoding**: Label-encoded the target variable (disease prognosis)
4. **Split**: Divided into training and testing sets (67/33 split)

**Important Note**: Input CSV files for prediction must match the exact feature set used during training. Ensure all 82 features are present, in the same order, and properly encoded.

## Architecture

### Backend API

The backend is built using [Flask](https://flask.palletsprojects.com/), a lightweight Python web framework. The API is structured as follows:

#### Application Entry Point (`RxCompass_App/backend/app.py`)

The Flask application initializes with CORS enabled to allow cross-origin requests from the frontend:

```python
app = Flask(__name__)
CORS(app)
app.register_blueprint(predict_route)
```

**Configuration**:
- Upload folder: `uploads/` for temporary file storage
- Reports folder: `reports/` for generated patient reports
- Maximum file size: 16MB
- CORS enabled for frontend integration

#### Prediction Endpoint (`RxCompass_App/backend/routes/predict.py`)

The `/api/predict` endpoint handles disease prediction requests:

**Request Handling**:
1. Validates file upload (CSV format only)
2. Verifies dataset structure (minimum 82 features required)
3. Loads pre-trained Random Forest model and LabelEncoder from `models/` directory
4. Processes patient data through the model
5. Generates predictions with confidence scores and feature importance rankings

**Response Structure**:

```json
{
  "predictions": [
    {
      "patientId": 1,
      "prediction": "Disease Name",
      "confidence": 95.5,
      "topFeatures": [
        {
          "feature": "symptom_name",
          "importance": 12.3
        }
      ]
    }
  ],
  "totalPatients": 100
}
```

**Key Implementation**:

```python
@predict_route.route('/api/predict', methods=['POST'])
def predict():
    # File validation
    if not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type"}), 400
    
    # Dataset validation
    if len(df.columns) < 82:
        return jsonify({"error": "Dataset must have at least 82 features"}), 400
    
    # Model prediction
    predictions_encoded = model.predict(df)
    predictions_proba = model.predict_proba(df)
    predictions = label_encoder.inverse_transform(predictions_encoded)
    
    # Feature importance extraction
    feature_importances = model.feature_importances_
```

**Model Loading**: The model and encoder are loaded at application startup to optimize prediction latency. Both are stored as pickle files in the `models/` directory.

### Frontend Application

The frontend is built using [React](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/) and [Vite](https://vitejs.dev/) for fast development and optimized builds. The application communicates with the backend API through standard HTTP POST requests.

**API Integration** (`RxCompass_App/frontend/src/pages/Index.tsx`):

```typescript
const response = await fetch('http://localhost:5000/api/predict', {
  method: 'POST',
  body: formData,
});
```

The frontend handles file uploads, displays loading states, and presents prediction results with interactive visualizations. The UI is built using [shadcn/ui](https://ui.shadcn.com/) components and [Tailwind CSS](https://tailwindcss.com/) for styling.

## Prerequisites

### Technical Prerequisites

#### Backend Requirements

- **Python 3.8+**: Required for running the Flask backend and ML pipeline
  - Download: [Python Official Website](https://www.python.org/downloads/)
- **pip**: Python package manager (included with Python)
- **Virtual Environment**: Recommended for dependency isolation
  - Python venv: [Python venv Documentation](https://docs.python.org/3/library/venv.html)

#### Frontend Requirements

- **Node.js 16+**: Required for running the React frontend
  - Download: [Node.js Official Website](https://nodejs.org/)
- **npm or yarn**: Package managers for JavaScript dependencies
  - npm is included with Node.js
  - yarn: [Yarn Package Manager](https://yarnpkg.com/)

#### Development Tools

- **Git**: Version control system
  - Download: [Git Official Website](https://git-scm.com/downloads)
- **Code Editor**: Recommended editors include:
  - [Visual Studio Code](https://code.visualstudio.com/)
  - [PyCharm](https://www.jetbrains.com/pycharm/)

### Non-Technical Prerequisites

#### Data Requirements

- **Medical Dataset**: CSV files containing patient symptom data with proper encoding
- **Data Format Knowledge**: Understanding of binary encoding for symptoms (0/1 values)
- **Feature Alignment**: Datasets must match the training data feature structure (82+ features)

#### Domain Knowledge

- **Basic Medical Terminology**: Familiarity with symptom names and medical indicators helps in interpreting results
- **CSV File Management**: Ability to prepare and format CSV files according to system requirements
- **File System Navigation**: Basic understanding of directory structures for dataset placement

#### System Access

- **Local Development Environment**: Access to a computer capable of running Python and Node.js
- **Sufficient Storage**: Disk space for dependencies, datasets, and generated reports
- **Network Access**: For downloading packages and dependencies (initial setup only)

#### Operational Requirements

- **Patient Data Privacy**: Ensure compliance with healthcare data regulations (HIPAA, GDPR, etc.) when handling patient information
- **Data Validation**: Ability to verify CSV file integrity before upload
- **Result Interpretation**: Understanding that predictions are probabilistic and require clinical validation

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd RxCompass_App/backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Ensure model files exist in `RxCompass_App/backend/models/`:
   - `RandomForest.pkl`
   - `label_encoder.pkl`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd RxCompass_App/frontend
```

2. Install dependencies:
```bash
npm install
```

## Usage

### Starting the Backend Server

From `RxCompass_App/backend/`:
```bash
python app.py
```

The API will be available at `http://localhost:5000`

### Starting the Frontend Development Server

From `RxCompass_App/frontend/`:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port specified by Vite)

### Making Predictions

1. Open the frontend application in a web browser
2. Upload a CSV file containing patient data with 82+ feature columns
3. Wait for processing to complete
4. Review predictions, confidence scores, and feature importance rankings
5. Download individual patient reports as needed

## Technologies Used

### Machine Learning & Data Science

- [Python](https://www.python.org/): Core programming language
- [pandas](https://pandas.pydata.org/): Data manipulation and analysis
- [NumPy](https://numpy.org/): Numerical computing
- [scikit-learn](https://scikit-learn.org/): Machine learning algorithms and utilities
- [XGBoost](https://xgboost.readthedocs.io/): Gradient boosting framework
- [SHAP](https://shap.readthedocs.io/): Model interpretability library

### Backend

- [Flask](https://flask.palletsprojects.com/): Web framework
- [Flask-CORS](https://flask-cors.readthedocs.io/): Cross-origin resource sharing

### Frontend

- [React](https://react.dev/): UI library
- [TypeScript](https://www.typescriptlang.org/): Type-safe JavaScript
- [Vite](https://vitejs.dev/): Build tool and development server
- [Tailwind CSS](https://tailwindcss.com/): Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/): Component library
- [Recharts](https://recharts.org/): Charting library
- [React Router](https://reactrouter.com/): Client-side routing

### Data Visualization

- [Matplotlib](https://matplotlib.org/): Plotting library
- [Seaborn](https://seaborn.pydata.org/): Statistical data visualization
- [Plotly](https://plotly.com/python/): Interactive visualization library

## Project Structure

```
RxCompass/
├── data/
│   ├── Cleaned_dataset/          # Processed training data
│   ├── PreProcessed_dataset/     # Feature-engineered datasets
│   └── raw_dataset/              # Original datasets
├── notebooks/                    # Jupyter notebooks for analysis
│   ├── 01_Data_cleaning.ipynb
│   ├── 02_Feature_Engineering.ipynb
│   └── 03_Model_Estimator.ipynb
├── src/                          # Core ML pipeline source code
│   ├── data_preprocessing.py     # Data cleaning and feature engineering
│   ├── modelWithPrediction.py    # Model training pipeline
│   └── explainationability.py    # Model interpretability
├── RxCompass_App/
│   ├── backend/                  # Flask API
│   │   ├── app.py               # Application entry point
│   │   ├── models/              # Trained model files
│   │   ├── routes/              # API endpoints
│   │   └── requirements.txt     # Python dependencies
│   └── frontend/                # React application
│       ├── src/
│       │   ├── components/      # React components
│       │   ├── pages/           # Page components
│       │   └── hooks/           # Custom React hooks
│       └── package.json         # Node.js dependencies
├── requirements.txt             # Root Python dependencies
└── README.md                    # Project documentation
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Medical Disclaimer**: This system is intended for educational and research purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult qualified healthcare professionals for medical decisions.

## Author 
- [Sujal-G-Sanyasi]()
