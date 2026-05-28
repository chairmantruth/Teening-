import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry User-Agent header
const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
  console.warn("⚠️ Warning: GEMINI_API_KEY environment variable is not set. Chat and analysis features will run in mock mode.");
}

const ai = geminiApiKey
  ? new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

let globalMockModeUntil = 0;

function handleGeminiError(error: any) {
  const errStr = JSON.stringify(error) || error?.message || String(error);
  if (
    error?.code === 429 ||
    error?.status === "RESOURCE_EXHAUSTED" ||
    error?.message?.includes("quota") ||
    error?.message?.includes("RESOURCE_EXHAUSTED") ||
    errStr.includes("429") ||
    errStr.includes("quota") ||
    errStr.includes("RESOURCE_EXHAUSTED")
  ) {
    // Cooldown for 15 minutes to preserve resources
    globalMockModeUntil = Date.now() + 15 * 60 * 1000;
    console.warn(`🚨 Rate limit or quota exhausted detected! Enabling offline mock fallback engine for 15 minutes to keep system fully responsive.`);
  }
}

function cleanLogForQuotaError(message: string, error: any) {
  const errStr = error?.message || String(error);
  if (errStr.includes("quota") || errStr.includes("RESOURCE_EXHAUSTED") || errStr.includes("429")) {
    console.warn(`${message} (Status: Quota Exhausted / 429 - Gracefully routed to offline high-fidelity backup mode)`);
  } else {
    console.error(message, error);
  }
}

// Helper to check if AI is configured, otherwise fallback to high-quality mock data 
function checkAI() {
  if (!ai) {
    console.log("Using mock mode due to missing API Key");
    return false;
  }
  if (Date.now() < globalMockModeUntil) {
    const remainingSecs = Math.ceil((globalMockModeUntil - Date.now()) / 1000);
    console.log(`⚠️ Gemini API continues to be under defensive offline cooldown (${remainingSecs}s remaining). Serving offline-curated analysis fallback.`);
    return false;
  }
  return true;
}

// Helper to map counselor identities by country/region
function getCounselorName(country: string) {
  const c = String(country || "Global").trim();
  switch (c) {
    case "Nigeria":
      return { male: "Dr. Chidi Obi", female: "Dr. Amaka Okafor", val: "Nigerian", greeting: "Hello! Always glad to support Nigerian families in navigating the teenage transition." };
    case "Kenya":
      return { male: "Dr. Jomo Kamau", female: "Dr. Faith Mutua", val: "Kenyan", greeting: "Jambo! Welcome. Let's partner to help your teen flourish in modern East Africa." };
    case "South Africa":
      return { male: "Dr. Sipho Khumalo", female: "Dr. Thandeka Zulu", val: "South African", greeting: "Sanibonani! Hello. Let's delve into proactive guidance for your teenager." };
    case "UK":
      return { male: "Dr. Stephen Reynolds", female: "Dr. Elizabeth Higgins", val: "British", greeting: "Hello. It is an honor to work with you on fostering healthy limits and modern teen wellness." };
    case "USA":
      return { male: "Dr. David Carter", female: "Dr. Sarah Jenkins", val: "American", greeting: "Hi there! Let's align on some evidence-based strategies to empower your teenager." };
    case "Global":
      return { male: "Dr. Dave Sterling", female: "Dr. Rebecca Miller", val: "Global", greeting: "Greetings! Let's examine dynamic tools to guide your teen's development across boundaries." };
    default:
      return { male: "Dr. Kwame Boakye", female: "Dr. Efua Mensah", val: "Ghanaian", greeting: "Hello! Medaase. Let's join forces in mentoring and setting healthy milestones with this child." };
  }
}

// REST API for Analyzing Teenager Pain Points & Development Stress
app.post("/api/analyze-pain-points", async (req, res) => {
  const { age, gender, mainChallenges = [], observedBehaviors = "", mentorshipStyle = "encouraging", country = "Ghana" } = req.body;
  try {
    if (!checkAI()) {
      return res.json(getMockAnalysis(age, gender, mainChallenges, observedBehaviors, mentorshipStyle, country));
    }

    const counselor = getCounselorName(country);
    const prompt = `
      Analyze the stress and developmental pain points of a ${age}-year-old ${gender} teenager in a modern digital-first context in ${country}.
      Observed key challenges of the teenager: ${mainChallenges.join(", ")}.
      Observed behavior description: "${observedBehaviors}".
      Mentorship/parenting approach requested: "${mentorshipStyle}".

      Please provide highly-polished psychological insights, focusing on cognitive-behavioral development, peer and digital-society trends, and practical counseling techniques.
      Do NOT include theological, biblical, or religious phrases. Instead, align the advice around healthy autonomy, emotional regulation, proactive structure, active listening, and evidence-based parenting strategies compatible with the culture of ${country}.
    `;

    const response = await ai!.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: `
          You are a world-class young adult psychologist, teenager development researcher, and modern parenting coach specializing in adolescent wellness in ${country}.
          Your advice integrates modern neuroscience, cognitive science, and healthy screen hygiene models.
          Strictly avoid any direct references to scripture, bible, jesus, christianity, or religion. Instead use human-centric clinical, behavioral, and peer counseling terminology.
          Provide responses strictly matching the requested JSON output schema.
        `,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            developmentalStage: {
              type: Type.STRING,
              description: "A summary of this teenager's cognitive, academic, and social-emotional development stage in " + country + ".",
            },
            painPoints: {
              type: Type.ARRAY,
              description: "Key stress or pain points this teenager is facing right now in " + country + ".",
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  category: { type: Type.STRING, description: "e.g., Cognitive, Social, Digital, Biological, Academic" },
                  description: { type: Type.STRING },
                  biblicalRoot: { type: Type.STRING, description: "The underlying psychological or neurological cause behind this symptom." },
                  bibleVerses: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Key actionable psychological tips, hashtags, or cognitive reframing reminders (e.g. '#DopamineDetox - Introduce 45m screen limits')"
                  },
                },
                required: ["title", "category", "description", "biblicalRoot", "bibleVerses"],
              },
            },
            proactivePrevention: {
              type: Type.ARRAY,
              description: "Proactive, preventative safeguards the parent should implement in " + country + ".",
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  actionPlan: { type: Type.STRING, description: "Specific steps to align with the teen." },
                  ghanaianContextNote: { type: Type.STRING, description: "Specific local context note for parents in " + country + "." },
                },
                required: ["title", "actionPlan", "ghanaianContextNote"],
              },
            },
            managementStrategies: {
              type: Type.ARRAY,
              description: "Immediate practical response strategies when tense situations or behavioral friction occur.",
              items: {
                type: Type.OBJECT,
                properties: {
                  situation: { type: Type.STRING, description: "A potential conflict or trigger scenario." },
                  mentorResponse: { type: Type.STRING, description: "Active listening and firm calm response appropriate for " + country + "." },
                  keyPrinciple: { type: Type.STRING, description: "The guiding mental health or behavioral science virtue used." },
                },
                required: ["situation", "mentorResponse", "keyPrinciple"],
              },
            },
          },
          required: ["developmentalStage", "painPoints", "proactivePrevention", "managementStrategies"],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    handleGeminiError(error);
    cleanLogForQuotaError("⚠️ Gemini API calling error in /api/analyze-pain-points (Quotas exhausted or key limit), falling back to high-fidelity offline analysis engine:", error);
    // Serve brilliant offline-curated analysis fallback seamlessly
    const mockData = getMockAnalysis(age, gender, mainChallenges, observedBehaviors, mentorshipStyle, country);
    res.json({
      ...mockData,
      isFallbackMode: true,
      errorInfo: error?.message || String(error)
    });
  }
});

// REST API for Teenager Discipleship Mentor Chat - Powered by active web search grounding
app.post("/api/chat", async (req, res) => {
  const { messages = [], country = "Ghana" } = req.body;
  try {
    if (!checkAI()) {
      const lastUserMsg = messages[messages.length - 1]?.content || "";
      return res.json({ result: getMockChatResponse(lastUserMsg, country), isFallbackMode: true });
    }

    const counselor = getCounselorName(country);
    const systemInstruction = `
      You are ${counselor.male} (or ${counselor.female}, adapting dynamically), an experienced adolescent counselor, teen therapist, and modern parenting advisor in ${country} working for "Teening".
      Your mission is to help parents and mentors understand teen behavior, build emotional intelligence, and resolve digital/academic friction.
      Your vocabulary is friendly, supportive, highly professional, and secular. Start with: "${counselor.greeting}".
      Always base your answers on modern scientific studies, active listening protocols, cognitive reframing, and collaborative boundaries.
      Provide highly comprehensive, beautifully styled, markdown responses. Suggest real-world research or tips.
    `;

    // Process using the models.generateContent to leverage googleSearch tools smoothly!
    const chatContents = messages.map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }]
    }));

    const response = await ai!.models.generateContent({
      model: "gemini-3.5-flash",
      contents: chatContents,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }] // ACTIVE GOOGLE SEARCH GROUNDING - queries open articles & databases
      }
    });

    const lastReply = response.text || "I was unable to compile an answer at the moment. Please try again.";
    
    // Extract grounding URIs to surface them as citation tabs in the UI
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources = chunks
      ? chunks
          .map((chunk: any) => {
            if (chunk?.web?.uri) {
              return {
                title: chunk.web.title || chunk.web.uri,
                url: chunk.web.uri
              };
            }
            return null;
          })
          .filter(Boolean)
      : [];

    res.json({ result: lastReply, sources });
  } catch (error: any) {
    handleGeminiError(error);
    cleanLogForQuotaError("⚠️ Gemini API error in /api/chat (Quota exceeded or transient error), falling back to offline companion model:", error);
    const lastUserMsg = messages[messages.length - 1]?.content || "";
    const mockReply = getMockChatResponse(lastUserMsg, country);
    res.json({ 
      result: `*[Offline Adaptive System Active]*\n\n${mockReply}`,
      isFallbackMode: true,
      errorInfo: error?.message || String(error)
    });
  }
});

// REST API for Voice TTS conversion (Voice Counsel)
app.post("/api/text-to-speech", async (req, res) => {
  const { text } = req.body;
  try {
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    if (!checkAI()) {
      return res.json({ audio: null, note: "API key missing, TTS is unavailable" });
    }

    // Call Gemini 3.1 tts model to output voice
    const response = await ai!.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: `Read this advice piece in a warm, encouraging, empathetic voice: ${text.substring(0, 300)}` }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: "Kore" },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    const mimeType = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.mimeType || "audio/wav";
    if (base64Audio) {
      res.json({ audio: base64Audio, mimeType });
    } else {
      res.json({ audio: null, note: "Failed to generate TTS audio part" });
    }
  } catch (error: any) {
    handleGeminiError(error);
    cleanLogForQuotaError("⚠️ Gemini API TTS error (Quota limit reached), falling back to browser synthesis model:", error);
    res.json({ audio: null, note: "Rate limit reached. Resorting to local web speech fallback audio part safely." });
  }
});

// Mock helpers for high-fidelity offline mode
function getMockAnalysis(age: number, gender: string, challenges: string[], behaviors: string, style: string, country: string = "Ghana") {
  const years = parseInt(age as any) || 15;
  return {
    developmentalStage: `This ${years}-year-old ${gender} teenager is at a critical identity-forming peak in modern ${country} society. At this stage, they are transitioning from dependent childhood to self-determining young adulthood, grappling with academic standards, whilst balancing biological shifts and peer comparisons in a highly connected digital environment.`,
    painPoints: [
      {
        title: "Peer-Comparison & Digital Identity",
        category: "Social & Cognitive",
        description: `Refined digital anxiety arising from comparing their appearance, friendships, and status back against highly-curated social media profiles.`,
        biblicalRoot: "Brain seeking easy validation loops through external performance signals rather than internal self-value.",
        bibleVerses: [
          "#AuthenticSelf - Prioritize human encounters",
          "#MindfulScreenTime - Turn off background notifications"
        ]
      },
      {
        title: "Autonomy Stress & Social Friction",
        category: "Cultural & Behavioral",
        description: `Struggling to manage emotional regulation when parent rules about curfew, digital limits, or school performance feel like direct threats to maturity.`,
        biblicalRoot: "Adolescent seek to establish self-reliant boundaries during standard emotional maturation.",
        bibleVerses: [
          "#ActiveDiplomacy - Solve issues with mutual contracts",
          "#FirmPatience - Keep discussion calm and slow"
        ]
      },
      {
        title: "Screen Time & Sleep Deficit",
        category: "Biological & Digital",
        description: "Late night TikTok, gaming, or chatting leads to elevated cortisol, sleep deprivation, and reduced focus in daylight school hours.",
        biblicalRoot: "Dopamine-driven design of software overrides normal circadian rhythm cues.",
        bibleVerses: [
          "#DigitalDetox - Place charging stations outside bedrooms",
          "#FocusFlow - Dedicate quiet intervals for rest"
        ]
      }
    ],
    proactivePrevention: [
      {
        title: "The Weekly Connection & Active Dialogue Hour",
        actionPlan: "Establish a consistent, friendly weekend family connection hour where the adolescent shares weekly high and low notes without fear of immediate yelling or lecture.",
        ghanaianContextNote: `Root this as a cornerstone of mutual respect in ${country}, sharing meals together to build a secure culture of bonding over strict correction.`
      },
      {
        title: "Encouraging Real-World Skill Anchors",
        actionPlan: "Equip the teenager with physical outlets like art, music, or high-activity sports to satisfy creativity and build a social circle offline.",
        ghanaianContextNote: `In ${country}, linking teenagers with positive, active peer hobbies prevents negative behavioral isolation.`
      }
    ],
    managementStrategies: [
      {
        situation: "The teen becomes stubborn, snaps, or rolls their eyes when corrected about duties or screen limits.",
        mentorResponse: `Avoid yelling or reacting in physical/verbal rage. Say calmly: 'I hear you feel pressured right now. Independent habits and screen hygiene are keys to your adult autonomy. Let's complete this outline, and then set aside 10 minutes to discuss how to adjust rules.'`,
        keyPrinciple: "De-escalation through visual validation, empathetic active listening, and collective accountability."
      },
      {
        situation: "The teen locks themselves in their room and spends hours on their phone instead of participating in family routine.",
        mentorResponse: `Knock gently. Sit with them calmly, build a relationship of trust, teach them that honoring family standards is about respecting each other's spaces.`,
        keyPrinciple: "Restoring physiological safety over forced submission."
      }
    ]
  };
}

function getMockChatResponse(userMsg: string, country: string = "Ghana"): string {
  const msg = userMsg.toLowerCase();
  const counselor = getCounselorName(country);
  const baseResponse = `${counselor.greeting} Under the ${counselor.val} context, supporting modern teenagers requires patience and evidence-backed strategies. `;

  if (msg.includes("screen") || msg.includes("phone") || msg.includes("stubborn") || msg.includes("defiant") || msg.includes("angry")) {
    return baseResponse + `\n\nWhen dealing with teenage screen conflicts, here are three secular, psychology-backed pillars to help:
    
1. **Co-Design Tech Rules Together**: Instead of unilateral bans, establish a 'digital contract' with pre-scheduled Wi-Fi sleeping slots that apply uniformly to foster fairness.
2. **Empathy over Reaction**: When a teenager snaps, take a breath. Say, 'I can see you're super frustrated right now. I want to understand what's making this hard for you.' It instantly de-escalates cortisol.
3. **Encourage Analog Replacements**: Craft spaces inside the home that invite physical play, vintage records, journaling, or offline reading to lower screen dependence naturally.`;
  }

  return baseResponse + `\n\nHow can I help you support, guide, and mentor your teenager today? I am here to share modern psychological principles, digital balance contracts, and practical adolescent guidance suited for families and mentors in ${country}.`;
}

// Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Teening server running dynamically on port ${PORT}`);
  });
}

startServer();
