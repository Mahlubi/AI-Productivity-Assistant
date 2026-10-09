FreshCut AI Barbershop
1. Project Overview
FreshCut AI Barbershop is a concept for a modern, AI-powered website for a South African barbershop. It aims to make booking appointments easier, answer common customer questions, provide personalised hairstyle suggestions, and help staff organise daily appointments.
The project demonstrates how AI can support a real-world business workflow while keeping customers and staff in control. Example prices and business information should be treated as demo content until replaced with verified details from the barbershop.
2. Features
AI customer chatbot — responds to common questions about services, prices, opening hours, grooming, and bookings using approved business information.
AI Style Finder — suggests hairstyle options based on customer preferences, hair type, lifestyle, and desired maintenance level.
Appointment booking flow — lets a customer choose a service, barber, date, and available time, then view a confirmation.
AI scheduling support — helps staff review appointments, identify possible scheduling conflicts, and organise tasks. Final availability should be checked against the booking data.
Barber/admin dashboard — provides a central place to review bookings and manage service or schedule information.
Responsive design — intended to work on mobile phones, tablets, and desktop screens with a clean, premium barbershop look.
Responsible AI practices — protects personal information, communicates uncertainty, and allows staff to review important AI-generated suggestions.
3. Tools Used
The following is the suggested technology stack for this project. Confirm or update it to match the actual implementation before submitting the project.
Tool	Purpose
React	Build reusable website components and user interfaces.
TypeScript	Add types and help catch errors during development.
Vite	Run the development server and build the frontend.
Tailwind CSS	Style the responsive interface.
OpenAI API	Power chatbot, hairstyle suggestion, and scheduling-assistance features through a secure backend.
Supabase (optional)	Provide database and authentication services for customers, appointments, and staff.
Node.js and npm	Run JavaScript tooling and install project dependencies.
Git / GitHub (optional)	Track code changes and collaborate on the project.
ChatGPT	Support brainstorming, prompt development, and refinement of AI feature requirements.
> **Implementation note:** A presentation or project brief alone does not confirm that every tool above has been integrated. Keep only the tools actually used in the final build, and describe any planned integrations as planned rather than completed.
4. Setup Instructions
These instructions create a React + TypeScript starter project. They do not, by themselves, implement the barbershop features; add the project's source files and service configuration before running the complete application.
Prerequisites
Node.js and npm installed. Use a Node.js version supported by the current Vite release.
The project source code, if you are continuing an existing implementation.
API credentials only for services that have actually been integrated.
Option A: Start a new project
Create a React + TypeScript project:
```bash
   npm create vite@latest freshcut-ai-barbershop -- --template react-ts
   cd freshcut-ai-barbershop
   ```
Install the project dependencies:
```bash
   npm install
   ```
To use Tailwind CSS with the current Vite integration, install its packages:
```bash
   npm install tailwindcss @tailwindcss/vite
   ```
Follow the official Tailwind instructions to add the Vite plugin to `vite.config.ts` and import Tailwind in the main CSS file: https://tailwindcss.com/docs/installation/using-vite.
Add the FreshCut AI Barbershop source code and configure any required routes, components, AI backend, and database connection.
Start the local development server:
```bash
   npm run dev
   ```
Open the local URL printed in the terminal (Vite commonly uses `http://localhost:5173`).
Option B: Run an existing project
Open a terminal in the project directory.
Install dependencies:
```bash
   npm install
   ```
Create the environment file expected by the application (for example, copy `.env.example` to `.env.local`), then fill in only the variables required by the code.
Start the development server:
```bash
   npm run dev
   ```
Create a production build to check for build errors:
```bash
   npm run build
   ```
If a preview script is configured, preview the build with:
```bash
   npm run preview
   ```
Environment variables and API keys
The exact variable names depend on how the backend is implemented. Typical server-side variables might include:
```env
OPENAI_API_KEY=your_server_side_api_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```
Only configure variables for services used by the application. Keep secret keys in the server's environment or a secrets manager. Never put `OPENAI_API_KEY` in client-side code or expose it through a frontend environment variable. Do not commit `.env` files containing secrets to Git. Route AI requests through a trusted backend endpoint. See OpenAI's guidance: https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety.
5. Responsible AI and Testing
Use approved and up-to-date service, pricing, and opening-hour information for chatbot responses.
Ask for only the personal information needed to manage a booking.
Make it clear that hairstyle recommendations are suggestions, not guarantees.
Let a customer or staff member confirm appointments and review important AI outputs.
Test normal, unclear, and invalid inputs; verify that unavailable booking times are not offered as confirmed.
Compare AI outputs after changing prompts, and refine prompts when responses are vague, inaccurate, or incomplete.
6. Project Goal
The goal is to demonstrate how AI can improve customer support and reduce repetitive administrative work in a barbershop, while applying prompt engineering, testing, and responsible AI principles.
