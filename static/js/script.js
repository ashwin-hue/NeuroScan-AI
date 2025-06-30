// Handle file upload and preview
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const imagePreview = document.getElementById('imagePreview');
const analyzeBtn = document.getElementById('analyzeBtn');
const loadingSpinner = document.querySelector('.loading-spinner');

// Results elements
const resultsSection = document.getElementById('resultsSection');
const resultImage = document.getElementById('resultImage');
const diagnosisAlert = document.getElementById('diagnosisAlert');
const confidenceBar = document.getElementById('confidenceBar');
const confidenceText = document.getElementById('confidenceText');
const predictedCondition = document.getElementById('predictedCondition');
const resultCard = document.getElementById('resultCard');

// Handle drag and drop
uploadArea.addEventListener('click', () => fileInput.click());

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#005b96';
    uploadArea.style.backgroundColor = 'rgba(0, 91, 150, 0.05)';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '#ced4da';
    uploadArea.style.backgroundColor = '';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#ced4da';
    uploadArea.style.backgroundColor = '';
    
    if (e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        handleFileSelect();
    }
});

fileInput.addEventListener('change', handleFileSelect);

function handleFileSelect() {
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
            analyzeBtn.disabled = false;
            
            // Update result preview immediately
            resultImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// Real analysis with Flask backend
analyzeBtn.addEventListener('click', async function() {
    // Show loading spinner
    loadingSpinner.style.display = 'block';
    analyzeBtn.disabled = true;
    
    // Hide previous results
    resultsSection.style.display = 'none';
    
    const file = fileInput.files[0];
    if (!file) {
        alert('Please select a file first');
        loadingSpinner.style.display = 'none';
        analyzeBtn.disabled = false;
        return;
    }

    // Create FormData object and append the file
    const formData = new FormData();
    formData.append('file', file);

    try {
        // Send the file to Flask backend
        const response = await fetch('/analyze', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        // Update UI with real results from Flask
        resultImage.src = `data:image/jpeg;base64,${data.image_data}`;
        confidenceBar.style.width = `${data.confidence}%`;
        confidenceText.textContent = `${data.confidence}% confidence`;
        predictedCondition.textContent = data.prediction;

        // Set appropriate alert style based on diagnosis
        if (data.prediction === 'Normal') {
            diagnosisAlert.innerHTML = `<i class="fas fa-check-circle me-2 text-success"></i> ${data.diagnosis}`;
            diagnosisAlert.className = 'alert alert-success';
            resultCard.classList.remove('stroke-detected');
            resultCard.classList.add('no-stroke');
        } else {
            diagnosisAlert.innerHTML = `<i class="fas fa-exclamation-triangle me-2 text-danger"></i> ${data.diagnosis}: ${data.prediction}`;
            diagnosisAlert.className = 'alert alert-danger';
            resultCard.classList.remove('no-stroke');
            resultCard.classList.add('stroke-detected');
        }

        // Show results section
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error('Error:', error);
        diagnosisAlert.innerHTML = `<i class="fas fa-exclamation-circle me-2 text-warning"></i> Error: ${error.message}`;
        diagnosisAlert.className = 'alert alert-warning';
        resultsSection.style.display = 'block';
    } finally {
        // Hide loading spinner and re-enable button
        loadingSpinner.style.display = 'none';
        analyzeBtn.disabled = false;
    }
});


// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

  const doctorData = {
    anna_nagar: [
      { name: "Dr. M. Kodeeswaran", specialty: "Neurologist", rating: "5.0", experience: "24 years" },
      { name: "Dr. N Thamil Pavai", specialty: "General Medicine, Neurology", rating: "4.0", experience: "29 years" },
      { name: "Dr. Kannan", specialty: "General Physician, Neurology", rating: "4.0", experience: "33 years" },
      { name: "Dr. M. Abid Saliya", specialty: "General Physician, Neurology", rating: "4.5", experience: "19 years" },
      { name: "Dr. T.Arul Mozhi", specialty: "v", rating: "4.5", experience: "27 years" }
    ],
    t_nagar: [
      { name: "Dr. Srikanth Srinivasan", specialty: "Neurology", rating: "4.5", experience: "30 years" }
    ],
    adyar: [
      { name: "Dr. Nagarajan V", specialty: "General Medicine, Neurology", rating: "4.5", experience: "50 years" },
      { name: "Dr. Karthikeyan", specialty: "General Medicine, Neurology", rating: "4.5", experience: "17 years" },
      { name: "Dr. V.Soundappan", specialty: " General Surgery,Neuro Surgery", rating: "5.0", experience: "45 years" }
    ],
    velachery: [
      { name: "Dr. Srinivasan Mariappan", specialty: "Neurology,Pediatrics", rating: "4.6", experience: "9 years" },
      { name: "Dr. Krishna Kumar", specialty: " General Medicine, Neurology", rating: "3.9", experience: "25 years" }
    ]
  };

function showDoctors() {
    const location = document.getElementById("locationSelect").value;
    const doctorDiv = document.getElementById("doctorInfo");
    const doctors = doctorData[location];

    if (!doctors) {
      doctorDiv.innerHTML = "<p class='text-danger'>No doctors found for this location.</p>";
      return;
    }

    let output = "<h4 class='fw-semibold mb-3'>Available Doctors:</h4><ul class='list-group'>";
    doctors.forEach(doc => {
      output += `
        <li class='list-group-item'>
          <strong>${doc.name}</strong><br/>
          Specialty: ${doc.specialty}<br/>
          Rating: ⭐ ${doc.rating} / 5<br/>
          Experience: ${doc.experience}
        </li>`;
    });
    output += "</ul>";

    doctorDiv.innerHTML = output;
  }

