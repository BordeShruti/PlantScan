import os
import numpy as np
import tensorflow as tf
from PIL import Image
from flask import Flask, render_template, request, redirect, url_for, jsonify, send_from_directory

# -----------------------------
# Initialize Flask app
# -----------------------------
app = Flask(__name__)

# -----------------------------
# Load trained model
# -----------------------------
model = tf.keras.models.load_model(
    r"C:\Users\SHRUTI BORDE\Desktop\mm\Plant_Disease_Prediction\models\plant_disease_model.h5"
)
print("Model loaded successfully!")

# -----------------------------
# Temporary storage for demo
# -----------------------------
users = []

# -----------------------------
# Class labels
# -----------------------------
class_name = [
    'Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy',
    'Blueberry___healthy',
    'Cherry_(including_sour)___Powdery_mildew', 'Cherry_(including_sour)___healthy',
    'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot', 'Corn_(maize)___Common_rust_', 
    'Corn_(maize)___Northern_Leaf_Blight', 'Corn_(maize)___healthy',
    'Grape___Black_rot', 'Grape___Esca_(Black_Measles)', 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)', 'Grape___healthy',
    'Orange___Haunglongbing_(Citrus_greening)',
    'Peach___Bacterial_spot', 'Peach___healthy',
    'Pepper,_bell___Bacterial_spot', 'Pepper,_bell___healthy',
    'Potato___Early_blight', 'Potato___Late_blight', 'Potato___healthy',
    'Raspberry___healthy', 'Soybean___healthy',
    'Squash___Powdery_mildew',
    'Strawberry___Leaf_scorch', 'Strawberry___healthy',
    'Tomato___Bacterial_spot', 'Tomato___Early_blight', 'Tomato___Late_blight',
    'Tomato___Leaf_Mold', 'Tomato___Septoria_leaf_spot',
    'Tomato___Spider_mites Two-spotted_spider_mite', 'Tomato___Target_Spot',
    'Tomato___Tomato_Yellow_Leaf_Curl_Virus', 'Tomato___Tomato_mosaic_virus', 'Tomato___healthy'
]

# -----------------------------
# Routes
# -----------------------------
@app.route('/')
def home():
    return render_template("index.html")  # Home page

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/register')
def register():
    return render_template('register.html')

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')


@app.route('/history')
def history():
    return render_template('history.html')

@app.route('/addplant')
def addplant():
    return render_template('addplant.html')

@app.route('/workshop')
def workshop():
    return render_template('workshop.html')

@app.route('/partnership')
def partnership():
    return render_template('patnership.html')

@app.route('/chatbot')
def chatbot():
    return render_template('chatbot.html')

@app.route('/save_user', methods=['POST'])
def save_user():
    name = request.form.get('name')
    email = request.form.get('email')
    password = request.form.get('password')
    confirm_password = request.form.get('confirmPassword')

    if password != confirm_password:
        return render_template('register.html', message="Passwords do not match!")

    users.append({'name': name, 'email': email, 'password': password})
    return redirect(url_for('login'))

# Serve static images
@app.route('/static/images/<filename>')
def serve_image(filename):
    return send_from_directory('static/images', filename)

# -----------------------------
# Prediction route
# -----------------------------
@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    try:
        # Preprocess image
        img = Image.open(file).resize((128, 128)).convert('RGB')
        input_arr = np.expand_dims(np.array(img)/255.0, axis=0)

        # Model prediction
        prediction = model.predict(input_arr)
        pred_index = int(np.argmax(prediction))
        pred_class = class_name[pred_index]
        confidence = float(np.max(prediction))

        if "___" in pred_class:
            plant_name, disease_name = pred_class.split("___")
        else:
            plant_name, disease_name = pred_class, ""

        # Determine health status
        if disease_name.lower() == "healthy" or disease_name.strip() == "":
            health_status = "healthy"
            diseases = []
        else:
            health_status = "unhealthy"
            diseases = [disease_name.replace("_", " ")]

        # Treatment recommendations
        treatment_dict = {
            "Early blight": "Apply copper-based fungicide. Remove affected leaves.",
            "Late blight": "Use fungicide spray and remove infected plants.",
            "Leaf Mold": "Improve air circulation and remove affected leaves.",
            "Septoria leaf spot": "Apply fungicide and remove infected leaves.",
            "Powdery mildew": "Use sulfur spray. Ensure proper spacing.",
            "Bacterial spot": "Apply neem oil. Remove infected parts.",
            "Gray leaf spot": "Remove affected leaves and use fungicide.",
            "Leaf scorch": "Prune damaged leaves and maintain hydration.",
            "Haunglongbing (Citrus greening)": "Remove infected branches, use pest control.",
            "Spider mites Two-spotted spider mite": "Spray with water, use miticides.",
            "Tomato Yellow Leaf Curl Virus": "Remove infected plants, control whiteflies.",
            "Tomato mosaic virus": "Remove infected plants, sanitize tools."
        }
        treatment = [treatment_dict.get(d, "Consult a gardening expert.") for d in diseases]

        result = {
            "plantName": plant_name,
            "confidence": confidence,
            "diseases": diseases,
            "healthStatus": health_status,
            "recommendedTreatment": treatment
        }

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -----------------------------
# Run app
# -----------------------------
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)

