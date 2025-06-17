/**
 * Star Player Dependency Analyzer
 * Main application script for analyzing dependency on key individuals
 */

// Application State
const appState = {
    currentStep: 1,
    teamInfo: {
        name: '',
        type: '',
        date: ''
    },
    individuals: [],
    areas: [],
    assessments: {},
    results: {
        overallScore: 0,
        individualScores: {},
        areaRisks: {},
        recommendations: []
    }
};

// DOM Elements
const elements = {
    // Steps
    stepIndicators: [
        document.getElementById('step1-indicator'),
        document.getElementById('step2-indicator'),
        document.getElementById('step3-indicator'),
        document.getElementById('step4-indicator'),
        document.getElementById('step5-indicator')
    ],
    stepContainers: [
        document.getElementById('step1'),
        document.getElementById('step2'),
        document.getElementById('step3'),
        document.getElementById('step4'),
        document.getElementById('step5')
    ],
    
    // Step 1: Team Info
    teamName: document.getElementById('teamName'),
    teamType: document.getElementById('teamType'),
    assessmentDate: document.getElementById('assessmentDate'),
    
    // Step 2: Key Individuals
    individualsContainer: document.getElementById('individualsContainer'),
    addIndividualBtn: document.getElementById('addIndividual'),
    
    // Step 3: Performance Areas
    areasContainer: document.getElementById('areasContainer'),
    addAreaBtn: document.getElementById('addArea'),
    
    // Step 4: Assessment
    assessmentContainer: document.getElementById('assessmentContainer'),
    
    // Step 5: Results
    overallScoreValue: document.getElementById('overallScoreValue'),
    individualScoresCanvas: document.getElementById('individualScoresCanvas'),
    areaRiskCanvas: document.getElementById('areaRiskCanvas'),
    detailedRiskAnalysis: document.getElementById('detailedRiskAnalysis'),
    recommendationsContainer: document.getElementById('recommendationsContainer'),
    
    // Navigation
    navButtons: {
        step1Next: document.getElementById('step1Next'),
        step2Prev: document.getElementById('step2Prev'),
        step2Next: document.getElementById('step2Next'),
        step3Prev: document.getElementById('step3Prev'),
        step3Next: document.getElementById('step3Next'),
        step4Prev: document.getElementById('step4Prev'),
        step4Next: document.getElementById('step4Next'),
        step5Prev: document.getElementById('step5Prev'),
        restart: document.getElementById('restart'),
        exportPDF: document.getElementById('exportPDF')
    },
    
    // Save/Load
    newAssessmentBtn: document.getElementById('newAssessment'),
    saveAssessmentBtn: document.getElementById('saveAssessment'),
    loadAssessmentBtn: document.getElementById('loadAssessment'),
    saveLoadModal: new bootstrap.Modal(document.getElementById('saveLoadModal')),
    saveLoadModalTitle: document.getElementById('saveLoadModalTitle'),
    saveLoadModalBody: document.getElementById('saveLoadModalBody'),
    saveLoadConfirmBtn: document.getElementById('saveLoadConfirm')
};

// Initialize the application
function initApp() {
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    elements.assessmentDate.value = today;
    
    // Add event listeners for navigation
    addNavigationListeners();
    
    // Add event listeners for individual and area management
    addIndividualAndAreaListeners();
    
    // Add event listeners for save/load functionality
    addSaveLoadListeners();
    
    // Update range input display values
    updateRangeInputDisplays();
}

// Navigation Functions
function addNavigationListeners() {
    // Step 1 to Step 2
    elements.navButtons.step1Next.addEventListener('click', () => {
        if (validateStep1()) {
            saveStep1Data();
            navigateToStep(2);
        }
    });
    
    // Step 2 navigation
    elements.navButtons.step2Prev.addEventListener('click', () => navigateToStep(1));
    elements.navButtons.step2Next.addEventListener('click', () => {
        if (validateStep2()) {
            saveStep2Data();
            navigateToStep(3);
        }
    });
    
    // Step 3 navigation
    elements.navButtons.step3Prev.addEventListener('click', () => navigateToStep(2));
    elements.navButtons.step3Next.addEventListener('click', () => {
        if (validateStep3()) {
            saveStep3Data();
            generateAssessmentMatrix();
            navigateToStep(4);
        }
    });
    
    // Step 4 navigation
    elements.navButtons.step4Prev.addEventListener('click', () => navigateToStep(3));
    elements.navButtons.step4Next.addEventListener('click', () => {
        if (validateStep4()) {
            saveStep4Data();
            calculateResults();
            displayResults();
            navigateToStep(5);
        }
    });
    
    // Step 5 navigation
    elements.navButtons.step5Prev.addEventListener('click', () => navigateToStep(4));
    elements.navButtons.restart.addEventListener('click', resetApplication);
    elements.navButtons.exportPDF.addEventListener('click', exportResultsAsPDF);
}

function navigateToStep(stepNumber) {
    // Update current step in state
    appState.currentStep = stepNumber;
    
    // Update step indicators
    elements.stepIndicators.forEach((indicator, index) => {
        if (index + 1 < stepNumber) {
            indicator.classList.add('active');
        } else if (index + 1 === stepNumber) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
    
    // Show current step container, hide others
    elements.stepContainers.forEach((container, index) => {
        if (index + 1 === stepNumber) {
            container.classList.remove('d-none');
        } else {
            container.classList.add('d-none');
        }
    });
}

// Validation Functions
function validateStep1() {
    if (!elements.teamName.value.trim()) {
        alert('Please enter a team or organization name.');
        return false;
    }
    if (!elements.assessmentDate.value) {
        alert('Please select an assessment date.');
        return false;
    }
    return true;
}

function validateStep2() {
    const individualEntries = document.querySelectorAll('.individual-entry');
    if (individualEntries.length === 0) {
        alert('Please add at least one key individual.');
        return false;
    }
    
    for (let entry of individualEntries) {
        const name = entry.querySelector('.individual-name').value.trim();
        const role = entry.querySelector('.individual-role').value.trim();
        
        if (!name || !role) {
            alert('Please complete all individual name and role fields.');
            return false;
        }
    }
    
    return true;
}

function validateStep3() {
    const areaEntries = document.querySelectorAll('.area-entry');
    if (areaEntries.length === 0) {
        alert('Please add at least one performance area.');
        return false;
    }
    
    for (let entry of areaEntries) {
        const name = entry.querySelector('.area-name').value.trim();
        
        if (!name) {
            alert('Please complete all performance area name fields.');
            return false;
        }
    }
    
    return true;
}

function validateStep4() {
    const ratingInputs = document.querySelectorAll('.rating-input');
    for (let input of ratingInputs) {
        if (!input.value) {
            alert('Please complete all dependency ratings.');
            return false;
        }
    }
    
    return true;
}

// Data Management Functions
function saveStep1Data() {
    appState.teamInfo = {
        name: elements.teamName.value.trim(),
        type: elements.teamType.value,
        date: elements.assessmentDate.value
    };
}

function saveStep2Data() {
    appState.individuals = [];
    const individualEntries = document.querySelectorAll('.individual-entry');
    
    individualEntries.forEach(entry => {
        appState.individuals.push({
            name: entry.querySelector('.individual-name').value.trim(),
            role: entry.querySelector('.individual-role').value.trim(),
            description: entry.querySelector('.individual-desc').value.trim()
        });
    });
}

function saveStep3Data() {
    appState.areas = [];
    const areaEntries = document.querySelectorAll('.area-entry');
    
    areaEntries.forEach(entry => {
        appState.areas.push({
            name: entry.querySelector('.area-name').value.trim(),
            weight: parseInt(entry.querySelector('.area-weight').value)
        });
    });
}

function saveStep4Data() {
    appState.assessments = {};
    
    appState.individuals.forEach(individual => {
        appState.assessments[individual.name] = {};
        
        appState.areas.forEach(area => {
            const inputId = `rating-${individual.name.replace(/\s+/g, '-')}-${area.name.replace(/\s+/g, '-')}`;
            const ratingInput = document.getElementById(inputId);
            appState.assessments[individual.name][area.name] = parseInt(ratingInput.value);
        });
    });
}

// Individual and Area Management
function addIndividualAndAreaListeners() {
    // Add new individual
    elements.addIndividualBtn.addEventListener('click', addIndividual);
    
    // Add new performance area
    elements.addAreaBtn.addEventListener('click', addPerformanceArea);
    
    // Delete area button listeners
    document.addEventListener('click', event => {
        if (event.target.classList.contains('delete-area') || 
            event.target.parentElement.classList.contains('delete-area')) {
            const button = event.target.classList.contains('delete-area') ? 
                event.target : event.target.parentElement;
            const areaEntry = button.closest('.area-entry');
            
            if (document.querySelectorAll('.area-entry').length > 1) {
                areaEntry.remove();
            } else {
                alert('You must keep at least one performance area.');
            }
        }
    });
    
    // Update range input display values
    document.addEventListener('input', event => {
        if (event.target.classList.contains('area-weight')) {
            const valueDisplay = event.target.parentElement.querySelector('.weight-value');
            if (valueDisplay) {
                valueDisplay.textContent = event.target.value;
            }
        }
    });
}

function addIndividual() {
    const newIndividual = document.createElement('div');
    newIndividual.className = 'individual-entry mb-3 p-3 border rounded';
    newIndividual.innerHTML = `
        <div class="row">
            <div class="col-md-6 mb-2">
                <label class="form-label">Name</label>
                <input type="text" class="form-control individual-name" placeholder="Individual's name">
            </div>
            <div class="col-md-6 mb-2">
                <label class="form-label">Role/Position</label>
                <input type="text" class="form-control individual-role" placeholder="Role or position">
            </div>
        </div>
        <div class="mb-2">
            <label class="form-label">Brief Description</label>
            <textarea class="form-control individual-desc" rows="2" placeholder="Key responsibilities, unique skills, etc."></textarea>
        </div>
        <div class="text-end">
            <button class="btn btn-sm btn-outline-danger delete-individual"><i class="bi bi-trash"></i> Remove</button>
        </div>
    `;
    
    elements.individualsContainer.appendChild(newIndividual);
    
    // Add event listener for the new delete button
    const deleteBtn = newIndividual.querySelector('.delete-individual');
    deleteBtn.addEventListener('click', () => {
        if (document.querySelectorAll('.individual-entry').length > 1) {
            newIndividual.remove();
        } else {
            alert('You must keep at least one individual.');
        }
    });
}

function addPerformanceArea() {
    const newArea = document.createElement('div');
    newArea.className = 'area-entry mb-3 p-3 border rounded';
    newArea.innerHTML = `
        <div class="row align-items-center">
            <div class="col-md-5 mb-2">
                <label class="form-label">Performance Area</label>
                <input type="text" class="form-control area-name" placeholder="e.g., Scoring, Leadership">
            </div>
            <div class="col-md-5 mb-2">
                <label class="form-label">Weight (Importance)</label>
                <input type="range" class="form-range area-weight" min="1" max="10" value="5">
                <div class="d-flex justify-content-between">
                    <small>Low</small>
                    <small class="weight-value">5</small>
                    <small>High</small>
                </div>
            </div>
            <div class="col-md-2 mb-2 text-end d-flex align-items-end justify-content-end">
                <button class="btn btn-sm btn-outline-danger delete-area"><i class="bi bi-trash"></i></button>
            </div>
        </div>
    `;
    
    elements.areasContainer.appendChild(newArea);
}

function updateRangeInputDisplays() {
    document.querySelectorAll('.area-weight').forEach(range => {
        const valueDisplay = range.parentElement.querySelector('.weight-value');
        if (valueDisplay) {
            valueDisplay.textContent = range.value;
        }
    });
}

// Assessment Matrix Generation
function generateAssessmentMatrix() {
    elements.assessmentContainer.innerHTML = '';
    
    appState.individuals.forEach(individual => {
        const matrix = document.createElement('div');
        matrix.className = 'assessment-matrix';
        
        let matrixHTML = `
            <div class="matrix-header">
                ${individual.name} - ${individual.role}
            </div>
            <div class="matrix-body">
        `;
        
        appState.areas.forEach(area => {
            const inputId = `rating-${individual.name.replace(/\s+/g, '-')}-${area.name.replace(/\s+/g, '-')}`;
            
            matrixHTML += `
                <div class="assessment-row">
                    <div class="area-label">${area.name}</div>
                    <div class="rating-container">
                        <input type="range" class="form-range rating-input" id="${inputId}" min="1" max="10" value="5">
                        <span class="rating-label ms-2" id="${inputId}-value">5</span>
                    </div>
                </div>
            `;
        });
        
        matrixHTML += `</div>`;
        matrix.innerHTML = matrixHTML;
        elements.assessmentContainer.appendChild(matrix);
        
        // Add event listeners for rating inputs
        matrix.querySelectorAll('.rating-input').forEach(input => {
            const valueDisplay = document.getElementById(`${input.id}-value`);
            input.addEventListener('input', () => {
                valueDisplay.textContent = input.value;
            });
        });
    });
}

// Results Calculation and Display
function calculateResults() {
    // Reset results
    appState.results = {
        overallScore: 0,
        individualScores: {},
        areaRisks: {},
        recommendations: []
    };
    
    // Calculate individual dependency scores
    appState.individuals.forEach(individual => {
        let totalScore = 0;
        let totalWeight = 0;
        
        appState.areas.forEach(area => {
            const rating = appState.assessments[individual.name][area.name];
            const weight = area.weight;
            
            totalScore += rating * weight;
            totalWeight += weight;
        });
        
        // Calculate weighted average score for this individual
        const weightedScore = totalWeight > 0 ? (totalScore / totalWeight) * 10 : 0;
        appState.results.individualScores[individual.name] = Math.round(weightedScore);
    });
    
    // Calculate area risk scores
    appState.areas.forEach(area => {
        let totalRating = 0;
        
        appState.individuals.forEach(individual => {
            totalRating += appState.assessments[individual.name][area.name];
        });
        
        // Calculate average rating for this area across all individuals
        const averageRating = appState.individuals.length > 0 ? 
            totalRating / appState.individuals.length : 0;
        
        // Calculate risk score (higher dependency = higher risk)
        appState.results.areaRisks[area.name] = Math.round(averageRating * area.weight / 10);
    });
    
    // Calculate overall dependency score
    let totalIndividualScore = 0;
    const individualCount = Object.keys(appState.results.individualScores).length;
    
    for (const individual in appState.results.individualScores) {
        totalIndividualScore += appState.results.individualScores[individual];
    }
    
    appState.results.overallScore = individualCount > 0 ? 
        Math.round(totalIndividualScore / individualCount) : 0;
    
    // Generate recommendations
    generateRecommendations();
}

function generateRecommendations() {
    const recommendations = [];
    
    // Add general recommendation based on overall score
    if (appState.results.overallScore >= 70) {
        recommendations.push({
            title: 'High Overall Dependency Risk',
            description: 'Your organization shows high dependency on key individuals. Consider implementing succession planning and knowledge sharing programs across all areas.'
        });
    } else if (appState.results.overallScore >= 40) {
        recommendations.push({
            title: 'Moderate Overall Dependency Risk',
            description: 'Your organization has moderate dependency on key individuals. Focus on the high-risk areas identified in the detailed analysis.'
        });
    } else {
        recommendations.push({
            title: 'Low Overall Dependency Risk',
            description: 'Your organization shows good resilience with low dependency on key individuals. Continue monitoring and maintaining good practices.'
        });
    }
    
    // Add recommendations for high-risk individuals
    for (const individual in appState.results.individualScores) {
        const score = appState.results.individualScores[individual];
        if (score >= 75) {
            recommendations.push({
                title: `High Dependency on ${individual}`,
                description: `Consider developing backup talent and documenting key processes to reduce reliance on ${individual}.`
            });
        }
    }
    
    // Add recommendations for high-risk areas
    for (const area in appState.results.areaRisks) {
        const risk = appState.results.areaRisks[area];
        if (risk >= 7) {
            recommendations.push({
                title: `High Risk in ${area}`,
                description: `Develop strategies to distribute responsibilities and knowledge in the ${area} area across multiple team members.`
            });
        }
    }
    
    // Add general recommendations
    recommendations.push({
        title: 'Knowledge Documentation',
        description: 'Implement formal documentation processes to capture key knowledge and decision-making frameworks from essential personnel.'
    });
    
    recommendations.push({
        title: 'Cross-Training Program',
        description: 'Establish a cross-training program where team members can learn skills from key individuals to create redundancy in critical functions.'
    });
    
    appState.results.recommendations = recommendations;
}

function displayResults() {
    // Display overall score
    elements.overallScoreValue.textContent = appState.results.overallScore;
    
    // Create individual scores chart
    const individualNames = Object.keys(appState.results.individualScores);
    const individualScores = individualNames.map(name => appState.results.individualScores[name]);
    
    new Chart(elements.individualScoresCanvas, {
        type: 'bar',
        data: {
            labels: individualNames,
            datasets: [{
                label: 'Dependency Score',
                data: individualScores,
                backgroundColor: 'rgba(13, 110, 253, 0.7)',
                borderColor: 'rgba(13, 110, 253, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Dependency Score (0-100)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Score: ${context.raw}`;
                        }
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
    
    // Create area risk chart
    const areaNames = Object.keys(appState.results.areaRisks);
    const areaRisks = areaNames.map(name => appState.results.areaRisks[name]);
    
    new Chart(elements.areaRiskCanvas, {
        type: 'radar',
        data: {
            labels: areaNames,
            datasets: [{
                label: 'Risk Level',
                data: areaRisks,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                pointBackgroundColor: 'rgba(255, 99, 132, 1)'
            }]
        },
        options: {
            scales: {
                r: {
                    beginAtZero: true,
                    max: 10,
                    ticks: {
                        stepSize: 2
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
    
    // Display detailed risk analysis
    let detailedAnalysisHTML = '<ul class="list-group">';
    
    // Sort individuals by dependency score (highest first)
    const sortedIndividuals = individualNames.sort((a, b) => 
        appState.results.individualScores[b] - appState.results.individualScores[a]);
    
    sortedIndividuals.forEach(individual => {
        const score = appState.results.individualScores[individual];
        let riskLevel = 'Low';
        let textClass = 'text-success';
        
        if (score >= 70) {
            riskLevel = 'High';
            textClass = 'text-danger';
        } else if (score >= 40) {
            riskLevel = 'Medium';
            textClass = 'text-warning';
        }
        
        detailedAnalysisHTML += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                ${individual}
                <span class="badge bg-primary rounded-pill">${score}</span>
                <span class="${textClass}">${riskLevel} Risk</span>
            </li>
        `;
    });
    
    detailedAnalysisHTML += '</ul>';
    elements.detailedRiskAnalysis.innerHTML = detailedAnalysisHTML;
    
    // Display recommendations
    let recommendationsHTML = '';
    
    appState.results.recommendations.forEach(recommendation => {
        recommendationsHTML += `
            <div class="recommendation-item">
                <h5 class="recommendation-title">${recommendation.title}</h5>
                <p class="recommendation-description">${recommendation.description}</p>
            </div>
        `;
    });
    
    elements.recommendationsContainer.innerHTML = recommendationsHTML;
    
    // Create risk needle
    const overallRiskMeter = document.getElementById('overallRiskMeter');
    const riskNeedle = document.createElement('div');
    riskNeedle.className = 'risk-needle';
    overallRiskMeter.appendChild(riskNeedle);
    
    // Animate risk needle
    setTimeout(() => {
        const angle = (appState.results.overallScore / 100) * 180 - 90;
        riskNeedle.style.transform = `rotate(${angle}deg)`;
    }, 100);
}

// Save/Load Functionality
function addSaveLoadListeners() {
    elements.saveAssessmentBtn.addEventListener('click', showSaveModal);
    elements.loadAssessmentBtn.addEventListener('click', showLoadModal);
    elements.newAssessmentBtn.addEventListener('click', resetApplication);
}

function showSaveModal() {
    elements.saveLoadModalTitle.textContent = 'Save Assessment';
    
    elements.saveLoadModalBody.innerHTML = `
        <div class="mb-3">
            <label for="saveFileName" class="form-label">Assessment Name</label>
            <input type="text" class="form-control" id="saveFileName" 
                value="${appState.teamInfo.name || ''} Assessment - ${new Date().toLocaleDateString()}">
        </div>
        <p class="text-muted">This will save the assessment to your browser's local storage.</p>
    `;
    
    elements.saveLoadConfirmBtn.textContent = 'Save';
    elements.saveLoadConfirmBtn.onclick = saveAssessment;
    
    elements.saveLoadModal.show();
}

function showLoadModal() {
    elements.saveLoadModalTitle.textContent = 'Load Assessment';
    
    // Get saved assessments from local storage
    const savedAssessments = getSavedAssessments();
    
    if (savedAssessments.length === 0) {
        elements.saveLoadModalBody.innerHTML = `
            <p>No saved assessments found.</p>
        `;
        elements.saveLoadConfirmBtn.style.display = 'none';
    } else {
        let assessmentOptions = '';
        savedAssessments.forEach(assessment => {
            assessmentOptions += `<option value="${assessment.id}">${assessment.name}</option>`;
        });
        
        elements.saveLoadModalBody.innerHTML = `
            <div class="mb-3">
                <label for="loadAssessmentSelect" class="form-label">Select Assessment</label>
                <select class="form-select" id="loadAssessmentSelect">
                    ${assessmentOptions}
                </select>
            </div>
        `;
        
        elements.saveLoadConfirmBtn.textContent = 'Load';
        elements.saveLoadConfirmBtn.style.display = 'block';
        elements.saveLoadConfirmBtn.onclick = loadAssessment;
    }
    
    elements.saveLoadModal.show();
}

function saveAssessment() {
    const saveFileName = document.getElementById('saveFileName').value.trim();
    
    if (!saveFileName) {
        alert('Please enter a name for this assessment.');
        return;
    }
    
    const assessmentData = {
        id: Date.now().toString(),
        name: saveFileName,
        date: new Date().toISOString(),
        data: JSON.stringify(appState)
    };
    
    const savedAssessments = getSavedAssessments();
    savedAssessments.push(assessmentData);
    
    localStorage.setItem('starDependencyAnalyzer_savedAssessments', JSON.stringify(savedAssessments));
    
    elements.saveLoadModal.hide();
    alert('Assessment saved successfully!');
}

function loadAssessment() {
    const selectElement = document.getElementById('loadAssessmentSelect');
    const assessmentId = selectElement.value;
    
    const savedAssessments = getSavedAssessments();
    const assessment = savedAssessments.find(a => a.id === assessmentId);
    
    if (assessment) {
        try {
            const loadedState = JSON.parse(assessment.data);
            
            // Update application state
            Object.assign(appState, loadedState);
            
            // Update UI for current step
            navigateToStep(1);
            populateFormFields();
            
            elements.saveLoadModal.hide();
            alert('Assessment loaded successfully!');
        } catch (error) {
            console.error('Error loading assessment:', error);
            alert('Error loading assessment. The saved data may be corrupted.');
        }
    }
}

function getSavedAssessments() {
    const savedData = localStorage.getItem('starDependencyAnalyzer_savedAssessments');
    return savedData ? JSON.parse(savedData) : [];
}

function populateFormFields() {
    // Populate Step 1
    elements.teamName.value = appState.teamInfo.name || '';
    elements.teamType.value = appState.teamInfo.type || 'sports';
    elements.assessmentDate.value = appState.teamInfo.date || '';
    
    // Populate Step 2
    elements.individualsContainer.innerHTML = '';
    if (appState.individuals.length > 0) {
        appState.individuals.forEach(individual => {
            const individualElement = document.createElement('div');
            individualElement.className = 'individual-entry mb-3 p-3 border rounded';
            individualElement.innerHTML = `
                <div class="row">
                    <div class="col-md-6 mb-2">
                        <label class="form-label">Name</label>
                        <input type="text" class="form-control individual-name" value="${individual.name}">
                    </div>
                    <div class="col-md-6 mb-2">
                        <label class="form-label">Role/Position</label>
                        <input type="text" class="form-control individual-role" value="${individual.role}">
                    </div>
                </div>
                <div class="mb-2">
                    <label class="form-label">Brief Description</label>
                    <textarea class="form-control individual-desc" rows="2">${individual.description || ''}</textarea>
                </div>
                <div class="text-end">
                    <button class="btn btn-sm btn-outline-danger delete-individual"><i class="bi bi-trash"></i> Remove</button>
                </div>
            `;
            
            elements.individualsContainer.appendChild(individualElement);
            
            // Add event listener for the delete button
            const deleteBtn = individualElement.querySelector('.delete-individual');
            deleteBtn.addEventListener('click', () => {
                if (document.querySelectorAll('.individual-entry').length > 1) {
                    individualElement.remove();
                } else {
                    alert('You must keep at least one individual.');
                }
            });
        });
    } else {
        addIndividual(); // Add a default entry if none exists
    }
    
    // Populate Step 3
    elements.areasContainer.innerHTML = '';
    if (appState.areas.length > 0) {
        appState.areas.forEach(area => {
            const areaElement = document.createElement('div');
            areaElement.className = 'area-entry mb-3 p-3 border rounded';
            areaElement.innerHTML = `
                <div class="row align-items-center">
                    <div class="col-md-5 mb-2">
                        <label class="form-label">Performance Area</label>
                        <input type="text" class="form-control area-name" value="${area.name}">
                    </div>
                    <div class="col-md-5 mb-2">
                        <label class="form-label">Weight (Importance)</label>
                        <input type="range" class="form-range area-weight" min="1" max="10" value="${area.weight}">
                        <div class="d-flex justify-content-between">
                            <small>Low</small>
                            <small class="weight-value">${area.weight}</small>
                            <small>High</small>
                        </div>
                    </div>
                    <div class="col-md-2 mb-2 text-end d-flex align-items-end justify-content-end">
                        <button class="btn btn-sm btn-outline-danger delete-area"><i class="bi bi-trash"></i></button>
                    </div>
                </div>
            `;
            
            elements.areasContainer.appendChild(areaElement);
        });
    }
    
    // For Step 4 and 5, we'll regenerate them when the user navigates to those steps
}

// PDF Export
function exportResultsAsPDF() {
    alert('PDF export feature will be implemented in a future version.');
    // This would typically use a library like jsPDF or html2pdf to generate a PDF
}

// Reset Application
function resetApplication() {
    if (confirm('Are you sure you want to start a new assessment? All unsaved data will be lost.')) {
        // Reset application state
        appState.currentStep = 1;
        appState.teamInfo = { name: '', type: '', date: '' };
        appState.individuals = [];
        appState.areas = [];
        appState.assessments = {};
        appState.results = {
            overallScore: 0,
            individualScores: {},
            areaRisks: {},
            recommendations: []
        };
        
        // Reset form fields
        elements.teamName.value = '';
        elements.teamType.value = 'sports';
        elements.assessmentDate.value = new Date().toISOString().split('T')[0];
        
        elements.individualsContainer.innerHTML = '';
        addIndividual();
        
        // Reset areas to default
        elements.areasContainer.innerHTML = '';
        const defaultAreas = [
            { name: 'Scoring/Revenue Generation', weight: 8 },
            { name: 'Leadership/Decision Making', weight: 7 },
            { name: 'Fan/Customer Engagement', weight: 6 },
            { name: 'Media/Public Relations', weight: 5 }
        ];
        
        defaultAreas.forEach(area => {
            const areaElement = document.createElement('div');
            areaElement.className = 'area-entry mb-3 p-3 border rounded';
            areaElement.innerHTML = `
                <div class="row align-items-center">
                    <div class="col-md-5 mb-2">
                        <label class="form-label">Performance Area</label>
                        <input type="text" class="form-control area-name" value="${area.name}">
                    </div>
                    <div class="col-md-5 mb-2">
                        <label class="form-label">Weight (Importance)</label>
                        <input type="range" class="form-range area-weight" min="1" max="10" value="${area.weight}">
                        <div class="d-flex justify-content-between">
                            <small>Low</small>
                            <small class="weight-value">${area.weight}</small>
                            <small>High</small>
                        </div>
                    </div>
                    <div class="col-md-2 mb-2 text-end d-flex align-items-end justify-content-end">
                        <button class="btn btn-sm btn-outline-danger delete-area"><i class="bi bi-trash"></i></button>
                    </div>
                </div>
            `;
            
            elements.areasContainer.appendChild(areaElement);
        });
        
        // Navigate to step 1
        navigateToStep(1);
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);