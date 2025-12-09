// ==== DOM ELEMENTS ====
const fileInput = document.getElementById('file-input');
const uploadBtn = document.getElementById('upload-btn');
const cameraBtn = document.getElementById('camera-btn');
const video = document.getElementById('video');
const cameraContainer = document.getElementById('camera-container');
const captureBtn = document.getElementById('capture-btn');
const cancelBtn = document.getElementById('cancel-btn');
const plantImage = document.getElementById('plant-image');
const imagePreview = document.getElementById('image-preview');
const loading = document.getElementById('loading');
const errorMsg = document.getElementById('error-msg');
const resultsSection = document.getElementById('results');
const plantInfo = document.getElementById('plant-info');
const healthStatus = document.getElementById('health-status');
const treatmentSection = document.getElementById('treatment-section');
const resetBtn = document.getElementById('reset-btn');
const analyzeAgainBtn = document.getElementById('analyze-again');
const greetingElement = document.getElementById('greetingText');
const dateSpan = document.querySelector(".date strong");

let stream = null;

// ==== FILE UPLOAD ====
uploadBtn.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    await sendToServer(file);
});

// ==== SEND IMAGE TO FLASK ====
async function sendToServer(file) {
    loading.style.display = 'block';
    errorMsg.style.display = 'none';

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/predict', { method: 'POST', body: formData });
        const result = await response.json();

        if (result.error) {
            showError(result.error);
        } else {
            showImage(URL.createObjectURL(file));
            displayResults(result);
        }
    } catch (err) {
        showError('Error uploading image.');
    } finally {
        loading.style.display = 'none';
    }
}

// ==== SHOW IMAGE ====
function showImage(src) {
    plantImage.src = src;
    imagePreview.style.display = 'block';
    resultsSection.style.display = 'none';
}

// ==== DISPLAY RESULTS ====
function displayResults(result) {
    resultsSection.style.display = 'block'; // vertical layout

    plantInfo.innerHTML = `
        <h4>Plant Identification</h4>
        <p><strong>${result.plantName}</strong></p>
        <p>Confidence: ${(result.confidence * 100).toFixed(1)}%</p>
    `;

    healthStatus.innerHTML = `
        <h4>Status</h4>
        <p>${result.healthStatus === 'healthy' ? 'Healthy' : 'Needs Attention'}</p>
        ${result.diseases.length > 0 ? '<ul>' + result.diseases.map(d => `<li>${d}</li>`).join('') + '</ul>' : ''}
    `;

    treatmentSection.innerHTML = result.recommendedTreatment.length > 0
        ? `<h4>Recommended Treatments</h4>${result.recommendedTreatment.map(t => `<p>${t}</p>`).join('')}`
        : '';
}

// ==== RESET / ANALYZE AGAIN ====
if (resetBtn) {
    resetBtn.addEventListener('click', resetAll);
}

if (analyzeAgainBtn) {
    analyzeAgainBtn.addEventListener('click', resetAll);
}

function resetAll() {
    if (imagePreview) imagePreview.style.display = 'none';
    if (fileInput) fileInput.value = '';
    if (resultsSection) resultsSection.style.display = 'none';
    if (errorMsg) errorMsg.style.display = 'none';
}


// ==== ERROR HANDLING ====
function showError(msg) {
    errorMsg.innerText = msg;
    errorMsg.style.display = 'block';
}

// ==== DISEASE TREATMENTS ====
function getTreatment(disease) {
    const recommendations = {
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
    };
    return recommendations[disease] || "Consult a gardening expert.";
}

// ==== BUTTON HOVER EFFECT ====
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseover', () => btn.style.transform = 'translateY(-2px)');
    btn.addEventListener('mouseout', () => btn.style.transform = 'translateY(0)');
});

// ==== LOGOUT BUTTON ====


// Logout button
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {

        // Clear user info from localStorage
        localStorage.removeItem("username");
        localStorage.removeItem("userEmail");

        // Redirect to Flask home route (index.html)
        window.location.href = "/";
    });
}




// ==== PROFILE IMAGE REDIRECT ====
const profileImage = document.getElementById('profileimage');
if (profileImage) {
    profileImage.addEventListener('click', () => window.location.href = 'login.html');
}

function updateGreeting() {
    const now = new Date();
    const hour = now.getHours();
    let timeOfDay = hour < 12 ? "Morning" : hour < 17 ? "Afternoon" : "Evening";
    const name = localStorage.getItem("username") || "User";
    if (greetingElement) greetingElement.textContent = `Good ${timeOfDay}, ${name}!`;
}
updateGreeting();

// ==== DATE DISPLAY ====
if (dateSpan) {
    dateSpan.textContent = new Date().toLocaleDateString();
}

// ==== LOCAL STORAGE EXAMPLE ====
const useremail = localStorage.getItem("userEmail") || "user@example.com";
localStorage.setItem("userEmail", useremail);
