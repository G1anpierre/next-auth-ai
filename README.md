# Next.js AI Authentication

![Next Auth AI](https://github.com/G1anpierre/next-auth-ai/raw/main/public/next-auth-ai-preview.png)

A modern authentication system with AI capabilities for Next.js applications, integrating NextAuth.js with various AI services for enhanced security and user experience.

## Features

- **Multi-provider Authentication**: Support for Google, GitHub, and credentials authentication
- **AI-powered Security**: Anomaly detection for suspicious login attempts
- **Passwordless Options**: Magic link and OTP authentication
- **JWT & Session Management**: Secure token handling and session persistence
- **Role-based Access Control**: Fine-grained permissions system
- **User Profile Management**: User data management with AI-enhanced features
- **Responsive Design**: Works seamlessly on all devices

## Tech Stack

- **Framework**: Next.js with App Router
- **Authentication**: NextAuth.js v5
- **Database**: Prisma with PostgreSQL
- **AI Integration**: OpenAI for enhanced security features
- **Styling**: Tailwind CSS with Shadcn UI components
- **State Management**: React Context and Zustand
- **Form Handling**: React Hook Form with Zod validation

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/G1anpierre/next-auth-ai.git
   cd next-auth-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with:
   ```
   # Database
   DATABASE_URL=your_postgresql_connection_string
   
   # NextAuth
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   
   # OAuth Providers
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   
   # AI Services
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Authentication Flow

The authentication system includes several key components:

1. **Multi-provider Support**: Users can sign in with various providers
2. **JWT Generation & Validation**: Secure token management
3. **Session Management**: Persistent sessions with secure storage
4. **AI Risk Assessment**: Analyzing login patterns for suspicious activity
5. **Authentication Callbacks**: Custom logic for auth events

## AI Features

The AI integration includes:

- **Anomaly Detection**: Identifying unusual login patterns or behaviors
- **Behavioral Biometrics**: Analyzing typing patterns and user behavior
- **Enhanced Security Questions**: Dynamically generated security questions
- **Intelligent Password Suggestions**: Secure and memorable password recommendations

## Project Structure

- `/app`: Next.js App Router components and pages
- `/components`: Reusable UI components
- `/lib`: Utility functions and authentication setup
- `/prisma`: Database schema and migrations
- `/public`: Static assets
- `/styles`: Global CSS and Tailwind configuration

## Security Considerations

- **Rate Limiting**: Preventing brute force attacks
- **CSRF Protection**: Built-in protection against cross-site request forgery
- **Data Encryption**: Sensitive data is encrypted at rest
- **Security Headers**: Implementation of recommended security headers

## Deployment

Follow these steps to deploy your application:

1. Set up your database (PostgreSQL recommended)
2. Configure environment variables in your hosting environment
3. Deploy to Vercel, Netlify, or your preferred hosting service

## License

This project is licensed under the MIT License.