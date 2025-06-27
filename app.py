from flask import Flask, render_template, request, jsonify
from io import BytesIO
from PIL import Image
import numpy as np
import tensorflow as tf
import cv2
import base64

from tensorflow.keras.applications.efficientnet import preprocess_input
from loading import predict_stroke  # your custom function

app = Flask(__name__)

# Load your model once
model = tf.keras.models.load_model('stroke_model.h5')
class_names = ['Bleeding', 'Ischemia', 'Normal']

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'png', 'jpg', 'jpeg'}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    if file and allowed_file(file.filename):
        try:
            # Read the image in memory
            image_stream = BytesIO(file.read())
            image = Image.open(image_stream).convert('RGB')

            # Encode image to base64 for frontend preview
            image_stream.seek(0)
            img_b64 = base64.b64encode(image_stream.read()).decode('utf-8')

            # Resize and preprocess image for prediction
            img_array = np.array(image)
            img_resized = cv2.resize(img_array, (224, 224))
            img_input = preprocess_input(img_resized.astype(np.float32))
            img_input = np.expand_dims(img_input, axis=0)

            # Prediction
            prediction = model.predict(img_input)[0]
            predicted_label = class_names[np.argmax(prediction)]
            confidence = round(np.max(prediction) * 100, 2)
            stroke_status = "No Stroke Detected" if predicted_label == "Normal" else "Stroke Suspected"

            return jsonify({
                'status': 'success',
                'image_data': img_b64,  # 👈 Send base64 string here
                'prediction': predicted_label,
                'confidence': confidence,
                'diagnosis': stroke_status
            })

        except Exception as e:
            return jsonify({'error': str(e)}), 500
    else:
        return jsonify({'error': 'Invalid file type'}), 400

if __name__ == '__main__':
    app.run(debug=True)
