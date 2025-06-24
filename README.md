# TrendPulse 📈

**TrendPulse is a browser-based, AI-powered dashboard** that analyzes viral YouTube and TikTok Shorts and generates optimized titles, tags, hooks, and content strategies for creators.

## 🚀 Live Demo

**[Click here to try TrendPulse](https://trendpulse-fixed.netlify.app/)**

![TrendPulse App Demo](./assets/demo.gif)
*Note: This demo GIF was recorded during development. The live version features the most up-to-date UI and data.*

## ⚠️ Important Note on Load Time

**⏳ First-time loading may take a few seconds.**

TrendPulse's backend is currently hosted on Render's free tier, which may put the server to sleep after periods of inactivity. As a result, the first request (e.g., loading analytics or trending content) can take **5–10 seconds** while the server "wakes up." This is a known limitation of cold starts on free cloud services and **does not reflect the app’s actual performance under normal usage**.

> Subsequent requests will load much faster once the server is active.

We appreciate your patience and understanding while we continue building toward a fully optimized experience.

---

## 🔥 Features
- **Dashboard & Analytics:** View key performance metrics, platform distribution, and chart performance over time with rich, mock data.
- **Trending Content:** Browse a list of viral videos, filterable by platform and category.
- **AI-Powered Content Analysis:** Submit a script or idea and receive an AI-generated analysis of its viral potential.
- **Creator Workspace:** Manage and track your content projects from planning to completion.

---

## 🛠️ Technologies & Architecture

This project is a full-stack, multi-service application deployed on a modern cloud infrastructure.

<table>
  <tr>
    <td valign="top" width="33%">
      <strong>Frontend</strong>
      <br/><br/>
      <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
      <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
      <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
      <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/>
      <img src="https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white" alt="React Query"/>
    </td>
    <td valign="top" width="33%">
      <strong>Backend & AI</strong>
      <br/><br/>
      <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
      <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js"/>
      <img src="https://img.shields.io/badge/esbuild-FFCF00?style=for-the-badge&logo=esbuild&logoColor=black" alt="esbuild"/>
      <img src="https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white" alt="OpenAI API"/>
    </td>
    <td valign="top" width="33%">
      <strong>DevOps & Cloud</strong>
      <br/><br/>
      <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white" alt="Git"/>
      <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"/>
      <img src="https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" alt="Netlify"/>
      <img src="https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" alt="Render"/>
    </td>
  </tr>
</table>

---

## 🚧 Project Story & Status

TrendPulse began as a rapidly developed MVP (Minimum Viable Product) on Replit to prove out a core concept. A significant part of this project then involved **migrating the application from its original monolithic architecture to a scalable, multi-service cloud environment.**

This process showcased critical, real-world engineering skills, including:
- **Re-architecting** the backend build process from `tsc` to `esbuild`.
- **Configuring a CI/CD pipeline** for a frontend on Netlify and a backend on Render.
- **Implementing and debugging** a robust CORS policy for secure cross-origin communication.
- **Systematically resolving** a full-stack range of production errors, from build failures to frontend rendering crashes.

This journey highlights not just fast prototyping, but also the engineering discipline required to transform a proof-of-concept into a stable, production-ready application.

### Future Goals
- **Full mobile compatibility and responsive design.**
- Persistent database integration to replace in-memory storage.
- User authentication and saved project history.
- Deeper, multi-platform analytics.

---

## ⚙️ Getting Started Locally

To run this project on your own machine:

1.  Clone the repository:
    ```bash
    git clone [https://github.com/DaveRLashley/TrendPulse-Fixed.git](https://github.com/DaveRLashley/TrendPulse-Fixed.git)
    ```
2.  Navigate to the project directory:
    ```bash
    cd TrendPulse-Fixed
    ```
3.  Install the necessary dependencies:
    ```bash
    npm install
    ```
4.  Create a `.env` file in the root of the project and add your `OPENAI_API_KEY`.
5.  Start the local development server:
    ```bash
    npm run dev
    ```
6.  Open the URL shown in the terminal (usually `http://localhost:5173`) in your browser.
