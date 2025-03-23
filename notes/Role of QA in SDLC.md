---
lastSync: Thu Mar 13 2025 22:15:02 GMT+0300 (GMT+03:00)
---
### Role of QA in SDLC (Software Development Life Cycle)
Quality Assurance (QA) is involved in in every stage of the SDLC, ensuring that software meets quality standards before release. Unlike testing, which happens after development, QA works proactively to prevent defects throughout the entire development cycle.

---
## QA Responsibilities in Each SDLC Phase

#### 1. Planning Stage - Preventing Issues Early
##### What QA does?
- Reviews the requirements document to ensure they are clear, testable, and feasible.
- Identifies potential risks and suggests mitigation strategies.
- Defines the QA strategy (manual vs. automation, tools to be used, testing scope).

##### QA Contributions:
- Requirement analysis to ensure clarity
- Risk assessment for early defect prevention
- Planning test coverage and automation strategy

---
#### 2. Design Stage - Setting Up Quality Standards

##### What QA does?
- Works with developers to define system architecture and identify testable components.
- Reviews UI/UX design for usability and accessibility compliance.
- Helps in creating test plans & test cases.

##### QA Contributions:
- Validating UI/UX wireframes for usability issues
- Reviewing system design for testability & scalability
- Writing high-level test scenarios

---
#### 3. Development Stage - Preventing Bugs Before Testing

##### What QA does?
- Ensures developers follow coding standards and best practices.
- Implements static code analysis and unit test reviews.
- Starts writing automated test scripts while developers code.

##### QA Contributions:
- Collaborates with developers for early defect detection
- Sets up automation tests in CI/CD pipelines 
- Ensures code quality reviews and test-driven development (TDD)

---
#### 4. Testing Stage - Identifying & Fixing Bugs

##### What QA does?
- Executes manual & automated tests to validate functionality.
- Performs different types of testing:
	- **Functional Testing** (Verifying features work correctly)
	- **Performance Testing** (Checking speed & scalability)
	- **Security Testing** (Identifying vulnerabilities)
	- **Regression Testing** (Ensuring new changes don't break old functionality)
- Reports defects, tracks them, and ensures they are **fixed before release**.

##### QA Contributions:
- Ensuring the **software meets requirements**
- Running **manual & automated tests**
- Tracking bugs using tools like **JIRA, TestRail**

---
#### 5. Deployment Stage - Ensuring a Smooth Release

##### What QA does?
- Conducts **final testing** in a production-like environment.
- Monitors the deployment process using DevOps tools (Jenkins, Kubernetes, Docker).
- Performs smoke testing to verify that the system works after deployment.

##### QA Contributions:
- Verifying stability before release
- Coordinating UAT (User Acceptance Testing)
- Running **post-deployment validation**

---
#### 6. Maintenance Stage - Continuous Monitoring & Support

##### What QA does?
- Monitors logs for **unexpected bugs** and **performance issues**.
- Conducts **patch testing** when updates or hotfixes are deployed.
- Collects user feedback to improve software in **future releases**

##### QA Contributions:
- Bug fixes & patches validation
- Monitoring performance after release
- Planning for **future test improvements**


---

## Why QA us Essential in SDLC?
- **Prevents defects early,** reducing **cost & time** for bug fixing.
- Ensures software meets **customer expectations**.
- Reduces the risk of **security vulnerabilities** and system failures.
- Supports **continuous delivery & DevOps pipelines.**
