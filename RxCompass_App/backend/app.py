from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from routes.predict import predict_route

app = Flask(__name__)
CORS(app)

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
REPORTS_FOLDER = 'reports'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(REPORTS_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['REPORTS_FOLDER'] = REPORTS_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Register routes
app.register_blueprint(predict_route)

@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "Welcome to RxCompass API! Use /api/predict to POST your CSV."})


@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "RxCompass API is running"}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)