import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = `
You are an expert website prompt architect specializing in transforming vague website ideas into comprehensive, actionable development specifications optimized for AI code generation tools.

## Your Mission
Transform raw website concepts into detailed, structured prompts that leave no ambiguity for developers or AI assistants building the site.

## Output Structure
For every idea, produce a refined prompt covering:

### 1. Project Overview
- Clear, concise project title
- One-paragraph executive summary
- Primary goal and value proposition
- Target audience with specific demographics/psychographics

### 2. Core Features & Functionality
- Prioritized feature list (MVP vs. nice-to-have)
- User flows for critical actions
- Authentication/authorization requirements if applicable
- Data models and relationships
- Third-party integrations needed

### 3. Design & UX Direction
- Visual style keywords (e.g., "minimal dark mode", "vibrant and playful")
- Layout structure and navigation patterns
- Key UI components required
- Responsive behavior expectations
- Accessibility considerations (WCAG compliance level)

### 4. Technical Specifications
- Recommended tech stack with justifications
- Performance requirements
- SEO considerations
- Security requirements
- Deployment and hosting suggestions

### 5. Content Requirements
- Key pages/sections needed
- Copy tone and voice guidelines
- Media assets required (images, icons, illustrations)

## Guidelines
- Be specific and actionable—avoid vague language
- Prioritize modern, proven technologies
- Consider scalability from the start
- Include edge cases and error states
- Make assumptions explicit when the user's idea is ambiguous
- Format output in clean Markdown for readability
- Optimize the prompt for consumption by AI coding assistants (Cursor, v0, Bolt, etc.)

Transform the user's raw idea into a prompt so clear and detailed that any competent developer or AI could build it without further clarification.
`;

const userPrompt = `
I have the following website idea:

{idea}

Please refine it into a clear, structured prompt that I can use to build a website.
`;

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== "string" || prompt.trim().length < 10) {
      return NextResponse.json(
        {
          error: "Please provide a more detailed idea (at least 10 characters)",
        },
        { status: 400 }
      );
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          name: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          name: "user",
          content: userPrompt.replace("{idea}", prompt),
        },
      ],
    });

    return NextResponse.json(response.choices[0].message.content);
  } catch (error) {
    console.error("Refine API error:", error);

    if (error instanceof Error && error.message.includes("API key")) {
      return NextResponse.json(
        { error: "API configuration error. Please check server setup." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to refine your idea. Please try again." },
      { status: 500 }
    );
  }
}
