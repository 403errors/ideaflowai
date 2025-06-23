# IdeaFlowAI ✨

**Turn Your Spark of an Idea into a Fully-Planned Application.**

IdeaFlowAI is an innovative web application that bridges the gap between a raw concept and a developer-ready plan. Using the power of generative AI, it guides users through a structured workflow to transform their initial thoughts, sketches, or documents into a comprehensive technical brief, complete with a file structure and sequential engineering prompts.

![IdeaFlowAI Screenshot](https://firebasestorage.googleapis.com/v0/b/ideaflow-ai-tt5i0.firebasestorage.app/o/ideaflow_ai_thumbnai.jpeg?alt=media&token=c18ef116-ef64-4947-b199-28f55fb1a9aa)

## 🚀 Core Features

-   **AI-Powered Idea Extraction**: Automatically convert ideas from plain text, images, or PDFs into a structured markdown summary.
-   **Adaptive Questionnaire**: Engage with a smart AI product manager that asks non-technical, multiple-choice questions to refine your idea, select features, and define the user flow.
-   **Intelligent Tech Stack Suggestions**: Receive recommendations for the top 3 web application tech stacks based on modern best practices.
-   **Comprehensive Plan Generation**: Synthesize all your inputs into a final, detailed application development plan.
-   **Developer-Ready Brief**: Automatically generate a project setup prompt, a recommended file structure, and sequential, actionable engineering prompts for each feature.

## 🛠️ How It Works

1.  **Submit Your Idea**: Describe your app concept in any format—text, image, or PDF.
2.  **Refine with AI**: Answer a series of smart, multiple-choice questions to build out your app's features, UI/UX, and flow.
3.  **Generate Your Plan**: Receive a complete, professional development plan based on your choices.
4.  **Launch Your Brief**: Save your project to access a complete development brief, ready to be handed off to an AI developer or a human team.

## 💻 Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **AI Toolkit**: [Genkit](https://firebase.google.com/docs/genkit)
-   **AI Model Provider**: [Google AI (Gemini)](https://ai.google.dev/)
-   **UI**: [React](https://react.dev/), [ShadCN UI](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/)
-   **Backend & Database**: [Firebase (Firestore)](https://firebase.google.com/docs/firestore)
-   **Authentication**: [Firebase Authentication](https://firebase.google.com/docs/auth)

## 🏁 Getting Started

To run this project locally, follow these steps:

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   A Firebase project with Firestore and Authentication enabled.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add your Firebase project configuration:
    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    ```
    You will also need to set up Google AI credentials for Genkit. Follow the [Genkit Google AI plugin setup guide](https://firebase.google.com/docs/genkit/plugins/google-ai#set-up-api-key) for instructions on authenticating.

4.  **Run the development server:**
    The application requires two processes to run concurrently: the Next.js app and the Genkit development server.

    In your first terminal, start the Next.js dev server:
    ```bash
    npm run dev
    ```

    In a second terminal, start the Genkit dev server:
    ```bash
    npm run genkit:dev
    ```

5.  **Open the application:**
    Navigate to [http://localhost:9002](http://localhost:9002) in your browser.
