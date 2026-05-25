import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const PlannerInput = z.object({
  country: z.string().min(1).max(80),
  days: z.number().min(1).max(30),
  budget: z.string().min(1).max(80),
  travelType: z.string().min(1).max(80),
  interests: z.string().max(400).optional().default(""),
});

const ChatInput = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string().min(1).max(4000),
    })
  ).min(1).max(40),
});

async function callGateway(body: unknown) {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("LOVABLE_API_KEY missing");
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (res.status === 429) throw new Error("Rate limit — try again in a moment.");
  if (res.status === 402) throw new Error("AI credits exhausted. Add credits to continue.");
  if (!res.ok) throw new Error(`AI error ${res.status}`);
  return res.json();
}

export const generateItinerary = createServerFn({ method: "POST" })
  .inputValidator((d) => PlannerInput.parse(d))
  .handler(async ({ data }) => {
    const system = `You are Nova, an elite AI travel planner for Nova TravelVerse. Always respond using the structured tool. Be specific, vivid, and practical.`;
    const user = `Plan a ${data.days}-day trip.
Country: ${data.country}
Budget: ${data.budget}
Travel type: ${data.travelType}
Interests: ${data.interests || "general sightseeing"}`;

    const json = await callGateway({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "render_itinerary",
            description: "Return a structured travel itinerary",
            parameters: {
              type: "object",
              properties: {
                title: { type: "string" },
                summary: { type: "string" },
                estimatedBudget: { type: "string" },
                budgetBreakdown: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      category: { type: "string" },
                      amount: { type: "string" },
                    },
                    required: ["category", "amount"],
                  },
                },
                hotels: { type: "array", items: { type: "string" } },
                food: { type: "array", items: { type: "string" } },
                days: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      day: { type: "number" },
                      title: { type: "string" },
                      activities: { type: "array", items: { type: "string" } },
                      tip: { type: "string" },
                    },
                    required: ["day", "title", "activities"],
                  },
                },
              },
              required: ["title", "summary", "estimatedBudget", "days", "hotels", "food", "budgetBreakdown"],
            },
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "render_itinerary" } },
    });

    const call = json.choices?.[0]?.message?.tool_calls?.[0];
    if (!call) throw new Error("AI returned no itinerary");
    try {
      return JSON.parse(call.function.arguments) as {
        title: string; summary: string; estimatedBudget: string;
        budgetBreakdown: { category: string; amount: string }[];
        hotels: string[]; food: string[];
        days: { day: number; title: string; activities: string[]; tip?: string }[];
      };
    } catch {
      throw new Error("Failed to parse itinerary");
    }
  });

export const chatWithNova = createServerFn({ method: "POST" })
  .inputValidator((d) => ChatInput.parse(d))
  .handler(async ({ data }) => {
    const json = await callGateway({
      model: "google/gemini-3-flash-preview",
      messages: [
        {
          role: "system",
          content:
            "You are Nova, a warm, witty AI travel concierge for Nova TravelVerse. Give short, helpful, exciting travel advice. Use occasional emojis. If asked to plan, suggest using the AI Planner page.",
        },
        ...data.messages,
      ],
    });
    const content = json.choices?.[0]?.message?.content ?? "";
    return { content };
  });
