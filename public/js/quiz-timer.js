// Quiz Timer - For quiz attempt pages
// Manages countdown timer for quiz submissions

document.addEventListener('DOMContentLoaded', () => {
    const timeDisplay = document.getElementById('time-remaining');
    const quizForm = document.getElementById('quizForm');
    
    if (!timeDisplay) return;
    
    // Get time limit from page (in minutes)
    let totalSeconds = parseInt(timeDisplay.textContent) * 60;
    
    const timerInterval = setInterval(() => {
        totalSeconds--;
        
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        
        timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Change color when time is running out
        if (totalSeconds <= 300) { // 5 minutes
            timeDisplay.parentElement.style.color = '#e74c3c';
        }
        
        // Auto-submit when time is up
        if (totalSeconds <= 0) {
            clearInterval(timerInterval);
            alert('Time is up! Your quiz will be submitted now.');
            if (quizForm) {
                quizForm.submit();
            }
        }
    }, 1000);
    
    // Show warning when leaving page with incomplete quiz
    window.addEventListener('beforeunload', (e) => {
        if (quizForm) {
            e.preventDefault();
            e.returnValue = 'Are you sure you want to leave? Your quiz progress will be lost.';
        }
    });
    
    // Handle quiz submission
    if (quizForm) {
        quizForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Collect form data
            const formData = new FormData(quizForm);
            const answers = Object.fromEntries(formData);
            
            const quizId = window.location.pathname.split('/')[2];
            
            try {
                const response = await fetch(`/quiz/${quizId}/submit`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(answers)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // Redirect to result page
                    window.location.href = `/result/${result.resultId}`;
                } else {
                    alert('Error submitting quiz: ' + result.message);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error submitting quiz');
            }
        });
    }
});
