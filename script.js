class AssessmentApp {
    constructor() {
        this.currentUser = null;
        this.personalityAnswers = [];
        this.careerAnswers = [];
        this.currentQuestionIndex = 0;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadUserData();
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Personal info form
        const personalInfoForm = document.getElementById('personalInfoForm');
        if (personalInfoForm) {
            personalInfoForm.addEventListener('submit', (e) => this.handlePersonalInfo(e));
        }

        // Test selection
        const personalityTest = document.getElementById('personalityTest');
        const careerTest = document.getElementById('careerTest');
        if (personalityTest) {
            personalityTest.addEventListener('click', () => this.startPersonalityTest());
        }
        if (careerTest) {
            careerTest.addEventListener('click', () => this.startCareerTest());
        }

        // Personality test navigation
        this.setupTestNavigation('personality');
        
        // Career test navigation
        this.setupTestNavigation('career');

        // Result page actions
        this.setupResultActions();
    }

    handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Save login data
        this.saveToGoogleSheets('login', { email, password, timestamp: new Date().toISOString() });
        
        // Store user data
        this.currentUser = { email };
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        
        // Redirect to personal info page
        window.location.href = 'personal-info.html';
    }

    handlePersonalInfo(e) {
        e.preventDefault();
        const formData = {
            fullName: document.getElementById('fullName').value,
            age: document.getElementById('age').value,
            weight: document.getElementById('weight').value,
            gender: document.getElementById('gender').value,
            email: this.currentUser?.email,
            timestamp: new Date().toISOString()
        };
        
        // Save personal info
        this.saveToGoogleSheets('personal_info', formData);
        
        // Update current user data
        this.currentUser = { ...this.currentUser, ...formData };
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        
        // Redirect to test selection
        window.location.href = 'test-selection.html';
    }

    startPersonalityTest() {
        window.location.href = 'personality-test.html';
    }

    startCareerTest() {
        window.location.href = 'career-test.html';
    }

    setupTestNavigation(testType) {
        const options = document.querySelectorAll('.option');
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');
        
        if (options.length === 0) return;

        options.forEach(option => {
            option.addEventListener('click', () => {
                options.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                
                if (nextBtn) {
                    nextBtn.disabled = false;
                }
            });
        });

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.handleNextQuestion(testType));
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.handlePreviousQuestion(testType));
        }

        // Load questions based on test type
        if (testType === 'personality') {
            this.loadPersonalityQuestion();
        } else {
            this.loadCareerQuestion();
        }
    }

    getPersonalityQuestions() {
        return [
            {
                question: "At a social gathering, you usually:",
                options: [
                    { text: "Seek out quiet conversations with 1-2 people", value: "introverted" },
                    { text: "Work the room and meet many new people", value: "extroverted" },
                    { text: "Observe before deciding who to approach", value: "observant" },
                    { text: "Help the host make everyone feel comfortable", value: "supportive" }
                ]
            },
            {
                question: "When making important decisions, you trust:",
                options: [
                    { text: "Logical analysis and objective data", value: "analytical" },
                    { text: "Your gut feelings and intuition", value: "intuitive" },
                    { text: "Advice from trusted friends/family", value: "collaborative" },
                    { text: "Past experiences and lessons learned", value: "experienced" }
                ]
            },
            {
                question: "Your ideal weekend involves:",
                options: [
                    { text: "Spontaneous adventures and trying new things", value: "spontaneous" },
                    { text: "Carefully planned activities and relaxation", value: "planned" },
                    { text: "Helping others or volunteering", value: "altruistic" },
                    { text: "Creative projects or learning new skills", value: "creative" }
                ]
            },
            {
                question: "When faced with a conflict, you:",
                options: [
                    { text: "Address it directly and immediately", value: "confrontational" },
                    { text: "Find a compromise that works for everyone", value: "diplomatic" },
                    { text: "Take time to process before responding", value: "thoughtful" },
                    { text: "Avoid it if possible", value: "conflict-avoidant" }
                ]
            },
            {
                question: "Your workspace is typically:",
                options: [
                    { text: "Minimalist and highly organized", value: "organized" },
                    { text: "Creative chaos with inspiring items", value: "creative-mess" },
                    { text: "Cozy and comfortable with personal touches", value: "comfortable" },
                    { text: "Functional with everything within reach", value: "practical" }
                ]
            },
            {
                question: "You feel most energized when:",
                options: [
                    { text: "Solving complex problems or puzzles", value: "intellectual" },
                    { text: "Creating something new or artistic", value: "artistic" },
                    { text: "Helping others achieve their goals", value: "nurturing" },
                    { text: "Leading teams or organizing events", value: "leadership" }
                ]
            },
            {
                question: "In group projects, you usually:",
                options: [
                    { text: "Take charge and direct the team", value: "leadership" },
                    { text: "Support others and mediate conflicts", value: "harmonizer" },
                    { text: "Focus on details and quality control", value: "perfectionist" },
                    { text: "Generate ideas and creative solutions", value: "innovator" }
                ]
            },
            {
                question: "Your approach to new experiences is:",
                options: [
                    { text: "Cautious but curious", value: "cautious" },
                    { text: "Eager and enthusiastic", value: "enthusiastic" },
                    { text: "Selective and research-oriented", value: "analytical" },
                    { text: "Spontaneous and impulsive", value: "spontaneous" }
                ]
            },
            {
                question: "You define success as:",
                options: [
                    { text: "Personal happiness and inner peace", value: "spiritual" },
                    { text: "Professional recognition and achievement", value: "ambitious" },
                    { text: "Positive impact on others/society", value: "humanitarian" },
                    { text: "Freedom and life experiences", value: "freedom-seeker" }
                ]
            },
            {
                question: "Your communication style is:",
                options: [
                    { text: "Direct and to the point", value: "direct" },
                    { text: "Warm and relationship-focused", value: "relational" },
                    { text: "Detailed and thorough", value: "detailed" },
                    { text: "Inspiring and visionary", value: "inspirational" }
                ]
            }
        ];
    }

    getCareerQuestions() {
        return [
            {
                question: "Which work environment energizes you most?",
                options: [
                    { text: "Fast-paced tech startup with constant innovation", value: "tech-startup" },
                    { text: "Established corporation with clear structure", value: "corporate" },
                    { text: "Creative agency with collaborative projects", value: "creative-agency" },
                    { text: "Non-profit organization with meaningful mission", value: "nonprofit" }
                ]
            },
            {
                question: "What type of problems do you find most engaging?",
                options: [
                    { text: "Technical challenges requiring coding/system design", value: "technical-problems" },
                    { text: "Human behavior and psychological insights", value: "behavioral-problems" },
                    { text: "Business strategy and market opportunities", value: "business-problems" },
                    { text: "Design and aesthetic challenges", value: "design-problems" }
                ]
            },
            {
                question: "Your ideal work schedule would be:",
                options: [
                    { text: "Flexible hours with remote work options", value: "flexible-remote" },
                    { text: "Traditional 9-5 with clear boundaries", value: "traditional" },
                    { text: "Project-based with intense periods then breaks", value: "project-based" },
                    { text: "Variable schedule including evenings/weekends", value: "variable" }
                ]
            },
            {
                question: "What skills do you want to use daily?",
                options: [
                    { text: "Data analysis, coding, and logical reasoning", value: "analytical-skills" },
                    { text: "Communication, persuasion, and relationship building", value: "communication-skills" },
                    { text: "Visual design, creativity, and innovation", value: "creative-skills" },
                    { text: "Leadership, strategy, and decision making", value: "leadership-skills" }
                ]
            },
            {
                question: "What impact do you want your work to have?",
                options: [
                    { text: "Drive technological innovation and progress", value: "tech-innovation" },
                    { text: "Help individuals improve their lives", value: "individual-impact" },
                    { text: "Shape organizational success and growth", value: "business-impact" },
                    { text: "Create beautiful and meaningful experiences", value: "creative-impact" }
                ]
            },
            {
                question: "You prefer to work:",
                options: [
                    { text: "Independently with minimal supervision", value: "independent-work" },
                    { text: "In collaborative teams with shared goals", value: "team-work" },
                    { text: "Leading and guiding others to success", value: "leadership-work" },
                    { text: "Supporting and mentoring team members", value: "support-work" }
                ]
            },
            {
                question: "What type of learning excites you?",
                options: [
                    { text: "Technical certifications and programming languages", value: "technical-learning" },
                    { text: "Psychology, sociology, and human behavior", value: "behavioral-learning" },
                    { text: "Business strategy, finance, and management", value: "business-learning" },
                    { text: "Art, design, and creative techniques", value: "creative-learning" }
                ]
            },
            {
                question: "Your risk tolerance in career decisions is:",
                options: [
                    { text: "High - willing to take calculated risks for growth", value: "high-risk" },
                    { text: "Moderate - balance stability and opportunity", value: "moderate-risk" },
                    { text: "Low - prefer security and predictability", value: "low-risk" },
                    { text: "Very high - entrepreneurially driven", value: "very-high-risk" }
                ]
            },
            {
                question: "What work rewards motivate you most?",
                options: [
                    { text: "High salary and financial bonuses", value: "financial-rewards" },
                    { text: "Recognition, titles, and professional status", value: "status-rewards" },
                    { text: "Work-life balance and personal time", value: "balance-rewards" },
                    { text: "Meaningful work and personal fulfillment", value: "fulfillment-rewards" }
                ]
            },
            {
                question: "You excel at:",
                options: [
                    { text: "Breaking down complex problems systematically", value: "problem-decomposition" },
                    { text: "Building consensus and managing relationships", value: "relationship-building" },
                    { text: "Thinking outside the box and innovating", value: "innovative-thinking" },
                    { text: "Organizing details and ensuring quality", value: "detail-orientation" }
                ]
            },
            {
                question: "Your ideal company culture is:",
                options: [
                    { text: "Meritocratic and performance-driven", value: "meritocratic" },
                    { text: "Collaborative and team-oriented", value: "collaborative" },
                    { text: "Innovative and experimental", value: "innovative-culture" },
                    { text: "Stable and employee-focused", value: "stable-culture" }
                ]
            },
            {
                question: "Career growth for you means:",
                options: [
                    { text: "Climbing the corporate ladder", value: "hierarchical-growth" },
                    { text: "Expanding skills and capabilities", value: "skill-growth" },
                    { text: "Increasing influence and impact", value: "impact-growth" },
                    { text: "Achieving work-life integration", value: "integration-growth" }
                ]
            }
        ];
    }

    loadPersonalityQuestion() {
        const questions = this.getPersonalityQuestions();
        if (this.currentQuestionIndex < questions.length) {
            this.displayQuestion(questions[this.currentQuestionIndex], 'personality');
        }
    }

    loadCareerQuestion() {
        const questions = this.getCareerQuestions();
        if (this.currentQuestionIndex < questions.length) {
            this.displayQuestion(questions[this.currentQuestionIndex], 'career');
        }
    }

    displayQuestion(questionData, testType) {
        const questionText = document.getElementById('questionText');
        const questionNumber = document.getElementById('questionNumber');
        const optionsContainer = document.getElementById('optionsContainer');
        const progressFill = document.getElementById('progressFill');
        
        if (!questionText || !optionsContainer) return;

        questionText.textContent = questionData.question;
        
        const totalQuestions = testType === 'personality' ? 10 : 12;
        questionNumber.textContent = `Question ${this.currentQuestionIndex + 1} of ${totalQuestions}`;
        
        // Update progress bar
        const progress = ((this.currentQuestionIndex + 1) / totalQuestions) * 100;
        progressFill.style.width = `${progress}%`;
        
        // Clear and populate options
        optionsContainer.innerHTML = '';
        questionData.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.dataset.value = option.value;
            optionElement.innerHTML = `
                <span class="option-letter">${String.fromCharCode(65 + index)}</span>
                <span class="option-text">${option.text}</span>
            `;
            optionsContainer.appendChild(optionElement);
        });
        
        // Re-attach event listeners
        this.attachOptionListeners();
        
        // Update navigation buttons
        this.updateNavigationButtons(testType);
    }

    attachOptionListeners() {
        const options = document.querySelectorAll('.option');
        const nextBtn = document.getElementById('nextBtn');
        
        options.forEach(option => {
            option.addEventListener('click', () => {
                options.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                if (nextBtn) {
                    nextBtn.disabled = false;
                }
            });
        });
    }

    updateNavigationButtons(testType) {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) {
            prevBtn.disabled = this.currentQuestionIndex === 0;
        }
        
        if (nextBtn) {
            const totalQuestions = testType === 'personality' ? 10 : 12;
            const isLastQuestion = this.currentQuestionIndex === totalQuestions - 1;
            nextBtn.textContent = isLastQuestion ? 'See Results' : 'Next';
        }
    }

    handleNextQuestion(testType) {
        const selectedOption = document.querySelector('.option.selected');
        if (!selectedOption) return;
        
        const answer = {
            questionIndex: this.currentQuestionIndex,
            value: selectedOption.dataset.value,
            text: selectedOption.querySelector('.option-text').textContent
        };
        
        if (testType === 'personality') {
            this.personalityAnswers[this.currentQuestionIndex] = answer;
        } else {
            this.careerAnswers[this.currentQuestionIndex] = answer;
        }
        
        const totalQuestions = testType === 'personality' ? 10 : 12;
        
        if (this.currentQuestionIndex < totalQuestions - 1) {
            this.currentQuestionIndex++;
            if (testType === 'personality') {
                this.loadPersonalityQuestion();
            } else {
                this.loadCareerQuestion();
            }
        } else {
            // Save answers and redirect to results
            this.saveTestResults(testType);
            if (testType === 'personality') {
                window.location.href = 'personality-result.html';
            } else {
                window.location.href = 'career-result.html';
            }
        }
    }

    handlePreviousQuestion(testType) {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            if (testType === 'personality') {
                this.loadPersonalityQuestion();
            } else {
                this.loadCareerQuestion();
            }
        }
    }

    saveTestResults(testType) {
        const results = {
            email: this.currentUser?.email,
            testType: testType,
            answers: testType === 'personality' ? this.personalityAnswers : this.careerAnswers,
            timestamp: new Date().toISOString()
        };
        
        this.saveToGoogleSheets('test_results', results);
    }

    calculatePersonalityResult() {
        // Personality trait mapping based on answer patterns
        const traits = {
            // Core personality dimensions
            'Introverted': 0,
            'Extroverted': 0,
            'Analytical': 0,
            'Creative': 0,
            'Empathetic': 0,
            'Adventurous': 0,
            'Organized': 0,
            'Spontaneous': 0,
            'Leadership': 0,
            'Supportive': 0,
            'Diplomatic': 0,
            'Direct': 0
        };
        
        this.personalityAnswers.forEach(answer => {
            const value = answer.value;
            
            // Map answers to personality traits
            switch(value) {
                case 'introverted':
                case 'observant':
                case 'thoughtful':
                    traits.Introverted += 2;
                    break;
                case 'extroverted':
                case 'enthusiastic':
                case 'spontaneous':
                    traits.Extroverted += 2;
                    break;
                case 'analytical':
                case 'intellectual':
                case 'organized':
                case 'detailed':
                    traits.Analytical += 2;
                    break;
                case 'creative':
                case 'artistic':
                case 'innovator':
                case 'creative-mess':
                    traits.Creative += 2;
                    break;
                case 'supportive':
                case 'nurturing':
                case 'altruistic':
                case 'harmonizer':
                    traits.Empathetic += 2;
                    break;
                case 'spontaneous':
                case 'adventurous':
                case 'freedom-seeker':
                    traits.Adventurous += 2;
                    break;
                case 'organized':
                case 'planned':
                case 'perfectionist':
                    traits.Organized += 2;
                    break;
                case 'leadership':
                case 'ambitious':
                case 'inspirational':
                    traits.Leadership += 2;
                    break;
                case 'diplomatic':
                case 'relational':
                    traits.Diplomatic += 2;
                    break;
                case 'direct':
                case 'confrontational':
                    traits.Direct += 2;
                    break;
                case 'humanitarian':
                case 'spiritual':
                    traits.Supportive += 1;
                    break;
                case 'cautious':
                    traits.Introverted += 1;
                    traits.Organized += 1;
                    break;
                case 'experienced':
                    traits.Analytical += 1;
                    break;
                case 'intuitive':
                    traits.Creative += 1;
                    break;
                case 'collaborative':
                    traits.Supportive += 1;
                    break;
                case 'comfortable':
                    traits.Empathetic += 1;
                    break;
                case 'practical':
                    traits.Organized += 1;
                    break;
                case 'conflict-avoidant':
                    traits.Diplomatic += 1;
                    break;
            }
        });
        
        // Get top 4 traits
        const sortedTraits = Object.entries(traits)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 4)
            .map(([trait]) => trait);
        
        return sortedTraits;
    }

    calculateCareerResults() {
        // Enhanced career matching algorithm
        const careerProfiles = {
            'Software Engineer': {
                score: 0,
                requiredTraits: ['technical-problems', 'analytical-skills', 'independent-work', 'tech-startup'],
                bonusTraits: ['problem-decomposition', 'high-risk', 'meritocratic']
            },
            'Data Scientist': {
                score: 0,
                requiredTraits: ['technical-problems', 'analytical-skills', 'behavioral-problems'],
                bonusTraits: ['problem-decomposition', 'technical-learning', 'corporate']
            },
            'UX Designer': {
                score: 0,
                requiredTraits: ['design-problems', 'creative-skills', 'behavioral-problems'],
                bonusTraits: ['innovative-thinking', 'creative-agency', 'team-work']
            },
            'Product Manager': {
                score: 0,
                requiredTraits: ['business-problems', 'leadership-skills', 'team-work'],
                bonusTraits: ['leadership-work', 'business-learning', 'high-risk']
            },
            'Marketing Manager': {
                score: 0,
                requiredTraits: ['communication-skills', 'business-problems', 'creative-impact'],
                bonusTraits: ['relationship-building', 'creative-agency', 'collaborative']
            },
            'Financial Analyst': {
                score: 0,
                requiredTraits: ['business-problems', 'analytical-skills', 'corporate'],
                bonusTraits: ['detail-orientation', 'business-learning', 'low-risk']
            },
            'HR Manager': {
                score: 0,
                requiredTraits: ['behavioral-problems', 'communication-skills', 'support-work'],
                bonusTraits: ['relationship-building', 'collaborative', 'stable-culture']
            },
            'Graphic Designer': {
                score: 0,
                requiredTraits: ['design-problems', 'creative-skills', 'creative-impact'],
                bonusTraits: ['innovative-thinking', 'creative-learning', 'creative-agency']
            },
            'Business Consultant': {
                score: 0,
                requiredTraits: ['business-problems', 'leadership-skills', 'communication-skills'],
                bonusTraits: ['relationship-building', 'business-learning', 'project-based']
            },
            'Project Manager': {
                score: 0,
                requiredTraits: ['leadership-work', 'team-work', 'detail-orientation'],
                bonusTraits: ['organized', 'project-based', 'collaborative']
            },
            'Entrepreneur': {
                score: 0,
                requiredTraits: ['very-high-risk', 'leadership-skills', 'business-impact'],
                bonusTraits: ['innovative-thinking', 'tech-startup', 'impact-growth']
            },
            'Teacher/Educator': {
                score: 0,
                requiredTraits: ['individual-impact', 'support-work', 'communication-skills'],
                bonusTraits: ['behavioral-learning', 'fulfillment-rewards', 'stable-culture']
            }
        };
        
        // Score each career based on answers
        this.careerAnswers.forEach(answer => {
            const value = answer.value;
            
            Object.entries(careerProfiles).forEach(([career, profile]) => {
                // Primary trait matching
                if (profile.requiredTraits.includes(value)) {
                    profile.score += 3;
                }
                // Bonus trait matching
                if (profile.bonusTraits.includes(value)) {
                    profile.score += 1;
                }
                
                // Additional scoring based on answer patterns
                switch(value) {
                    case 'tech-startup':
                        if (career.includes('Software') || career.includes('Entrepreneur')) profile.score += 2;
                        break;
                    case 'corporate':
                        if (career.includes('Financial') || career.includes('HR') || career.includes('Data')) profile.score += 2;
                        break;
                    case 'creative-agency':
                        if (career.includes('Designer') || career.includes('Marketing')) profile.score += 2;
                        break;
                    case 'nonprofit':
                        if (career.includes('Teacher') || career.includes('HR')) profile.score += 2;
                        break;
                    case 'technical-problems':
                        if (career.includes('Software') || career.includes('Data')) profile.score += 2;
                        break;
                    case 'behavioral-problems':
                        if (career.includes('UX') || career.includes('HR') || career.includes('Teacher')) profile.score += 2;
                        break;
                    case 'business-problems':
                        if (career.includes('Product') || career.includes('Financial') || career.includes('Business') || career.includes('Marketing')) profile.score += 2;
                        break;
                    case 'design-problems':
                        if (career.includes('Designer') || career.includes('UX')) profile.score += 2;
                        break;
                    case 'analytical-skills':
                        if (career.includes('Data') || career.includes('Financial') || career.includes('Software')) profile.score += 2;
                        break;
                    case 'communication-skills':
                        if (career.includes('Marketing') || career.includes('HR') || career.includes('Business') || career.includes('Teacher')) profile.score += 2;
                        break;
                    case 'creative-skills':
                        if (career.includes('Designer') || career.includes('Marketing')) profile.score += 2;
                        break;
                    case 'leadership-skills':
                        if (career.includes('Product') || career.includes('Business') || career.includes('Project') || career.includes('Entrepreneur')) profile.score += 2;
                        break;
                }
            });
        });
        
        // Sort careers by score and convert to realistic percentages
        const sortedCareers = Object.entries(careerProfiles)
            .sort((a, b) => b[1].score - a[1].score)
            .filter(([, profile]) => profile.score > 0)
            .map(([career, data]) => {
                // Convert scores to realistic percentages (60-95% range)
                const maxScore = Math.max(...Object.values(careerProfiles).map(p => p.score));
                const percentage = maxScore > 0 ? Math.round(60 + (data.score / maxScore) * 35) : 60;
                return {
                    title: career,
                    percentage: Math.min(95, Math.max(60, percentage))
                };
            });
        
        return {
            topCareers: sortedCareers.slice(0, 3),
            alternativeCareers: sortedCareers.slice(3, 6)
        };
    }

    setupResultActions() {
        // Personality result actions
        const retakePersonalityTest = document.getElementById('retakeTest');
        const tryCareerTest = document.getElementById('tryCareerTest');
        const shareResult = document.getElementById('shareResult');
        const goHomeFromPersonality = document.getElementById('goHome');
        
        if (retakePersonalityTest) {
            retakePersonalityTest.addEventListener('click', () => {
                this.personalityAnswers = [];
                this.currentQuestionIndex = 0;
                window.location.href = 'personality-test.html';
            });
        }
        
        if (tryCareerTest) {
            tryCareerTest.addEventListener('click', () => {
                window.location.href = 'career-test.html';
            });
        }
        
        if (shareResult) {
            shareResult.addEventListener('click', () => this.shareResults());
        }
        
        if (goHomeFromPersonality) {
            goHomeFromPersonality.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }
        
        // Career result actions
        const retakeCareerTest = document.getElementById('retakeTest');
        const tryPersonalityTest = document.getElementById('tryPersonalityTest');
        const downloadReport = document.getElementById('downloadReport');
        const goHomeFromCareer = document.getElementById('goHome');
        
        if (retakeCareerTest) {
            retakeCareerTest.addEventListener('click', () => {
                this.careerAnswers = [];
                this.currentQuestionIndex = 0;
                window.location.href = 'career-test.html';
            });
        }
        
        if (tryPersonalityTest) {
            tryPersonalityTest.addEventListener('click', () => {
                window.location.href = 'personality-test.html';
            });
        }
        
        if (downloadReport) {
            downloadReport.addEventListener('click', () => this.downloadReport());
        }
        
        if (goHomeFromCareer) {
            goHomeFromCareer.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }
        
        // Load results on result pages
        this.loadResults();
    }

    loadResults() {
        // Load personality results
        if (window.location.pathname.includes('personality-result.html')) {
            const personalityWords = document.getElementById('personalityWords');
            if (personalityWords && this.personalityAnswers.length > 0) {
                const traits = this.calculatePersonalityResult();
                const wordElements = personalityWords.querySelectorAll('.word');
                traits.forEach((trait, index) => {
                    if (wordElements[index]) {
                        wordElements[index].textContent = trait;
                    }
                });
            }
        }
        
        // Load career results
        if (window.location.pathname.includes('career-result.html')) {
            if (this.careerAnswers.length > 0) {
                const results = this.calculateCareerResults();
                this.displayCareerResults(results);
            }
        }
    }

    displayCareerResults(results) {
        // Display top careers
        const topCareersContainer = document.getElementById('topCareers');
        if (topCareersContainer) {
            topCareersContainer.innerHTML = results.topCareers.map(career => `
                <div class="career-item">
                    <span class="career-title">${career.title}</span>
                    <span class="match-percentage">${career.percentage}%</span>
                </div>
            `).join('');
        }
        
        // Display alternative careers
        const alternativeCareersContainer = document.getElementById('alternativeCareers');
        if (alternativeCareersContainer) {
            alternativeCareersContainer.innerHTML = results.alternativeCareers.map(career => `
                <div class="career-item">
                    <span class="career-title">${career.title}</span>
                    <span class="match-percentage">${career.percentage}%</span>
                </div>
            `).join('');
        }
    }

    shareResults() {
        const shareText = "I just completed a personality assessment! Discover your personality traits too!";
        if (navigator.share) {
            navigator.share({
                title: 'Personality Assessment Results',
                text: shareText,
                url: window.location.href
            });
        } else {
            // Fallback - copy to clipboard
            navigator.clipboard.writeText(shareText + ' ' + window.location.href);
            alert('Results link copied to clipboard!');
        }
    }

    downloadReport() {
        // Generate a simple text report
        const report = `
Career Assessment Report
========================
Name: ${this.currentUser?.fullName || 'N/A'}
Email: ${this.currentUser?.email || 'N/A'}
Date: ${new Date().toLocaleDateString()}

Top Career Matches:
${this.calculateCareerResults().topCareers.map(c => `- ${c.title}: ${c.percentage}%`).join('\n')}

Alternative Options:
${this.calculateCareerResults().alternativeCareers.map(c => `- ${c.title}: ${c.percentage}%`).join('\n')}
        `;
        
        const blob = new Blob([report], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'career-assessment-report.txt';
        a.click();
        window.URL.revokeObjectURL(url);
    }

    saveToGoogleSheets(sheet, data) {
        // In a real implementation, this would connect to Google Sheets API
        // For now, we'll save to localStorage as a fallback
        const existingData = JSON.parse(localStorage.getItem(sheet) || '[]');
        existingData.push(data);
        localStorage.setItem(sheet, JSON.stringify(existingData));
        
        console.log(`Saving to ${sheet}:`, data);
        
        // TODO: Implement actual Google Sheets integration
        // This would require:
        // 1. Google Sheets API setup
        // 2. OAuth authentication
        // 3. API key configuration
    }

    loadUserData() {
        const userData = localStorage.getItem('currentUser');
        if (userData) {
            this.currentUser = JSON.parse(userData);
        }
        
        // Load test answers if returning to test pages
        const personalityData = localStorage.getItem('personalityAnswers');
        if (personalityData) {
            this.personalityAnswers = JSON.parse(personalityData);
        }
        
        const careerData = localStorage.getItem('careerAnswers');
        if (careerData) {
            this.careerAnswers = JSON.parse(careerData);
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AssessmentApp();
});

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Add loading animation for page transitions
window.addEventListener('beforeunload', () => {
    document.body.style.opacity = '0';
});

window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});
