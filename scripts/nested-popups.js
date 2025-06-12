/**
 * Nested Popups - Dynamic course popup generator
 * This script allows easy customization of multi-level course popups
 */

// Course structure data - Edit this object to customize your popups
const courseData = {
    // Introduction to Programming course
    "intro_programming": {
        title: "Programming Languages",
        translateKey: "sub_title_programming",
        items: [
            {
                icon: "fab fa-python",
                name: "Python",
                translateKey: "python",
                hasChildren: false,
                children: {
                    title: "Python Libraries",
                    translateKey: "python_libraries",
                    items: [
                        {
                            icon: "fas fa-chart-line",
                            name: "NumPy & Pandas",
                            translateKey: "numpy_pandas"
                        },
                        {
                            icon: "fas fa-brain",
                            name: "TensorFlow",
                            translateKey: "tensorflow"
                        },
                        {
                            icon: "fas fa-flask",
                            name: "Django",
                            translateKey: "django"
                        }
                    ]
                }
            },
            {
                icon: "fab fa-js",
                name: "JavaScript",
                translateKey: "javascript",
                hasChildren: false,
            }
        ]
    },
    
    // Test Automation course
    "test_automation": {
        title: "Test Automation Tools",
        translateKey: "test_automation_title",
        items: [
            {
                icon: "fas fa-vial",
                name: "Selenium",
                translateKey: "selenium",
                hasChildren: false,
                children: {
                    title: "Selenium Features",
                    translateKey: "selenium_features",
                    items: [
                        {
                            icon: "fas fa-language",
                            name: "Multi-Language Support",
                            translateKey: "multi_language"
                        },
                        {
                            icon: "fas fa-browser",
                            name: "Cross-Browser Testing",
                            translateKey: "cross_browser"
                        },
                        {
                            icon: "fas fa-grid",
                            name: "Selenium Grid",
                            translateKey: "grid"
                        }
                    ]
                }
            },
            {
                icon: "fas fa-vial",
                name: "Playwright",
                translateKey: "playwright"
            }
        ]
    },
    
    // Software Engineering course
    "software_engineering": {
        title: "Software Engineering Topics",
        translateKey: "software_engineering_title",
        items: [
            {
                icon: "fas fa-sitemap",
                name: "Design Patterns",
                translateKey: "design_patterns"
            },
            {
                icon: "fas fa-code-branch",
                name: "Version Control",
                translateKey: "version_control"
            },
            {
                icon: "fas fa-tasks",
                name: "Agile Methodology",
                translateKey: "agile_methodology"
            }
        ]
    },
    
    // Manual Testing course
    "manual_testing": {
        title: "Manual Testing Types",
        translateKey: "manual_testing_title",
        items: [
            {
                icon: "fas fa-check-square",
                name: "Functional Testing",
                translateKey: "functional_testing"
            },
            {
                icon: "fas fa-tachometer-alt",
                name: "Performance Testing",
                translateKey: "performance_testing"
            },
            {
                icon: "fas fa-shield-alt",
                name: "Security Testing",
                translateKey: "security_testing"
            }
        ]
    },
        
    // Web Development course
    "web_development": {
        title: "Web Technologies",
        translateKey: "web_development_title",
        items: [
            {
                icon: "fab fa-html5",
                name: "HTML & CSS",
                translateKey: "html_css"
            },
            {
                icon: "fab fa-react",
                name: "React",
                translateKey: "react"
            },
            {
                icon: "fab fa-node-js",
                name: "Node.js",
                translateKey: "nodejs"
            }
        ]
    },
    
    // Software Development course
    "api_testing": {
        title: "API Testing",
        translateKey: "api_testing_title",
        items: [
            {
                icon: "fas fa-server",
                name: "Postman",
                translateKey: "postman"
            },
            {
                icon: "fas fa-desktop",
                name: "SoapUI",
                translateKey: "soapui"
            }
        ]
    },
    
    // Quality Assurance course
    "quality_assurance": {
        title: "QA Processes",
        translateKey: "quality_assurance_title",
        items: [
            {
                icon: "fas fa-clipboard-list",
                name: "Test Planning",
                translateKey: "test_planning"
            },
            {
                icon: "fas fa-clipboard-check",
                name: "Test Cases",
                translateKey: "test_cases"
            },
            {
                icon: "fas fa-bug",
                name: "Defect Management",
                translateKey: "defect_management"
            }
        ]
    },
};

/**
 * Generates HTML for a course popup item
 * @param {Object} item - The item data
 * @returns {String} HTML string for the item
 */
function generatePopupItem(item) {
    const nestedClass = item.hasChildren ? 'nested-item' : '';
    const indicator = item.hasChildren ? '<i class="fas fa-chevron-right nested-indicator"></i>' : '';
    const nestedPopup = item.hasChildren ? generateNestedPopup(item.children) : '';
    
    return `
        <li class="${nestedClass}">
            <i class="${item.icon} course-icon"></i>
            <span data-translate="${item.translateKey}">${item.name}</span>
            ${indicator}
            ${nestedPopup}
        </li>
    `;
}

/**
 * Generates HTML for a nested popup
 * @param {Object} nestedData - The nested popup data
 * @returns {String} HTML string for the nested popup
 */
function generateNestedPopup(nestedData) {
    const items = nestedData.items.map(item => generatePopupItem(item)).join('');
    
    return `
        <div class="nested-popup">
            <div class="nested-popup-title" data-translate="${nestedData.translateKey}">${nestedData.title}</div>
            <ul>
                ${items}
            </ul>
        </div>
    `;
}

/**
 * Generates HTML for a course popup
 * @param {String} courseId - The ID of the course
 * @returns {String} HTML string for the course popup
 */
function generateCoursePopup(courseId) {
    const courseInfo = courseData[courseId];
    if (!courseInfo) return '';
    
    const items = courseInfo.items.map(item => generatePopupItem(item)).join('');
    
    return `
        <div class="course-popup">
            <div class="course-popup-title" data-translate="${courseId}_title">${courseInfo.title}</div>
            <ul>
                ${items}
            </ul>
        </div>
    `;
}

/**
 * Initializes all course popups based on data attributes
 */
function initCoursePopups() {
    document.querySelectorAll('.course-item[data-course-id]').forEach(courseItem => {
        const courseId = courseItem.getAttribute('data-course-id');
        const existingPopup = courseItem.querySelector('.course-popup');
        
        // Only generate popup if it doesn't already exist
        if (!existingPopup && courseData[courseId]) {
            courseItem.innerHTML += generateCoursePopup(courseId);
        }
    });
}

// Initialize popups when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initCoursePopups);

// Export functions for potential use in other scripts
window.coursePopups = {
    generateCoursePopup,
    initCoursePopups,
    courseData
};
