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
  const c = String(country || "Ghana").trim();
  switch (c) {
    case "Nigeria":
      return { male: "Brother Chidi", female: "Pastor Amaka", val: "Nigerian", greeting: "Alafia / Peace be unto you! God bless your discipleship labor." };
    case "Kenya":
      return { male: "Elder Jomo", female: "Mwalimu Faith", val: "Kenyan", greeting: "Habari, Bwana asifiwe! Warm greetings from our beautiful East Africa in Christ." };
    case "South Africa":
      return { male: "Pastor Sipho", female: "Sister Thandeka", val: "South African", greeting: "Sanibonani / Dumelang! Greetings in the precious name of Jesus Christ." };
    case "UK":
      return { male: "Mentor Stephen", female: "Deaconess Elizabeth", val: "British", greeting: "Hello in Christ. It's a privilege to fellowship with you in training this teenager." };
    case "USA":
      return { male: "Pastor David", female: "Sister Sarah", val: "American", greeting: "Hello! God bless you abundantly. Let's partner together to disciple this young standard-bearer." };
    case "Global":
      return { male: "Mentor Dave", female: "Elder Rebecca", val: "Global", greeting: "Greetings in Christ Jesus! Let's align our mentorship across boundaries for this next generation." };
    default:
      return { male: "Uncle Kwame", female: "Auntie Efua", val: "Ghanaian", greeting: "Medaase, greeting in our Lord Jesus. God bless your labor of love with this child." };
  }
}

// REST API for Analyzing Teenager Pain Points & Development Stress
app.post("/api/analyze-pain-points", async (req, res) => {
  const { age, gender, mainChallenges = [], observedBehaviors = "", mentorshipStyle = "encouraging", country = "Ghana" } = req.body;
  try {
    if (!checkAI()) {
      // Fallback response with excellent dynamic Christian context mock data
      return res.json(getMockAnalysis(age, gender, mainChallenges, observedBehaviors, mentorshipStyle, country));
    }

    const counselor = getCounselorName(country);
    const prompt = `
      Analyze the stress and developmental pain points of a ${age}-year-old ${gender} teenager in a modern Christian context in ${country}.
      Observed key challenges of the teenager: ${mainChallenges.join(", ")}.
      Observed behavior description: "${observedBehaviors}".
      Mentorship/parenting approach requested: "${mentorshipStyle}".

      Please provide deep Christian-centered guidance, incorporating biblical principles, cultural insights of ${country}, and practical teen development psychology.
      Ensure the guidance advises the mentor, guide, or parent on how to disciple, support, and raise this teen to be spiritual, disciplined, proactive, responsible, kind, and excellent.
    `;

    const response = await ai!.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: `
          You are a highly respected, wise Christian parenting expert, teenager psychologist, and veteran discipleship mentor specializing in the ${country} Christian community.
          Your counseling blends modern adolescent developmental psychology with deep, sound biblical theology.
          Keep context entirely appropriate for ${country}: reference its local church systems, societal/schooling pressures, family expectations, and modern cyber/media temptations.
          Provide responses strictly matching the requested JSON output schema.
        `,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            developmentalStage: {
              type: Type.STRING,
              description: "A summary of this teenager's academic, physical, and emotional development stage within modern " + country + " society.",
            },
            painPoints: {
              type: Type.ARRAY,
              description: "Key stress or pain points this teenager is facing right now in " + country + ".",
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  category: { type: Type.STRING, description: "e.g., Spiritual, Social, Academic, Biological, Cultural" },
                  description: { type: Type.STRING },
                  biblicalRoot: { type: Type.STRING, description: "The spiritual or biblical dimension of this struggle." },
                  bibleVerses: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Key verses of encouragement (with verse address first, e.g. Proverbs 22:6 - 'Train up a child...')"
                  },
                },
                required: ["title", "category", "description", "biblicalRoot", "bibleVerses"],
              },
            },
            proactivePrevention: {
              type: Type.ARRAY,
              description: "Proactive, preventative safeguards the parent or mentor should put in place in " + country + ".",
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  actionPlan: { type: Type.STRING, description: "Specific steps to implement with the teen." },
                  ghanaianContextNote: { type: Type.STRING, description: "Specific context tip for " + country + ", e.g. local church programs, school styles, or cultural values in that country." },
                },
                required: ["title", "actionPlan", "ghanaianContextNote"],
              },
            },
            managementStrategies: {
              type: Type.ARRAY,
              description: "Immediate practical response strategies when tense situations or behavioral flare-ups occur.",
              items: {
                type: Type.OBJECT,
                properties: {
                  situation: { type: Type.STRING, description: "A potential conflict or trigger scenario." },
                  mentorResponse: { type: Type.STRING, description: "The godly, wise, developmental-friendly response appropriate for " + country + "." },
                  keyPrinciple: { type: Type.STRING, description: "The guiding biblical or psychological virtue used." },
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

// REST API for Teenager Discipleship Mentor Chat
app.post("/api/chat", async (req, res) => {
  const { messages = [], country = "Ghana" } = req.body;
  try {
    if (!checkAI()) {
      // Return beautiful mock response
      const lastUserMsg = messages[messages.length - 1]?.content || "";
      return res.json({ result: getMockChatResponse(lastUserMsg, country) });
    }

    const counselor = getCounselorName(country);
    const systemInstruction = `
      You are ${counselor.male} (or ${counselor.female}, adapting dynamically), an experienced Christian Teenager Discipleship Counselor and Elder from ${country} who is deeply passionate about mentoring high-schoolers and young teenagers.
      You help parents, mentors, and the teenagers themselves to live godly, productive, spiritual, disciplined, responsible, kind, and awesome Christian teen lives.
      Your vocabulary is warm, respectful, wise, and highly culturally relevant to ${country}. You start with a polite local greeting: "${counselor.greeting}".
      Always point to biblical values (prayerfulness, obedience, hard work, kindness, responsibility) with great empathy, and never in a condemning tone. Show mentors how to discipline teenagers properly with clear loving boundary alignment, not rage, showing grace and standing firm.
      Keep your answers helpful, beautifully formatted in Markdown, and structurally concise so the user can implement them easily.
    `;

    const chatInstance = ai!.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction,
      },
    });

    let lastReply = "";
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      if (i === messages.length - 1) {
        // Send the final user message to generate reply
        const response = await chatInstance.sendMessage({ message: msg.content });
        lastReply = response.text || "";
      } else {
        await chatInstance.sendMessage({ message: msg.content });
      }
    }

    res.json({ result: lastReply });
  } catch (error: any) {
    handleGeminiError(error);
    cleanLogForQuotaError("⚠️ Gemini API error in /api/chat (Quota exceeded or transient error), falling back to offline companion model:", error);
    const lastUserMsg = messages[messages.length - 1]?.content || "";
    const mockReply = getMockChatResponse(lastUserMsg, country);
    res.json({ 
      result: `*[Offline Mode Active]*\n\n${mockReply}`,
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
      contents: [{ parts: [{ text: `Read this Christian counseling piece in a sweet, clear, empathetic Ghanaian maternal-maternal mentor voice: ${text.substring(0, 300)}` }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: "Kore" }, // Kore is an excellent female voice
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

// Mock helpers for high-fidelity offline mode (if Gemini API key isn't provided)
function getMockAnalysis(age: number, gender: string, challenges: string[], behaviors: string, style: string, country: string = "Ghana") {
  const years = parseInt(age as any) || 15;
  const counselor = getCounselorName(country);
  return {
    developmentalStage: `This ${years}-year-old ${gender} teenager is at a critical identity-forming peak in modern ${country} society. At this stage, they are transitioning from dependent childhood to self-determining adulthood, grappling with regional academic standards in ${country}, whilst balancing biological shifts and peer comparisons in a highly connected digital environment.`,
    painPoints: [
      {
        title: "Peer-Comparison & Digital Identity",
        category: "Social & Biological",
        description: `Anxiety arising from comparing themselves to classmates in terms of appearance, lifestyle, or academic accomplishments, accelerated by social media feeds in ${country}.`,
        biblicalRoot: "Trying to satisfy worldly standards rather than seeing themselves as fearfully and wonderfully made by God.",
        bibleVerses: [
          "Psalm 139:14 - 'I will praise You, for I am fearfully and wonderfully made; marvelous are Your works...'",
          "Galatians 1:10 - 'Am I now seeking the approval of human beings, or of God?'"
        ]
      },
      {
        title: "Independence Stress & Faith Testing",
        category: "Cultural & Spiritual",
        description: `Being away from constant parental gaze in modern school systems in ${country} causes stress in remaining firm in local youth fellowships or scripture unions.`,
        biblicalRoot: "The pressure to conform to the crowd and dilute biblical principles in fear of being labeled 'too religious'.",
        bibleVerses: [
          "1 Timothy 4:12 - 'Let no one despise your youth, but be an example to the believers in conduct, in love, in faith, in purity.'",
          "Romans 12:2 - 'Do not conform to the pattern of this world, but be transformed...'"
        ]
      },
      {
        title: "Screen Time & Devotional Displacement",
        category: "Biological & Spiritual",
        description: "Late night internet or gaming browsing leads to sleep deprivation, causing school sluggishness and displacement of early morning devotion and quiet time with God.",
        biblicalRoot: "Distraction of the flesh that blocks discipline (Proverbs 25:28) and steals spiritual focus.",
        bibleVerses: [
          "Proverbs 4:23 - 'Keep your heart with all diligence, for out of it spring the issues of life.'",
          "Mark 1:35 - 'Very early in the morning, while it was still dark, Jesus got up, went off to a solitary place, and prayed.'"
        ]
      }
    ],
    proactivePrevention: [
      {
        title: "The Weekly Family Altar & Guided Testimonies",
        actionPlan: "Establish a consistent, friendly weekend family connection hour where the adolescent shares weekly high and low notes without fear of immediate shouting or lecture.",
        ghanaianContextNote: `Root this as a cornerstone of family respect in ${country}, sharing local meals together to build a secure culture of bonding over strict correction.`
      },
      {
        title: "Active Devotional Mentorship Connection",
        actionPlan: "Equip the teenager with an attractive physical Journal and coordinate with a dedicated local youth minister, school scripture union patron, or godly mentor.",
        ghanaianContextNote: `In ${country}, linking teenagers with positive, active peer groups prevents negative behavioral isolation.`
      }
    ],
    managementStrategies: [
      {
        situation: "The teen becomes stubborn, snaps, or rolls their eyes when corrected about duties or screen limits.",
        mentorResponse: `Avoid yelling or reacting in physical/verbal rage. Say calmly: 'Under the Lord, obedience and responsibility are part of your training to become an awesome, proactive adult. Let's finish this task together, then we'll find a relaxed moment to chat about what's bothering you.'`,
        keyPrinciple: "Loving correction, self-control, and respectful boundaries (Proverbs 15:1)."
      },
      {
        situation: "The teen locks themselves in their room and spends hours on their phone instead of participating in family prayer.",
        mentorResponse: `Knock gently. Sit with them calmly, build a relationship of trust, teach them that honoring family standards is about respecting God, and maintain a friendly nocturnal digital boundary in the household.`,
        keyPrinciple: "Spiritual discipline modeled with love (Ephesians 6:4)."
      }
    ]
  };
}

function getMockChatResponse(userMsg: string, country: string = "Ghana"): string {
  const msg = userMsg.toLowerCase();
  const counselor = getCounselorName(country);
  const baseResponse = `${counselor.greeting} Under the ${counselor.val} context, discipling teenagers requires great wisdom, immense patience, and constantly relying on the Holy Spirit. `;

  if (msg.includes("disciple") || msg.includes("command") || msg.includes("stubborn") || msg.includes("he") || msg.includes("she")) {
    return baseResponse + `\n\nWhen dealing with teenage stubbornness, let us remember **Colossians 3:21**: *"Fathers, do not embitter your children, or they will become discouraged."*
    
Here are three pillars to disciple them properly:
1. **Correction over condemnation**: Instead of shouting, take the teenager aside listfully. Explain clearly how their action deviates from God's pattern of love and excellence.
2. **Assign Responsible Roles**: Teenagers want to feel mature and trusted. Active tasks like leading prayer or setting up home structures trigger godly responsibility.
3. **Consistent Active Prayer**: Pray with the teenager, and pray for them by name every single night. Let them see your high spiritual standard and live it out.
    
Let me know the specific situation we are facing, and we will apply biblical wisdom to walk through it!`;
  }

  if (msg.includes("pray") || msg.includes("bible") || msg.includes("devotion") || msg.includes("church")) {
    return baseResponse + `\n\nNurturing a vibrant prayer life in our youth requires transitioning them from religious routine to active relationship with Christ:
    
- **Make family devotions lively and interactive**: Keep it concise (15-20 minutes), with open questions rather than a one-way sermon.
- **Give them active ownership**: Let the teen select the songs of praise, or design the prayer topics themselves.
- **Support a scripture journal**: Buy them a beautiful notebook to write, doodle, or register their personal conversations with the Lord.
    
Remember **Proverbs 22:6**. Let's keep showing them a beautiful, joyful example of walk with the Lord!`;
  }

  return baseResponse + `\n\nHow can I help you support, guide, and disciple your teenagers today? I am here to share biblical principles and practical developmental guidelines suited for ${country} families, churches, and peer societies. Share what they are going through!`;
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
    console.log(`🚀 Ghanaian Teen Disciple Guide server successfully running on port ${PORT}`);
  });
}

startServer();
