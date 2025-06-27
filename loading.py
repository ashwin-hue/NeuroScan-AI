import tensorflow as tf
import numpy as np
import cv2
import os
import matplotlib.pyplot as plt
from tensorflow.keras.applications.efficientnet import preprocess_input

# Only load model if this script is run directly, not when imported
if __name__ == "__main__":
    model_path = 'stroke_model.h5'   
    model = tf.keras.models.load_model(model_path)
    class_names = ['Bleeding', 'Ischemia', 'Normal']
    
    # Example usage (only runs when script is executed directly)
    image_path = r"C:\Users\hp\OneDrive\Desktop\stroke_predition\ct scan\Brain_Stroke_CT_Dataset\Bleeding\PNG\10878.png"
    predict_stroke(image_path, model)

def predict_stroke(image_path, model, class_names=['Bleeding', 'Ischemia', 'Normal']):
    """
    Predict if stroke is present based on a CT scan image.

    Parameters:
    - image_path (str): Path to the input image
    - model: Loaded Keras model
    - class_names: List of class names

    Returns:
    - dict: Prediction results
    """
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Image not found at {image_path}")

    # Load and preprocess image
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError("Could not read image. Check the path or format.")
        
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img_resized = cv2.resize(img_rgb, (224, 224))
    img_array = preprocess_input(img_resized)
    img_array = np.expand_dims(img_array, axis=0)

    # Predict
    predictions = model.predict(img_array)
    predicted_index = np.argmax(predictions[0])
    predicted_label = class_names[predicted_index]
    confidence = predictions[0][predicted_index] * 100

    # Determine if stroke is present
    if predicted_label == "Normal":
        stroke_status = "No Stroke Detected"
    else:
        stroke_status = "Stroke Detected!"

    return {
        'predicted_label': predicted_label,
        'confidence': round(confidence, 2),
        'stroke_status': stroke_status,
        'image_array': img_rgb.tolist()
    }