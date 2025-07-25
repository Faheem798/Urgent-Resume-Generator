// Global variables
        let currentTemplate = 'modern';
        let enhancementTarget = null;
        let enhancementElement = null;
        let profilePhotoDataURL = null;

        // Initialize the app
        document.addEventListener('DOMContentLoaded', function() {
            // Add event listeners for real-time updates
            const inputs = document.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('input', updatePreview);
            });

            // Profile photo upload handler
            document.getElementById('profilePhoto').addEventListener('change', handlePhotoUpload);

            // Initial preview update
            updatePreview();
        });

        // Update resume preview
        function updatePreview() {
            const preview = document.getElementById('resume-preview');
            const fullName = document.getElementById('fullName').value || 'Your Name';
            const title = document.getElementById('title').value || 'Your Professional Title';
            const email = document.getElementById('email').value || 'email@example.com';
            const phone = document.getElementById('phone').value || 'Phone Number';
            const location = document.getElementById('location').value || 'Location';
            const linkedin = document.getElementById('linkedin').value || '';
            const summary = document.getElementById('summary').value || 'Professional summary will appear here...';
            const skills = document.getElementById('skills').value || '';

            // Contact info
            let contactInfo = `
                <span><i class="fas fa-envelope"></i> ${email}</span>
                <span><i class="fas fa-phone"></i> ${phone}</span>
                <span><i class="fas fa-map-marker-alt"></i> ${location}</span>
            `;
            if (linkedin) {
                contactInfo += `<span><i class="fab fa-linkedin"></i> LinkedIn</span>`;
            }

            // Experience
            const experienceItems = document.querySelectorAll('#experience-container .dynamic-section');
            let experienceHTML = '';
            experienceItems.forEach(item => {
                const jobTitle = item.querySelector('.job-title').value;
                const company = item.querySelector('.company').value;
                const duration = item.querySelector('.duration').value;
                const description = item.querySelector('.job-description').value;

                if (jobTitle || company) {
                    experienceHTML += `
                        <div class="experience-item">
                            <h3>${jobTitle} - ${company}</h3>
                            <p style="color: #666; font-style: italic; margin-bottom: 8px;">${duration}</p>
                            <p>${description}</p>
                        </div>
                    `;
                }
            });

            // Education
            const educationItems = document.querySelectorAll('#education-container .dynamic-section');
            let educationHTML = '';
            educationItems.forEach(item => {
                const degree = item.querySelector('.degree').value;
                const institution = item.querySelector('.institution').value;
                const year = item.querySelector('.year').value;

                if (degree || institution) {
                    educationHTML += `
                        <div class="education-item">
                            <h3>${degree}</h3>
                            <p style="color: #666;">${institution} - ${year}</p>
                        </div>
                    `;
                }
            });

            // Skills
            let skillsHTML = '';
            if (skills) {
                const skillsArray = skills.split(',').map(skill => skill.trim()).filter(skill => skill);
                skillsHTML = `
                    <div class="skills-list">
                        ${skillsArray.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                `;
            }

            // Photo handling
            let photoHTML = '';
            if (profilePhotoDataURL) {
                photoHTML = `<img src="${profilePhotoDataURL}" alt="Profile Photo" class="profile-photo">`;
            }

            // Generate full resume HTML
            preview.innerHTML = `
                <div class="header">
                    ${photoHTML}
                    <h1>${fullName}</h1>
                    <p style="font-size: 18px; margin-bottom: 15px;">${title}</p>
                    <div class="contact-info">${contactInfo}</div>
                </div>

                ${summary ? `
                <div class="section">
                    <h2>Professional Summary</h2>
                    <p>${summary}</p>
                </div>
                ` : ''}

                ${experienceHTML ? `
                <div class="section">
                    <h2>Work Experience</h2>
                    ${experienceHTML}
                </div>
                ` : ''}

                ${educationHTML ? `
                <div class="section">
                    <h2>Education</h2>
                    ${educationHTML}
                </div>
                ` : ''}

                ${skillsHTML ? `
                <div class="section">
                    <h2>Skills</h2>
                    ${skillsHTML}
                </div>
                ` : ''}
            `;
        }

        // Template management
        function changeTemplate(template) {
            currentTemplate = template;
            const preview = document.getElementById('resume-preview');
            preview.className = 'template-' + template;

            // Update active button
            document.querySelectorAll('.template-btn').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');

            updatePreview();
        }

        // Photo upload functions
        function handlePhotoUpload(event) {
            const file = event.target.files[0];
            if (file) {
                // Validate file type
                if (!file.type.startsWith('image/')) {
                    alert('Please select a valid image file.');
                    return;
                }

                // Validate file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    alert('Please select an image smaller than 5MB.');
                    return;
                }

                const reader = new FileReader();
                reader.onload = function(e) {
                    profilePhotoDataURL = e.target.result;
                    
                    // Update preview in sidebar
                    const photoPreview = document.getElementById('photoPreview');
                    photoPreview.innerHTML = `<img src="${profilePhotoDataURL}" alt="Profile Preview">`;
                    photoPreview.classList.add('has-image');
                    
                    // Show remove button
                    document.getElementById('removePhotoBtn').style.display = 'inline-block';
                    
                    // Update resume preview
                    updatePreview();
                };
                reader.readAsDataURL(file);
            }
        }

        function removePhoto() {
            profilePhotoDataURL = null;
            
            // Reset preview in sidebar
            const photoPreview = document.getElementById('photoPreview');
            photoPreview.innerHTML = `
                <i class="fas fa-user-circle"></i>
                <span>Click to upload photo</span>
            `;
            photoPreview.classList.remove('has-image');
            
            // Hide remove button
            document.getElementById('removePhotoBtn').style.display = 'none';
            
            // Clear file input
            document.getElementById('profilePhoto').value = '';
            
            // Update resume preview
            updatePreview();
        }
        function addExperience() {
            const container = document.getElementById('experience-container');
            const newSection = document.createElement('div');
            newSection.className = 'dynamic-section';
            newSection.innerHTML = `
                <button class="remove-btn" onclick="this.parentElement.remove(); updatePreview();">&times;</button>
                <div class="form-group">
                    <label>Job Title</label>
                    <input type="text" class="job-title" placeholder="Software Engineer">
                </div>
                <div class="form-group">
                    <label>Company</label>
                    <input type="text" class="company" placeholder="Tech Corp">
                </div>
                <div class="form-group">
                    <label>Duration</label>
                    <input type="text" class="duration" placeholder="Jan 2020 - Present">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea class="job-description" placeholder="Describe your responsibilities and achievements..."></textarea>
                    <button class="btn enhance-btn btn-small" onclick="enhanceJobDescription(this)">
                        <i class="fas fa-magic"></i> Enhance
                    </button>
                </div>
            `;
            container.appendChild(newSection);

            // Add event listeners
            newSection.querySelectorAll('input, textarea').forEach(input => {
                input.addEventListener('input', updatePreview);
            });
        }

        function addEducation() {
            const container = document.getElementById('education-container');
            const newSection = document.createElement('div');
            newSection.className = 'dynamic-section';
            newSection.innerHTML = `
                <button class="remove-btn" onclick="this.parentElement.remove(); updatePreview();">&times;</button>
                <div class="form-group">
                    <label>Degree</label>
                    <input type="text" class="degree" placeholder="Bachelor of Science in Computer Science">
                </div>
                <div class="form-group">
                    <label>Institution</label>
                    <input type="text" class="institution" placeholder="University of Technology">
                </div>
                <div class="form-group">
                    <label>Year</label>
                    <input type="text" class="year" placeholder="2018">
                </div>
            `;
            container.appendChild(newSection);

            // Add event listeners
            newSection.querySelectorAll('input').forEach(input => {
                input.addEventListener('input', updatePreview);
            });
        }

        // AI Enhancement functions (Free built-in AI)
        async function enhanceContent(fieldId) {
            const field = document.getElementById(fieldId);
            enhancementTarget = fieldId;
            enhancementElement = field;

            const currentValue = field.value;
            let enhancedContent = '';

            // Built-in AI enhancement logic
            switch(fieldId) {
                case 'title':
                    const name = document.getElementById('fullName').value || 'Professional';
                    enhancedContent = generateProfessionalTitle(currentValue, name);
                    break;
                case 'summary':
                    const jobTitle = document.getElementById('title').value || 'Professional';
                    enhancedContent = generateProfessionalSummary(currentValue, jobTitle);
                    break;
                case 'skills':
                    const role = document.getElementById('title').value || 'Professional';
                    enhancedContent = generateSkillSuggestions(currentValue, role);
                    break;
            }

            showEnhancementModal(enhancedContent);
        }

        async function enhanceJobDescription(button) {
            const section = button.closest('.dynamic-section');
            const jobTitle = section.querySelector('.job-title').value;
            const company = section.querySelector('.company').value;
            const description = section.querySelector('.job-description');
            
            enhancementElement = description;
            
            const currentDescription = description.value;
            const enhancedContent = generateJobDescription(currentDescription, jobTitle, company);
            
            showEnhancementModal(enhancedContent);
        }

        // Built-in AI Enhancement Functions
        function generateProfessionalTitle(current, name) {
            const titleSuggestions = [
                'Senior Software Engineer & Full-Stack Developer',
                'Experienced Software Developer & Technical Lead',
                'Full-Stack Engineer & Solutions Architect',
                'Senior Web Developer & Team Lead',
                'Software Engineering Professional',
                'Technical Lead & Senior Developer',
                'Full-Stack Software Engineer',
                'Senior Application Developer'
            ];
            
            if (current.toLowerCase().includes('software') || current.toLowerCase().includes('developer')) {
                return titleSuggestions[Math.floor(Math.random() * titleSuggestions.length)];
            }
            
            return current ? `${current} | Industry Professional` : 'Experienced Professional';
        }

        function generateProfessionalSummary(current, jobTitle) {
            const templates = [
                `Highly motivated ${jobTitle.toLowerCase()} with proven expertise in delivering innovative solutions and driving business growth. Demonstrates strong problem-solving abilities and excellent communication skills in collaborative environments.`,
                `Results-driven ${jobTitle.toLowerCase()} with extensive experience in developing scalable solutions and leading cross-functional teams. Committed to continuous learning and staying current with industry best practices.`,
                `Dynamic ${jobTitle.toLowerCase()} with a track record of successful project delivery and team leadership. Passionate about leveraging technology to solve complex business challenges and drive operational efficiency.`
            ];
            
            return templates[Math.floor(Math.random() * templates.length)];
        }

        function generateSkillSuggestions(current, role) {
            const skillSets = {
                'software': 'JavaScript, Python, React, Node.js, SQL, Git, AWS, Docker, TypeScript, REST APIs, GraphQL, MongoDB, PostgreSQL, Agile Development',
                'engineer': 'JavaScript, Python, Java, React, Angular, Node.js, Express, PostgreSQL, MongoDB, AWS, Docker, Kubernetes, Git, CI/CD, Microservices',
                'developer': 'HTML5, CSS3, JavaScript, React, Vue.js, Node.js, Python, PHP, MySQL, PostgreSQL, Git, Webpack, Sass, REST APIs, GraphQL',
                'manager': 'Project Management, Team Leadership, Agile Methodologies, Strategic Planning, Budget Management, Stakeholder Communication, Performance Analysis, Risk Management',
                'designer': 'Adobe Creative Suite, Figma, Sketch, UI/UX Design, Wireframing, Prototyping, HTML/CSS, JavaScript, Responsive Design, User Research',
                'default': 'Communication, Problem Solving, Team Collaboration, Project Management, Analytical Thinking, Leadership, Time Management, Adaptability'
            };
            
            const roleKey = Object.keys(skillSets).find(key => 
                role.toLowerCase().includes(key)
            ) || 'default';
            
            return current ? `${current}, ${skillSets[roleKey]}` : skillSets[roleKey];
        }

        function generateJobDescription(current, jobTitle, company) {
            const templates = [
                `• Developed and maintained high-quality software solutions, contributing to a 25% increase in system efficiency
• Collaborated with cross-functional teams to deliver projects on time and within budget
• Implemented best practices for code quality, testing, and documentation
• Mentored junior team members and contributed to knowledge sharing initiatives
• Participated in agile development processes and continuous improvement efforts`,
                
                `• Led the design and implementation of scalable applications serving thousands of users daily
• Optimized system performance, resulting in improved user experience and reduced operational costs
• Worked closely with stakeholders to gather requirements and translate them into technical solutions
• Established coding standards and conducted code reviews to ensure high-quality deliverables
• Contributed to architectural decisions and technology stack evaluations`
            ];
            
            return current || templates[Math.floor(Math.random() * templates.length)];
        }

        function showEnhancementModal(enhancedContent) {
            const modal = document.getElementById('aiModal');
            const loading = document.getElementById('loading');
            const result = document.getElementById('enhancement-result');
            
            modal.style.display = 'block';
            loading.style.display = 'none';
            result.style.display = 'block';
            document.getElementById('enhanced-content').innerHTML = enhancedContent.replace(/\n/g, '<br>');
        }

        function acceptEnhancement() {
            const enhancedContent = document.getElementById('enhanced-content').textContent;
            if (enhancementElement) {
                enhancementElement.value = enhancedContent;
                updatePreview();
            }
            closeModal();
        }

        function closeModal() {
            document.getElementById('aiModal').style.display = 'none';
            enhancementTarget = null;
            enhancementElement = null;
        }

        // Export functions
        async function downloadPDF() {
            const { jsPDF } = window.jspdf;
            const element = document.getElementById('resume-preview');
            
            try {
                const canvas = await html2canvas(element, {
                    scale: 2,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: '#ffffff'
                });

                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const imgWidth = 210;
                const pageHeight = 295;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                let heightLeft = imgHeight;
                let position = 0;

                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }

                const fileName = (document.getElementById('fullName').value || 'Resume').replace(/\s+/g, '_') + '_Resume.pdf';
                pdf.save(fileName);
            } catch (error) {
                alert('Error generating PDF: ' + error.message);
            }
        }

        async function downloadPNG() {
            const element = document.getElementById('resume-preview');
            
            try {
                const canvas = await html2canvas(element, {
                    scale: 2,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: '#ffffff'
                });

                const link = document.createElement('a');
                link.download = (document.getElementById('fullName').value || 'Resume').replace(/\s+/g, '_') + '_Resume.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            } catch (error) {
                alert('Error generating PNG: ' + error.message);
            }
        }

        // Close modal when clicking outside
        window.onclick = function(event) {
            const modal = document.getElementById('aiModal');
            if (event.target === modal) {
                closeModal();
            }
        }

        // Sample data for demo (optional)
        function loadSampleData() {
            document.getElementById('fullName').value = 'Alex Johnson';
            document.getElementById('title').value = 'Senior Software Engineer';
            document.getElementById('email').value = 'alex.johnson@email.com';
            document.getElementById('phone').value = '+1 (555) 123-4567';
            document.getElementById('location').value = 'San Francisco, CA';
            document.getElementById('linkedin').value = 'https://linkedin.com/in/alexjohnson';
            document.getElementById('summary').value = 'Experienced software engineer with 8+ years developing scalable web applications. Proven track record of leading cross-functional teams and delivering high-quality software solutions that drive business growth.';
            document.getElementById('skills').value = 'JavaScript, Python, React, Node.js, AWS, Docker, PostgreSQL, GraphQL, TypeScript, Git';
            
            // Add sample experience
            const jobTitle = document.querySelector('.job-title');
            const company = document.querySelector('.company');
            const duration = document.querySelector('.duration');
            const jobDescription = document.querySelector('.job-description');
            
            jobTitle.value = 'Senior Software Engineer';
            company.value = 'TechCorp Inc.';
            duration.value = 'Jan 2020 - Present';
            jobDescription.value = 'Led development of microservices architecture serving 2M+ users. Reduced system latency by 40% through optimization. Mentored 5 junior developers and established coding standards.';
            
            // Add sample education
            const degree = document.querySelector('.degree');
            const institution = document.querySelector('.institution');
            const year = document.querySelector('.year');
            
            degree.value = 'Bachelor of Science in Computer Science';
            institution.value = 'Stanford University';
            year.value = '2016';
            
            updatePreview();
        }

        // Photo upload event handler
        function handlePhotoUpload(event) {
            const file = event.target.files[0];
            if (file) {
                // Validate file type
                if (!file.type.startsWith('image/')) {
                    alert('Please select a valid image file.');
                    return;
                }

                // Validate file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    alert('Please select an image smaller than 5MB.');
                    return;
                }

                const reader = new FileReader();
                reader.onload = function(e) {
                    profilePhotoDataURL = e.target.result;
                    
                    // Update preview in sidebar
                    const photoPreview = document.getElementById('photoPreview');
                    photoPreview.innerHTML = `<img src="${profilePhotoDataURL}" alt="Profile Preview">`;
                    photoPreview.classList.add('has-image');
                    
                    // Show remove button
                    document.getElementById('removePhotoBtn').style.display = 'inline-block';
                    
                    // Update resume preview
                    updatePreview();
                };
                reader.readAsDataURL(file);
            }
        }

        function removePhoto() {
            profilePhotoDataURL = null;
            
            // Reset preview in sidebar
            const photoPreview = document.getElementById('photoPreview');
            photoPreview.innerHTML = `
                <i class="fas fa-user-circle"></i>
                <span>Click to upload photo</span>
            `;
            photoPreview.classList.remove('has-image');
            
            // Hide remove button
            document.getElementById('removePhotoBtn').style.display = 'none';
            
            // Clear file input
            document.getElementById('profilePhoto').value = '';
            
            // Update resume preview
            updatePreview();
        }

        // Click handler for photo preview
        document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('photoPreview').addEventListener('click', function() {
                document.getElementById('profilePhoto').click();
            });
        });

        // Uncomment the line below to load sample data on page load
        // setTimeout(loadSampleData, 1000);1000);