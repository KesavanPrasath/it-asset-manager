# it-asset-manager
B9IS123 Project CA1

# Module Assignment Cover Sheet

- **Student Name:** Kesavan Prasath Kathireshan
- **Student Number:** 20101776
- **Programme:** 2526_TMD3
- **Lecturer Name:** Paul Laird
- **Module/Subject Title:** PROGRAMMING FOR INFORMATION SYSTEMS
- **Module Code:** B9IS123
- **Assignment Title:** Project Assignment 2: Information Systems POC

By submitting this assignment, I am confirming that:
1. This assignment is entirely my own work.
2. Any external sources used have been fully referenced.
3. I have closely followed the Generative AI Assessment instructions (Scale Level 4/5).
4. All work uploaded is submitted via tracking channels where similarities can be audited.

---

## System Overview
This is a decoupled Information System designed to manage small office IT hardware inventories. 
- **Backend Architecture:** Python Flask REST API
- **Data Layer:** Flat-file JSON structure 
- **Frontend Architecture:** Asynchronous vanilla JavaScript interacting with standard DOM elements.

---

## Live Deployment
The application is containerized with Docker and continuously deployed on Google Cloud Platform:
***Live App URL:** https://ca2-project-762609539408.europe-west1.run.app

---

## GenAI Attribution & Usage Declaration
In accordance with academic integrity guidelines, Generative AI (Gemini) was utilized during the development of this project:
1. **Debugging & Logic Fixes:** Assisted in troubleshooting dynamic DOM updates for the dashboard metrics cards in `static/app.js` and resolving Git merge conflicts during deployment.
2. **Deployment Configuration:** Assisted in drafting the containerization steps (`Dockerfile` configuration) optimized for stateless deployment on Google Cloud Run.