from flask import Flask, render_template, request, jsonify
import os
from werkzeug.utils import secure_filename
from loading import predict_stroke
import uuid
import tensorflow as tf
import cv2
import numpy as np
from tensorflow.keras.applications.efficientnet import preprocess_input

app = Flask(__name__)

# Configuration
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'dcm'}
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max

# Ensure upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        # Generate unique filename to prevent collisions
        ext = file.filename.rsplit('.', 1)[1].lower()
        filename = f"{uuid.uuid4().hex}.{ext}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        try:
            # Get prediction from your model
            result = predict_stroke(filepath, model, class_names)
            
            # Format the response
            response = {
                'status': 'success',
                'image_url': f"/static/uploads/{filename}",
                'prediction': result['predicted_label'],
                'confidence': result['confidence'],
                'diagnosis': result['stroke_status']
            }
            
            return jsonify(response)
            
        except Exception as e:
            # Clean up the uploaded file if there was an error
            if os.path.exists(filepath):
                os.remove(filepath)
            return jsonify({'error': str(e)}), 500
        
    else:
        return jsonify({'error': 'Invalid file type. Allowed: png, jpg, jpeg, dcm'}), 400

if __name__ == '__main__':
    # Load your model once when starting the app
    model_path = 'stroke_model.h5'   
    model = tf.keras.models.load_model(model_path)
    class_names = ['Bleeding', 'Ischemia', 'Normal']
    
    app.run(debug=True)