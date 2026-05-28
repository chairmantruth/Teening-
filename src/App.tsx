import React, { useState, useRef, useEffect } from "react";
import { 
  Compass, 
  MessageSquare, 
  BookOpen, 
  Users, 
  Brain, 
  Sparkles, 
  Volume2, 
  VolumeX,
  Play, 
  RotateCcw, 
  Send, 
  ThumbsUp, 
  MessageCircle, 
  PlusCircle, 
  MapPin, 
  CheckCircle2, 
  Award, 
  ChevronRight,
  ChevronLeft,
  User,
  AlertTriangle,
  Flame,
  Mic,
  MicOff,
  Cross,
  Menu,
  X,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ForumPost, AssessmentResult, ChatMessage } from "./types";
import { PRE_POPULATED_POSTS, PARENTING_RESOURCES } from "./data";

export default function App() {
  // Onboarding Location & Sign up context
  const [signupCountry, setSignupCountry] = useState<string>(() => localStorage.getItem("selected_country") || "Ghana");
  const [signupRole, setSignupRole] = useState<string>(() => localStorage.getItem("selected_role") || "Parent");
  const [signupName, setSignupName] = useState<string>(() => localStorage.getItem("selected_name") || "");
  const [hasCompletedSignup, setHasCompletedSignup] = useState<boolean>(() => localStorage.getItem("has_signed_up") === "true");

  // Navigation
  const [activeTab, setActiveTab] = useState<"dashboard" | "chat" | "forum" | "resources">("dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Wheel category selection
  const [selectedWheelCategory, setSelectedWheelCategory] = useState<string>("spiritual");

  // Assessment & Analysis Tool
  const [assessmentAge, setAssessmentAge] = useState<number>(14);
  const [assessmentGender, setAssessmentGender] = useState<"Boy" | "Girl">("Boy");
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([
    "Social Media comparisons",
    "Boarding school adjustments"
  ]);
  const [customBehavior, setCustomBehavior] = useState<string>("");
  const [mentorshipStyle, setMentorshipStyle] = useState<string>("encouraging");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AssessmentResult | null>(null);
  const [activeAnalysisTab, setActiveAnalysisTab] = useState<"insights" | "proactive" | "management">("insights");

  // Online Teens WhatsApp & Telegram Group Planner States
  const [groupPlannerPlatform, setGroupPlannerPlatform] = useState<"whatsapp" | "telegram">("whatsapp");
  const [groupPlannerStep, setGroupPlannerStep] = useState<number>(1);
  const [selectedScheduleDay, setSelectedScheduleDay] = useState<string>("monday");
  const [selectedPromptCategory, setSelectedPromptCategory] = useState<string>("discussion");
  const [pollVotes, setPollVotes] = useState<number[]>([12, 18, 5]);
  const [votedPollIndex, setVotedPollIndex] = useState<number | null>(null);
  const [isPromptCopied, setIsPromptCopied] = useState<boolean>(false);

  // Helpers is local for Counselor greetings in Onboarding callback parity
  const getLocalCounselorInfo = (cCountry: string) => {
    switch (cCountry) {
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
  };

  // SVG drawing calculators for the Teenager Development Wheel
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  };

  const getArcPath = (x: number, y: number, radius: number, innerRadius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const startInner = polarToCartesian(x, y, innerRadius, endAngle);
    const endInner = polarToCartesian(x, y, innerRadius, startAngle);
    
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
      "M", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "L", endInner.x, endInner.y,
      "A", innerRadius, innerRadius, 0, largeArcFlag, 1, startInner.x, startInner.y,
      "Z"
    ].join(" ");
  };

  const WHEEL_CATEGORIES = [
    {
      id: "spiritual",
      name: "Self-Identity & Purpose",
      icon: "✨",
      color: "#047857",
      bgColor: "#ecfdf5",
      borderColor: "#047857",
      challenges: "Struggling to find an authentic voice, getting caught in heavily-curated digital vanity comparison feeds.",
      milestones: "Forming an introspective, independent identity; displaying confidence offline regardless of social media trends.",
      bibleVerses: ["#AuthenticSelf - Value organic real-world connection", "#MindfulAttention - Reduce reactive validation seeking"],
      strategies: [
        "Aesthetic Analog Outlets: Introduce instant cameras, record players, or visual sketchbooks to satisfy creative expression offline.",
        "Dopamine-Free Mornings: Promote starting the day with a stretch, personal journaling, or quiet hydration instead of hitting screen feeds.",
        "Reframing Influence: Encourage discussions on how algorithms curate feeds to capture attention rather than measure real-world worth."
      ]
    },
    {
      id: "emotional",
      name: "Emotional Balance",
      icon: "🧠",
      color: "#4f46e5",
      bgColor: "#f5f3ff",
      borderColor: "#4f46e5",
      challenges: "Mood irritability, midnight feed doomscrolling sleep fatigue, group chat peer status anxiety.",
      milestones: "Handling triggers without explosive door-slams, articulating anxieties calmly, and maintaining healthy self-value.",
      bibleVerses: ["#DopamineDetox - Clear mental screen clutter", "#PauseMethod - Breathe 3 seconds before reacting"],
      strategies: [
        "The 3-Second Breath Pause: When stress spikes, cue a conscious breath to allow the prefrontal cortex to de-escalate reactivity.",
        "Reflective Mirroring: Say 'It sounds like you felt really overwhelmed by that team feedback. Is that right?' to build safety.",
        "Secure Talk Intervals: Set aside casual bi-weekly talks over tea or walks where they can unpack stress without immediate lectures."
      ]
    },
    {
      id: "social",
      name: "Peer Dynamics & Culture",
      icon: "👥",
      color: "#e11d48",
      bgColor: "#fff1f2",
      borderColor: "#e11d48",
      challenges: "Social group chat exclusions, pressure to follow unhealthy online viral trends, or real-world social worries.",
      milestones: "Cultivating organic, respectful offline relationships and asserting firm bounds when snap stats become toxic.",
      bibleVerses: ["#TrueCircle - Quality offline friend bonds", "#TechDiplomacy - Co-create family dynamic rules"],
      strategies: [
        "Low-Stress Boundary Roleplays: Playfully practice boundary scenarios to help them say 'No thanks, that's not really my speed.'",
        "Collaborative Contract Rules: Co-design household screen schedules so boundaries are predictable and mutually owned.",
        "Status-Free Hobbies: Join local skate clubs, chess, bands, or sports teams where digital rankings have zero relevance."
      ]
    },
    {
      id: "academic",
      name: "Focus & Daily Initiative",
      icon: "🎓",
      color: "#b45309",
      bgColor: "#fef3c7",
      borderColor: "#b45309",
      challenges: "Midnight notifications splitting study focus spans, homework procrastination, and chronic exam panic.",
      milestones: "Setting up a clean independent desk schedule, taking proud ownership of complex projects, and viewing failures as learning data.",
      bibleVerses: ["#FocusFlow - Use quiet study intervals", "#EffortCheck - Celebrate work courage over perfect scores"],
      strategies: [
        "The Isolated Study Desk: Establish a study interval strategy (e.g., 25-minute quiet sessions) with zero screens in the vicinity.",
        "Growth Mindset Reframing: Transform errors from visual failures to data points, discussing exactly how to adjust for the next round.",
        "Visual Habits Dashboards: Use physical whiteboard calendars to let teens track their daily milestones in satisfying, colorful ways."
      ]
    },
    {
      id: "physical",
      name: "Circadian Health & Rhythm",
      icon: "🌱",
      color: "#0891b2",
      bgColor: "#ecfeff",
      borderColor: "#0891b2",
      challenges: "Vast sleep deficits from midnight scrolling under blankets, low movement, and muscle/posture fatigue.",
      milestones: "Achieving 8 continuous hours of restorative sleep, physical active play, and healthy daily hydration.",
      bibleVerses: ["#CircadianReset - Protect melatonin levels", "#OfflineGrounding - Balance biological stress"],
      strategies: [
        "Communal Nightly Docking: Place a beautiful charging station in the common room where all phones sleep after 10:00 PM.",
        "Active Cortisol Releases: Encourage continuous active outdoor workouts, surfing, hiking, or dance to discharge screen fatigue.",
        "Stable Neuro-chemistry: Swap sugary drinks with refreshing hydration to avoid insulin crashes and secure focus."
      ]
    }
  ];

  // Chat Tool
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const defaultCountry = localStorage.getItem("selected_country") || "Ghana";
    const counselor = getLocalCounselorInfo(defaultCountry);
    return [
      {
        id: "welcome",
        role: "model",
        content: `${counselor.greeting} I am **${counselor.male}**, your dedicated mentor and adolescent wellness guide for **Teening**. Under the **${counselor.val} context**, we specialize in co-creating healthy boundaries, resolving sleep-debt challenges, and managing digital fatigue using modern supportive counseling keys. Tell me: what behavior, question, or screen habit are we navigating today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });
  const [chatInput, setChatInput] = useState<string>("");
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState<boolean>(false);
  const [audioPlayId, setAudioPlayId] = useState<string | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Forum Tool
  const [forumPosts, setForumPosts] = useState<ForumPost[]>(PRE_POPULATED_POSTS);
  const [forumFilter, setForumFilter] = useState<string>("All");
  const [newPostTitle, setNewPostTitle] = useState<string>("");
  const [newPostContent, setNewPostContent] = useState<string>("");
  const [newPostCategory, setNewPostCategory] = useState<"Boarding School" | "Social Media" | "Discipline" | "Spiritual Growth">("Discipline");
  const [newPostRole, setNewPostRole] = useState<"Parent" | "Youth Guide" | "Teen Coach" | "Mentor" | "School Counselor">("Parent");
  const [newPostRegion, setNewPostRegion] = useState<string>("Accra, Greater Accra");
  const [showNewPostForm, setShowNewPostForm] = useState<boolean>(false);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [tempReplyText, setTempReplyText] = useState<{ [postId: string]: string }>({});

  // Daily Discipleship Checklists
  const [checklist, setChecklist] = useState([
    { id: "chk1", task: "Initiated morning routine vibe-check (analog focus)", completed: true, points: 15 },
    { id: "chk2", task: "Addressed teen friction with calm active listening", completed: false, points: 20 },
    { id: "chk3", task: "Offered supportive checks on peer group situations", completed: true, points: 10 },
    { id: "chk4", task: "Validated their healthy identity offline", completed: false, points: 15 },
    { id: "chk5", task: "Instituted high-quality digital screen-free curfews", completed: false, points: 20 },
  ]);

  const [activeGraceMultiplier, setActiveGraceMultiplier] = useState(1);

  // Ghanaian Local Context Sliders
  const CHALLENGE_OPTIONS = [
    "Social Media comparisons",
    "Boarding school adjustments",
    "Skipping analog quiet focus intervals",
    "Underperforming in school tests",
    "Stubbornness / Refusing house chores",
    "Secret peer group influences",
    "Cyber distractions (TikTok / Snapchat)",
    "Anxiety over future goals",
    "Fear of failure & Low self-worth"
  ];

  // Auto trigger default analysis on first load
  useEffect(() => {
    handleAnalyze(true);
  }, []);

  const toggleChecklist = (id: string) => {
    setChecklist(prev => 
      prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item)
    );
  };

  const handleAnalyze = async (isInitial = false) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    try {
      const response = await fetch("/api/analyze-pain-points", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age: isInitial ? 14 : assessmentAge,
          gender: isInitial ? "Boy" : assessmentGender,
          mainChallenges: isInitial ? ["Social Media comparisons", "Boarding school adjustments"] : selectedChallenges,
          observedBehaviors: isInitial ? "Tends to stay locked in the room, uses phone till midnight, feels a lot of boarding school anxiety." : customBehavior,
          mentorshipStyle,
          country: signupCountry
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAnalysisResult(data);
      } else {
        console.error("API error");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleChallenge = (challenge: string) => {
    setSelectedChallenges(prev =>
      prev.includes(challenge)
        ? prev.filter(c => c !== challenge)
        : [...prev, challenge]
    );
  };

  // Chat logic
  const sendChatMessage = async (textToSend?: string) => {
    const messageContent = textToSend || chatInput;
    if (!messageContent.trim()) return;

    const userMsg: ChatMessage = {
      id: "usr-" + Date.now(),
      role: "user",
      content: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setChatLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...chatMessages, userMsg].map(m => ({ role: m.role, content: m.content })),
          country: signupCountry
        })
      });

      if (response.ok) {
        const data = await response.json();
        const modelReply: ChatMessage = {
          id: "bot-" + Date.now(),
          role: "model",
          content: data.result || "I apologize, it seems we encountered a brief connection glitch. Let's retry.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sources: data.sources || []
        };
        setChatMessages(prev => [...prev, modelReply]);
      } else {
        throw new Error("Chat network error");
      }
    } catch (e) {
      console.error(e);
      // Fallback response inside UI
      const errorMsg: ChatMessage = {
        id: "bot-err-" + Date.now(),
        role: "model",
        content: "We encountered a temporary connection interruption. Let's try that again. We will load our offline guidance engine to give you supportive tips.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, errorMsg]);
    } finally {
      setChatLoading(false);
    }
  };

  // Helper for native browser speech synthesis fallback
  const playBrowserSpeechSynthesis = (txt: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(txt);
      const voices = window.speechSynthesis.getVoices();
      
      // Look for custom regional or warm voices
      const preferredVoice = voices.find(v => 
        v.lang.startsWith("en-GB") || 
        v.lang.startsWith("en-NG") || 
        v.lang.startsWith("en-ZA") || 
        v.name.includes("Maternal") ||
        v.name.includes("Google UK English") ||
        v.name.includes("Samantha")
      ) || voices[0];
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      utterance.rate = 0.95; // Warm, steady pace
      
      utterance.onend = () => {
        setAudioPlayId(null);
      };
      
      utterance.onerror = (e) => {
        console.warn("SpeechSynthesis error:", e);
        setAudioError("Speech play interrupt.");
        setAudioPlayId(null);
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      setAudioError("TTS is unconfigured or unsupported on this browser.");
      setAudioPlayId(null);
    }
  };

  // Text-To-Speech (Voice Counsel Playback) with robust error resilience
  const speekText = async (messageId: string, text: string) => {
    if (audioPlayId === messageId) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setAudioPlayId(null);
      return;
    }

    setAudioPlayId(messageId);
    setAudioError(null);

    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    const cleanedText = text.replace(/[*#_]/g, "").substring(0, 300);

    try {
      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: cleanedText })
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.audio) {
          const mime = data.mimeType || "audio/wav";
          const audioUrl = `data:${mime};base64,${data.audio}`;
          
          if (!audioRef.current) {
            audioRef.current = new Audio();
          }
          
          audioRef.current.onended = () => {
            setAudioPlayId(null);
          };
          
          audioRef.current.onerror = () => {
            console.warn("Audio element failed to load/decode, using native voice synthesis fallback...");
            playBrowserSpeechSynthesis(cleanedText);
          };

          audioRef.current.src = audioUrl;
          
          try {
            await audioRef.current.play();
          } catch (playErr) {
            console.warn("Autoplay or play promise blocked, falling back to speech synthesis...", playErr);
            playBrowserSpeechSynthesis(cleanedText);
          }
        } else {
          playBrowserSpeechSynthesis(cleanedText);
        }
      } else {
        playBrowserSpeechSynthesis(cleanedText);
      }
    } catch (e) {
      console.warn("Encountered fetching/streaming error, playing regional client fallback...", e);
      playBrowserSpeechSynthesis(cleanedText);
    }
  };

  // Simulating custom mic speech inputs
  const startVoiceCapture = () => {
    setIsVoiceRecording(true);
    // Auto fill a simulated common teenage parenting question in 2 seconds
    const simulatedPrompts = [
      "Our 15yo son skips church and states God is fake. How can we re-attract him with love?",
      "How to set boarding school guidelines and ensure Bible study when I am and away?",
      "Teaching my daughter self-worth and Twi respects in this digital social era.",
    ];
    setTimeout(() => {
      const selected = simulatedPrompts[Math.floor(Math.random() * simulatedPrompts.length)];
      setChatInput(selected);
      setIsVoiceRecording(false);
    }, 2500);
  };

  // Forum logic
  const handleLikePost = (id: string) => {
    setForumPosts(prev =>
      prev.map(p => {
        if (p.id === id) {
          return {
            ...p,
            likes: p.hasLiked ? p.likes - 1 : p.likes + 1,
            hasLiked: !p.hasLiked
          };
        }
        return p;
      })
    );
  };

  const submitNewForumPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    // Grab a random relevant verse based on category
    const categoryVerses: Record<string, string[]> = {
      "Boarding School": ["Joshua 1:9", "Proverbs 4:20"],
      "Social Media": ["Proverbs 4:23", "Romans 12:2"],
      "Discipline": ["Proverbs 29:17", "Hebrews 12:11"],
      "Spiritual Growth": ["1 Timothy 4:12", "Galatians 5:22"]
    };
    const defaultVerses = categoryVerses[newPostCategory] || ["Proverbs 22:6"];

    const newPost: ForumPost = {
      id: "post-" + Date.now(),
      title: newPostTitle,
      author: "Co-Mentor " + (forumPosts.length + 1),
      role: newPostRole,
      region: newPostRegion,
      content: newPostContent,
      verses: defaultVerses,
      likes: 1,
      hasLiked: true,
      timestamp: "Just now",
      category: newPostCategory,
      replies: []
    };

    setForumPosts(prev => [newPost, ...prev]);
    setNewPostTitle("");
    setNewPostContent("");
    setShowNewPostForm(false);
  };

  const handlePostReply = (postId: string) => {
    const text = tempReplyText[postId];
    if (!text || !text.trim()) return;

    setForumPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            replies: [
              ...p.replies,
              {
                id: "rep-" + Date.now(),
                author: "Mentor Volunteer",
                role: "Support Council",
                content: text,
                timestamp: "Just now",
                likes: 0
              }
            ]
          };
        }
        return p;
      })
    );

    setTempReplyText(prev => ({ ...prev, [postId]: "" }));
  };

  const filteredPosts = forumFilter === "All" 
    ? forumPosts 
    : forumPosts.filter(p => p.category === forumFilter);

  // Stats calculate
  const totalCheklistScore = checklist.reduce((acc, curr) => acc + (curr.completed ? curr.points : 0), 0);

  return (
    <div id="main-bento-container" className="min-h-screen bg-[#FDFBF7] flex font-sans text-slate-800 leading-relaxed relative max-w-full overflow-x-hidden">
      {/* Onboarding location & role sign up process overlay */}
      {!hasCompletedSignup && (
        <div id="signup-overlay" className="fixed inset-0 bg-emerald-950/80 backdrop-blur-md flex items-center justify-center p-4 z-[9999] animate-fade-in">
          <div id="signup-card" className="bg-white max-w-lg w-full rounded-3xl p-6 md:p-8 border border-neutral-100 shadow-2xl flex flex-col gap-5 relative animate-scale-up">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-gradient-to-tr from-emerald-600 to-cyan-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto shadow-md">
                ✨
              </div>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-none">
                Teening Onboarding Setup
              </h3>
              <p className="text-xs text-emerald-800 font-extrabold uppercase tracking-wider">
                Select Your Regional Location & Coach Role
              </p>
              <p className="text-[11px] md:text-xs text-slate-500 leading-relaxed">
                Welcome! Our interactive advisor tailors evidence-based youth terminology, diagnostic checklists, and active mentor guide identities (like Dr. Kwame Boakye or Dr. Stephen Reynolds) to your selected country.
              </p>
            </div>

            <div className="space-y-3">
              {/* Name Input */}
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Your Title or Preferred Name:</label>
                <input
                  type="text"
                  placeholder="e.g., Coach Elena, Dr. Julian, Parent Jordan"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold focus:ring-1 focus:outline-none focus:ring-emerald-700 focus:bg-white"
                />
              </div>

              {/* Role select */}
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Your Guidance Role:</label>
                <select
                  value={signupRole}
                  onChange={(e) => setSignupRole(e.target.value)}
                  className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-700 font-sans"
                >
                  <option value="Parent">👦 Dedicated Parent / Guardian</option>
                  <option value="Youth Guide">🧠 Youth Guide / Teen Counselor</option>
                  <option value="Teen Coach">🎒 Teen Development Coach</option>
                  <option value="Mentor">👥 Local Mentor / Mentor Specialist</option>
                </select>
              </div>

              {/* Country Select processes location context worldwide */}
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" /> Choose Country Slot:
                </label>
                <select
                  value={signupCountry}
                  onChange={(e) => setSignupCountry(e.target.value)}
                  className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-700 font-sans"
                >
                  <option value="Ghana">🇬🇭 Ghana (Custom local context/Ghana JHS & SHS support)</option>
                  <option value="Nigeria">🇳🇬 Nigeria (West African scholastic and lifestyle advisor)</option>
                  <option value="Kenya">🇰🇪 Kenya (East African youth setting advisor)</option>
                  <option value="South Africa">🇿🇦 South Africa (Sipho & Thandeka youth coach guides)</option>
                  <option value="UK">🇬🇧 United Kingdom (British secondary school & focus settings)</option>
                  <option value="USA">🇺🇸 United States (High school wellness tracking & guidance)</option>
                  <option value="Global">🌐 Global Worldwide (Multi-cultural scientific adolescent support)</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!signupName.trim()) {
                  alert("Please enter your name or title to proceed.");
                  return;
                }
                localStorage.setItem("selected_country", signupCountry);
                localStorage.setItem("selected_role", signupRole);
                localStorage.setItem("selected_name", signupName);
                localStorage.setItem("has_signed_up", "true");
                setHasCompletedSignup(true);
                handleAnalyze(true);

                // Update Counselor identity welcome message dynamically in front-end Chat component
                const counselor = getLocalCounselorInfo(signupCountry);
                setChatMessages([
                  {
                    id: "welcome",
                    role: "model",
                    content: `${counselor.greeting} I am **${counselor.male}**, your dedicated mentor and adolescent wellness guide for **Teening**. Having initialized the **${counselor.val} context**, our interactive chat is completely aligned with your local school formats, focus habits, and societal settings. Tell me: what challenges, behavior, or screen habits are we navigating today?`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  }
                ]);
              }}
              className="w-full py-3 bg-emerald-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow hover:bg-emerald-800 active:scale-95 transition-all text-center flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              Confirm Context & Open Teening
            </button>
          </div>
        </div>
      )}

      {/* 1. DESKTOP SIDEBAR PANEL (Floating/Collapsible Style) */}
      <aside 
        className={`hidden lg:flex flex-col bg-emerald-950 text-white border-r border-emerald-900 shrink-0 h-screen sticky top-0 transition-all duration-300 relative z-30 ${
          isSidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Sidebar Header branding */}
        <div className="p-6 flex items-center gap-3 border-b border-emerald-900/30">
          <div className="w-10 h-10 bg-gradient-to-tr from-emerald-500 to-cyan-400 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md shrink-0">
            ✨
          </div>
          {!isSidebarCollapsed && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              className="overflow-hidden whitespace-nowrap"
            >
              <h1 className="text-base font-black text-amber-300 tracking-tight leading-none">
                Teening
              </h1>
              <p className="text-[9px] text-emerald-300 uppercase tracking-widest font-extrabold mt-0.5">
                Teen Balance Coach
              </p>
            </motion.div>
          )}
        </div>

        {/* Tab Selection buttons */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          {[
            { id: "dashboard", label: "Stressor Dashboard", icon: Brain, desc: "Diagnostic & developmental wheel" },
            { id: "chat", label: "Counsel Chat (Voice)", icon: MessageSquare, desc: "Direct dialogue with elder mentors" },
            { id: "forum", label: "Support Forum", icon: Users, desc: "Parenting fellowship roundtables" },
            { id: "resources", label: "Expert Guidelines", icon: BookOpen, desc: "Playbook guides & templates" }
          ].map((item) => {
            const isActive = activeTab === item.id;
            const IconComponent = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3.5 p-3 rounded-2xl transition-all relative group cursor-pointer text-left ${
                  isActive 
                    ? "bg-emerald-800 text-amber-200 shadow" 
                    : "text-emerald-100/80 hover:bg-emerald-900 hover:text-white"
                }`}
                title={isSidebarCollapsed ? item.label : undefined}
              >
                <IconComponent className="w-5 h-5 shrink-0" />
                
                {!isSidebarCollapsed && (
                  <div className="overflow-hidden whitespace-nowrap">
                    <p className="text-xs font-extrabold leading-none">{item.label}</p>
                    <p className="text-[10px] text-emerald-300/60 font-medium mt-1 truncate">
                      {item.desc}
                    </p>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Active Context settings box inside sidebar footer */}
        <div className="p-4 border-t border-emerald-900/30">
          {!isSidebarCollapsed ? (
            <div className="bg-emerald-900/40 p-3 rounded-2xl border border-emerald-900/30 text-xs space-y-1">
              <span className="text-[9px] uppercase tracking-wider font-extrabold text-amber-400 block">
                Active Context
              </span>
              <div className="flex items-center justify-between gap-1">
                <div className="min-w-0">
                  <p className="font-extrabold text-emerald-100 flex items-center gap-1 text-[11px] truncate">
                    <span>📍</span> {signupCountry === "UK" ? "UK" : signupCountry === "USA" ? "USA" : signupCountry}
                  </p>
                  <p className="text-[9px] text-emerald-300 truncate font-semibold">{signupRole}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setHasCompletedSignup(false)}
                  className="text-[10px] font-black text-amber-300 underline shrink-0 hover:text-amber-200 transition-colors"
                >
                  Change
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setHasCompletedSignup(false)}
              className="w-10 h-10 mx-auto bg-emerald-900/40 rounded-xl flex items-center justify-center border border-emerald-900/30 hover:bg-emerald-800 text-amber-300 transition-colors"
              title="Change Country Context Setup"
            >
              📍
            </button>
          )}
        </div>

        {/* Collapse Toggle button floating on border */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-3 top-24 w-6 h-6 rounded-full bg-emerald-800 border-2 border-emerald-950 text-amber-200 flex items-center justify-center hover:bg-emerald-700 transition-colors shadow-md z-40 cursor-pointer"
          title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isSidebarCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>

      {/* 2. MOBILE DRAWER SLIDE-OUT OVERLAY AND SIDEBAR */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop element */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-emerald-950/50 backdrop-blur-sm z-50 lg:hidden"
            />

            {/* Slide-out Sidebar bar container */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed top-0 bottom-0 left-0 w-72 bg-emerald-950 text-white z-50 p-6 flex flex-col justify-between shadow-2xl lg:hidden"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-emerald-900/40">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-gradient-to-tr from-emerald-500 to-cyan-400 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                      ✨
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-white leading-none">Teening</h4>
                      <p className="text-[9px] text-emerald-300 uppercase tracking-widest font-black mt-1">Teen Balance Coach</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-8 h-8 rounded-lg bg-emerald-905/60 hover:bg-emerald-800 flex items-center justify-center text-amber-350 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Mobile Navigation List */}
                <nav className="space-y-2">
                  {[
                    { id: "dashboard", label: "Stressor Dashboard", icon: Brain, desc: "Diagnostic profile & wheel" },
                    { id: "chat", label: "Counsel Chat (Voice)", icon: MessageSquare, desc: "Interact with senior elders" },
                    { id: "forum", label: "Support Forum", icon: Users, desc: "Mutual parenting advice" },
                    { id: "resources", label: "Expert Guidelines", icon: BookOpen, desc: "Playbooks & academy templates" }
                  ].map((item) => {
                    const isActive = activeTab === item.id;
                    const IconComponent = item.icon;

                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id as any);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3.5 p-3.5 rounded-2xl text-left transition select-none cursor-pointer ${
                          isActive 
                            ? "bg-emerald-800 text-amber-200 shadow" 
                            : "text-emerald-100 hover:bg-emerald-900/50"
                        }`}
                      >
                        <IconComponent className="w-5 h-5 shrink-0" />
                        <div>
                          <p className="text-xs font-extrabold leading-tight">{item.label}</p>
                          <p className="text-[10px] text-emerald-300/60 font-semibold mt-0.5">{item.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Mobile Sidebar Footer Info Context */}
              <div className="bg-emerald-900/40 p-4 rounded-2xl border border-emerald-900/30 text-xs">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-amber-400 block mb-1">
                  Active Context
                </span>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-extrabold text-emerald-105">
                      📍 {signupCountry === "UK" ? "UK" : signupCountry === "USA" ? "USA" : signupCountry}
                    </p>
                    <p className="text-[10px] text-emerald-300 font-medium">{signupRole}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setHasCompletedSignup(false);
                    }}
                    className="text-[10px] font-black text-amber-300 underline cursor-pointer"
                  >
                    Change
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* 3. CORE RIGHT-HAND LAYOUT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 max-w-full">
        {/* APP CORE TOP HEADER BAR */}
        <header id="app-header" className="h-20 bg-white border-b border-rose-100/30 lg:border-slate-100 shrink-0 flex items-center justify-between px-4 md:px-8 z-20 sticky top-0 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Hamburger button visible only on mobile/tablet */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 transition active:scale-95 cursor-pointer"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Mobile branding only (hidden on desktop) */}
            <div className="flex items-center gap-2 lg:hidden">
              <div className="w-8 h-8 bg-gradient-to-tr from-emerald-500 to-cyan-400 id-app-logo-mobile rounded-lg flex items-center justify-center text-white font-bold text-base">
                ✨
              </div>
              <div>
                <h1 className="text-xs font-black text-slate-900 leading-none">Teening</h1>
                <p className="text-[9px] uppercase tracking-wider text-emerald-800 font-extrabold leading-none mt-1">Teen Balance Coach</p>
              </div>
            </div>

            {/* Active section title shown on Desktop */}
            <div className="hidden lg:block">
              <span className="text-[10px] text-emerald-800 font-extrabold uppercase tracking-wider block">
                Teening Guidance Center
              </span>
              <h2 className="text-lg font-black text-[#111827] leading-none capitalize mt-1">
                {activeTab === "dashboard" && "Screen Time & Focus Analyst"}
                {activeTab === "chat" && "AI Counsel Chat & Grounded Search Room"}
                {activeTab === "forum" && "Parenting Support Roundtable"}
                {activeTab === "resources" && "Coaching Handbooks & Expert Guides"}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Grace progress widget */}
            <div className="flex items-center gap-2 text-right">
              <div className="hidden md:block">
                <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Teening Effort</span>
              </div>
              <span className="text-xs font-black text-emerald-850 bg-emerald-50 px-3 py-1.5 rounded-2xl border border-emerald-100/50 whitespace-nowrap shadow-sm">
                ⭐ {totalCheklistScore} Vibe Points
              </span>
            </div>

            {/* Regional switches badge */}
            <button
              onClick={() => setHasCompletedSignup(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-[10px] md:text-xs font-bold text-amber-900 transition-all cursor-pointer shadow-sm shrink-0"
              title="Change Country Setup"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span className="hidden sm:inline">📍 {signupCountry === "UK" ? "UK" : signupCountry === "USA" ? "USA" : signupCountry} ({signupRole})</span>
              <span className="sm:hidden">📍 {signupCountry === "UK" ? "UK" : signupCountry === "USA" ? "USA" : signupCountry}</span>
              <span className="text-[9px] underline text-amber-800 font-medium whitespace-nowrap ml-1">Change</span>
            </button>
          </div>
        </header>

        {/* 4. MAIN SCROLLABLE TABS CONTENT AREA WITH TRANSITIONS */}
        <main id="tab-content" className="flex-1 w-full max-w-full overflow-x-hidden p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="space-y-8 max-w-7xl mx-auto"
            >

        {/* ==================== 1. DASHBOARD VIEW (BENTO STYLE) ==================== */}
        {activeTab === "dashboard" && (
          <div id="bento-dashboard-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Core Box 1: AI Teen Stress & Pain-point Generator Inputs (span-4) */}
            <section id="bento-generator-control" className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-emerald-50 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider border border-emerald-100 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Developmental Profiler
                </span>
                <span className="text-amber-600 text-[10px] uppercase font-bold tracking-widest bg-amber-50 px-2 py-0.5 rounded">Ghana Context</span>
              </div>
              
              <h2 className="text-xl font-bold text-slate-900 mb-4 leading-tight">
                Profile Your Teenager for Diagnostic Wisdom
              </h2>

              <div className="space-y-4">
                {/* Age slider */}
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">
                    Teenager Age: <span className="text-emerald-700 text-sm font-extrabold">{assessmentAge} yrs</span>
                  </label>
                  <input 
                    type="range" 
                    min={10} 
                    max={19} 
                    value={assessmentAge} 
                    onChange={(e) => setAssessmentAge(parseInt(e.target.value))}
                    className="w-full accent-emerald-700 h-2 bg-slate-100 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>Pre-Teen (10)</span>
                    <span>SHS Peak (15)</span>
                    <span>Young Adult (19)</span>
                  </div>
                </div>

                {/* Gender Select */}
                <div>
                  <span className="text-xs font-bold text-slate-500 block mb-1">Gender / Spiritual Role:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setAssessmentGender("Boy")}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                        assessmentGender === "Boy"
                          ? "bg-emerald-50 border-emerald-700 text-emerald-800"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      👦 Boy (Future "Barima")
                    </button>
                    <button
                      type="button"
                      onClick={() => setAssessmentGender("Girl")}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                        assessmentGender === "Girl"
                          ? "bg-emerald-50 border-emerald-700 text-emerald-800"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      👧 Girl (Future "Obaasima")
                    </button>
                  </div>
                </div>

                {/* Challenges Multi-Select */}
                <div>
                  <span className="text-xs font-bold text-slate-500 block mb-1.5">Observed Root Pressures:</span>
                  <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-1.5 border border-slate-100 rounded-xl bg-slate-50">
                    {CHALLENGE_OPTIONS.map((opt) => {
                      const selected = selectedChallenges.includes(opt);
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => toggleChallenge(opt)}
                          className={`text-[10px] py-1 px-2.5 rounded-full font-semibold transition-all ${
                            selected
                              ? "bg-emerald-700 text-white"
                              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {selected ? "✓  " : ""}{opt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom descriptions */}
                <div>
                  <span className="text-xs font-bold text-slate-500 block mb-1">Observed Behaviors & Attitudes:</span>
                  <textarea
                    rows={2}
                    placeholder="e.g., Slams door during Sunday service prep, locks self with phone, very stubborn about choir practice..."
                    value={customBehavior}
                    onChange={(e) => setCustomBehavior(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs bg-slate-50 focus:ring-1 focus:outline-none focus:ring-emerald-700 focus:bg-white"
                  />
                </div>

                {/* Mentorship Style selection */}
                <div>
                  <span className="text-xs font-bold text-slate-500 block mb-1">Your Discipleship Style:</span>
                  <select
                    value={mentorshipStyle}
                    onChange={(e) => setMentorshipStyle(e.target.value)}
                    className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-700"
                  >
                    <option value="encouraging">Encouraging & Grace-Centered</option>
                    <option value="firm correction">Firm but Calm (Biblical Boundary)</option>
                    <option value="storytelling & proverbs">Wise Ghanaian Proverbial / Storytelling</option>
                    <option value="compassionate listening">Active Compassionate Listening First</option>
                  </select>
                </div>

                {/* Action generate button */}
                <button
                  type="button"
                  onClick={() => handleAnalyze(false)}
                  disabled={isAnalyzing}
                  className="w-full py-3 bg-emerald-700 text-white rounded-xl font-bold text-sm tracking-wide shadow hover:bg-emerald-800 active:scale-95 transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Running Diagnostic Protocol...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4" />
                      Generate Balance Insights
                    </>
                  )}
                </button>
              </div>
            </section>

            {/* Core Box 2: Analysis Results Output (span-5) */}
            <section id="bento-analysis-results" className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm min-h-[500px] flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 mb-4 gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-emerald-900 leading-tight">
                      Divine Stress & Growth Diagnosis
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Tailored results for a <span className="font-extrabold text-amber-700">{assessmentAge}-year-old {assessmentGender}</span> setting
                    </p>
                  </div>

                  {/* Micro tabs for dynamic analysis parts */}
                  <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button
                      onClick={() => setActiveAnalysisTab("insights")}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                        activeAnalysisTab === "insights" ? "bg-white text-emerald-950 shadow-sm" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      📖 Pain Points
                    </button>
                    <button
                      onClick={() => setActiveAnalysisTab("proactive")}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                        activeAnalysisTab === "proactive" ? "bg-white text-emerald-950 shadow-sm" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      🛡️ Preventives
                    </button>
                    <button
                      onClick={() => setActiveAnalysisTab("management")}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                        activeAnalysisTab === "management" ? "bg-white text-emerald-950 shadow-sm" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      🗝️ Responses
                    </button>
                  </div>
                </div>

                {isAnalyzing ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="relative mb-4">
                      <div className="w-12 h-12 rounded-full border-4 border-emerald-100 border-t-emerald-700 animate-spin" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-700 text-xs font-bold">✓</div>
                    </div>
                    <p className="text-sm font-semibold text-slate-700 animate-pulse">
                      Analyzing teenage developmental milestones with diagnostic counseling protocols...
                    </p>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm">
                      Combining global pedagogical frameworks with local pediatric counseling expertise.
                    </p>
                  </div>
                ) : analysisResult ? (
                  <div className="flex-1 space-y-4">
                    {/* Offline mode grace banner */}
                    {analysisResult.isFallbackMode && (
                      <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs animate-fade-in">
                        <span className="text-base select-none mt-0.5">💡</span>
                        <div>
                          <p className="font-extrabold text-[11px] uppercase tracking-wider text-amber-800">Local Offline Guided Wisdom Active</p>
                          <p className="text-amber-800/80 mt-1 leading-normal font-medium">
                            Due to high-traffic periods, your customized evaluation is loaded via local adolescent therapy templates. Complete with high-quality clinical diagnostic insights.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Dev Milestone stage banner */}
                    <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-800 mb-1 flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-emerald-700" />
                        Developmental Stage Insight
                      </h4>
                      <p className="text-xs text-slate-700 italic">
                        "{analysisResult.developmentalStage}"
                      </p>
                    </div>

                    {/* Active Output Section */}
                    {activeAnalysisTab === "insights" && (
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Identified Root Developmental Stressors:</h4>
                        <div id="painpoints-list" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {analysisResult.painPoints?.map((p, idx) => (
                            <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-4 relative hover:shadow-md transition-shadow">
                              <span className="absolute top-3 right-3 text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-700">
                                {p.category}
                              </span>
                              <h5 className="font-bold text-slate-900 text-sm mb-1 mr-14">
                                {p.title}
                              </h5>
                              <p className="text-xs text-slate-600 mb-2 leading-relaxed">
                                {p.description}
                              </p>
                              
                              <div className="bg-rose-50/70 border border-rose-100 rounded-xl p-2.5">
                                <span className="text-[10px] font-extrabold text-rose-800 block mb-0.5">Biological or Social Origin:</span>
                                <p className="text-[11px] text-rose-700 italic mb-1.5">
                                  {p.biblicalRoot}
                                </p>
                                <span className="text-[10px] font-bold text-emerald-800 block">Action Hacks & Cognitive Anchors:</span>
                                <div className="space-y-1 mt-1">
                                  {p.bibleVerses?.map((v, sIdx) => (
                                    <div key={sIdx} className="text-[11px] text-emerald-900 font-medium">
                                      ✨ {v}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeAnalysisTab === "proactive" && (
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Proactive Prevention Strategies:</h4>
                        <div className="space-y-3">
                          {analysisResult.proactivePrevention?.map((p, idx) => (
                            <div key={idx} className="bg-emerald-50/30 border border-emerald-100/80 rounded-2xl p-4 flex flex-col md:flex-row md:items-start gap-4">
                              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0 font-bold text-xs shadow-sm">
                                {idx + 1}
                              </div>
                              <div className="flex-1">
                                <h5 className="font-bold text-slate-900 text-sm mb-1">{p.title}</h5>
                                <p className="text-xs text-slate-600 mb-2 leading-relaxed">
                                  <strong className="text-slate-800">Action Plan: </strong> 
                                  {p.actionPlan}
                                </p>
                                <div className="bg-amber-50/60 border border-amber-100 p-2.5 rounded-xl text-xs text-amber-900 flex items-start gap-1.5">
                                  <span className="text-sm">🇬🇭</span>
                                  <div>
                                    <strong className="font-extrabold text-amber-800 block text-[10px] uppercase">Ghana Context Tip:</strong>
                                    {p.ghanaianContextNote}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeAnalysisTab === "management" && (
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Restorative Response Scripts for Conflict Triggers:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {analysisResult.managementStrategies?.map((s, idx) => (
                            <div key={idx} className="bg-amber-50/20 border border-amber-100/50 rounded-2xl p-4 flex flex-col justify-between">
                              <div>
                                <div className="flex items-start gap-1.5 mb-2">
                                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                  <span className="text-xs font-extrabold text-slate-700 block">
                                    Trigger Scenario:
                                  </span>
                                </div>
                                <p className="text-xs text-slate-600 italic bg-white p-2.5 rounded-xl border border-slate-100 mb-3">
                                  "{s.situation}"
                                </p>

                                <span className="text-[10px] font-extrabold text-emerald-950 uppercase tracking-wide block mb-1">
                                  Recommended Mentor Script (Speak Calmly):
                                </span>
                                <p className="text-xs font-medium text-emerald-900 bg-emerald-50/30 p-2.5 rounded-xl border border-emerald-100 leading-relaxed italic">
                                  {s.mentorResponse}
                                </p>
                              </div>

                              <div className="border-t border-slate-100 pt-2.5 mt-3 flex items-center justify-between">
                                <span className="text-[10px] text-slate-400 uppercase font-bold">Key Virtue</span>
                                <span className="bg-emerald-900 text-white rounded-full px-2.5 py-0.5 text-[9px] font-bold">
                                  {s.keyPrinciple}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-20 text-center text-slate-400">
                    <p>No diagnosis loaded yet. Adjust parameters on the left and tap "Generate Discipleship Guide".</p>
                  </div>
                )}
              </div>

              {/* Bottom actionable: Auto launch chat regarding these pain points */}
              {analysisResult && (
                <div className="border-t border-slate-100 pt-4 mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <p className="text-[11px] text-slate-500 max-w-md">
                    Need deep advice or an actual coaching script for these points? Chat instantly with Uncle Kwame regarding this profile.
                  </p>
                  <button
                    onClick={() => {
                      const contextPrompt = `I just ran a stress diagnosis for a ${assessmentAge} year old ${assessmentGender}. They are facing ${selectedChallenges.join(", ")}. Can we analyze these further?`;
                      setActiveTab("chat");
                      sendChatMessage(contextPrompt);
                    }}
                    className="py-2 px-4 bg-emerald-900 text-white hover:bg-emerald-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shrink-0 transition"
                  >
                    <span>Discuss Profile in Chat</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </section>

            {/* Core Box 3: Daily Habits Grace Tracker (span-4) - Bento Row 2 */}
            <section id="bento-grace-tracker" className="lg:col-span-4 bg-[#FFFDF5] border border-amber-200 rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  Teening Habits
                </span>
                <span className="text-slate-400 text-[10px]">Earn points per habit</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 leading-tight mb-2">Daily Wellness Routines</h3>
              <p className="text-xs text-slate-600 mb-4 font-medium">
                Track how many times you co-designed healthy boundaries and applied active listening support.
              </p>

              <div className="space-y-3">
                {checklist.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleChecklist(item.id)}
                    className="w-full text-left p-3 rounded-2xl border transition bg-white hover:border-emerald-300 flex items-start gap-3 group"
                  >
                    <div className={`mt-0.5 shrink-0 w-4 h-4 rounded-full border flex items-center justify-center transition ${
                      item.completed 
                        ? "bg-emerald-700 border-emerald-700 text-white" 
                        : "border-slate-300 group-hover:border-emerald-500"
                    }`}>
                      {item.completed && <span className="text-[9px]">✔</span>}
                    </div>
                    <div className="flex-1">
                      <p className={`text-xs font-bold leading-tight ${item.completed ? "text-slate-500 line-through" : "text-slate-800"}`}>
                        {item.task}
                      </p>
                      <span className="text-[10px] font-bold text-amber-600 block mt-0.5">
                        +{item.points} Grace Points
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Progress visualizer bar */}
              <div className="mt-5 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-emerald-700 h-full transition-all duration-500"
                  style={{ width: `${(checklist.filter(c => c.completed).length / checklist.length) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1.5">
                <span>Completed: {checklist.filter(c => c.completed).length} / {checklist.length}</span>
                <span>🔥 Keep Streak Alive</span>
              </div>
            </section>

            {/* Core Box 4: Featured Scientific Quote (span-5) */}
            <section id="bento-quote-card" className="lg:col-span-5 bg-emerald-50/50 border border-emerald-100 rounded-3xl p-6 shadow-sm text-center flex flex-col justify-center items-center min-h-[220px]">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 mb-2">
                💡
              </div>
              <p className="font-sans font-medium text-slate-800 text-sm md:text-base leading-relaxed max-w-md">
                "Connection is the precursor to correction. When teenagers feel psychologically safe, boundaries shift from rules to mutual respect."
              </p>
              <h4 className="text-xs font-extrabold text-[#047857] uppercase tracking-widest mt-2">
                Adolescent Psychology Matrix
              </h4>
              <p className="text-[10px] text-slate-500 mt-1.5 max-w-xs">
                In peer contexts, training requires validating trust, consistent behavioral routines, and modeling active-listening habits.
              </p>
            </section>

            {/* Core Box 5: Masterclass Podcast audio block (span-3) */}
            <section id="bento-masterclass-voice" className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-sm flex flex-col justify-between min-h-[220px]">
              <div>
                <span className="bg-emerald-800 text-emerald-100 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest block w-max">
                  Voice Mini-Guide
                </span>
                <h4 className="text-base font-bold text-white mt-2 leading-tight">
                  Discipline with Wisdom & Active Listening
                </h4>
                <p className="text-[11px] text-slate-350 mt-1 leading-relaxed">
                  Listen to a maternal guidance audio sample explaining boundary negotiations and neuro-wellness.
                </p>
              </div>

              <div>
                {/* Audio Status */}
                {audioPlayId === "masterclass-sound" ? (
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                    <span className="text-[10px] text-amber-300 font-bold animate-pulse">Streaming Ghanaian Audio Advice...</span>
                  </div>
                ) : (
                  <span className="text-[10px] text-emerald-300 block mb-2.5">Duration: 2 mins • Female Voice</span>
                )}

                <button
                  onClick={() => speekText("masterclass-sound", "Hebrews 12:11 teaches that raw anger doesn't produce righteousness. In our Ghanaian homes, let us transition from raw anger to counseling. Speak calmly to your child. Correct them in private, then lift them up together in prayer. It creates lasting discipline instead of rebellion.")}
                  className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-emerald-950 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
                >
                  {audioPlayId === "masterclass-sound" ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      Pause Audio Guide
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Stream Expert Voice Code
                    </>
                  )}
                </button>
              </div>
            </section>

          </div>
        )}

        {/* ==================== 2. COUNSEL CHAT VIEW (TEXT & VOICE) ==================== */}
        {activeTab === "chat" && (
          <div id="chat-tab-container" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch min-h-[580px]">
            
            {/* Left Box: Prompts & Counsel Settings (span-4) */}
            <section className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-5 flex flex-col justify-between">
              <div>
                <span className="bg-emerald-50 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider block w-max mb-3">
                  Coaching Space Setup
                </span>
                <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1">Interactive AI Advisory</h3>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  Converse directly with **Dr. Kwame** or **Coach Efua** regarding screen balance, peer behavior, and modern adolescent wellness.
                </p>

                {/* Popular sample prompts to speed user interaction */}
                <span className="text-xs font-bold text-slate-400 block mb-2">Preset Counsel Topics (Tap to ask):</span>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setChatInput("My teenager spends 6 hours on Social Media per day. How do I guide them into a calm analog focus interval?");
                    }}
                    className="w-full text-left p-3 text-xs rounded-2xl border border-slate-100 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 transition font-medium"
                  >
                    📱 Screen-life balance & focus issues
                  </button>
                  <button
                    onClick={() => {
                      setChatInput("He lied about failing his boarding school chemistry mock exam. How do I address dishonesty calmly and construct a path forward?");
                    }}
                    className="w-full text-left p-3 text-xs rounded-2xl border border-slate-100 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 transition font-medium"
                  >
                    🛑 Addressing exam dishonesty / anxiety
                  </button>
                  <button
                    onClick={() => {
                      setChatInput("What screen-time boundaries can encourage focus and respectful digital hygiene at home?");
                    }}
                    className="w-full text-left p-3 text-xs rounded-2xl border border-slate-100 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 transition font-medium"
                  >
                    🌱 Habits for digital screen-hygiene
                  </button>
                </div>
              </div>

              {/* Status information on Speech TTS */}
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 mt-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base">🎙️</span>
                  <span className="text-xs font-bold text-emerald-950">Vocal Narration & Voice Assist</span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Any paragraph generated by our elder can be converted back to real speech audio! Look for the <Volume2 className="inline w-3.5 h-3.5 text-amber-600 mb-0.5" /> Speak button beneath messages to hear wisdom spoken out.
                </p>
              </div>
            </section>

            {/* Right Box: Chat Interface (span-8) */}
            <section className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col justify-between overflow-hidden">
              <div className="bg-emerald-900 text-white p-4 px-6 flex items-center justify-between border-b border-emerald-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white font-serif font-extrabold shadow-inner">
                    UK
                  </div>
                  <div>
                    <h4 className="font-bold text-sm leading-tight text-white flex items-center gap-1.5">
                      Uncle Kwame 
                      <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                    </h4>
                    <p className="text-[10px] text-emerald-200 font-semibold tracking-wide uppercase">
                      Senior Teens Discipleship Counselor • Ghana
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-emerald-800 text-amber-200 font-bold px-2 py-0.5 rounded border border-emerald-700">
                    KJV & ESV Anchored
                  </span>
                </div>
              </div>

              {/* Chat log body */}
              <div className="flex-1 p-6 space-y-4 overflow-y-auto max-h-[460px] bg-[#FAF9F5]">
                {chatMessages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}
                  >
                    {msg.role === "model" && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-cyan-500 font-bold text-xs shrink-0 flex items-center justify-center text-white font-mono shadow-sm">
                        ✨
                      </div>
                    )}
                    
                    <div className="space-y-1">
                      <div className={`p-4 rounded-3xl text-xs md:text-sm leading-relaxed ${
                        msg.role === "user" 
                          ? "bg-[#047857] text-white rounded-tr-none" 
                          : "bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-sm"
                      }`}>
                        {/* Format paragraph lines and bullet highlights */}
                        {msg.content.split("\n").map((line, i) => {
                          if (line.trim().startsWith("-") || line.trim().startsWith("*")) {
                            return <li key={i} className="ml-3 my-1 list-disc font-medium">{line.replace(/^[-*]\s*/, "")}</li>;
                          }
                          return <p key={i} className={i > 0 ? "mt-2 font-medium" : "font-medium"}>{line}</p>;
                        })}

                        {/* Grounded Web citations */}
                        {msg.role === "model" && msg.sources && msg.sources.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-left">
                            <span className="text-[10px] uppercase font-black text-emerald-800 tracking-wider flex items-center gap-1">
                              🔍 Grounded Web Search Clippings:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {msg.sources.map((src, sIdx) => (
                                <a
                                  key={sIdx}
                                  href={src.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 bg-emerald-50 hover:bg-emerald-150 text-emerald-800 text-[11px] px-2.5 py-1 rounded-xl font-bold border border-emerald-100 transition-all"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  <span>{src.title.length > 25 ? src.title.slice(0, 25) + "..." : src.title}</span>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Speaks buttons underneath bots replies */}
                      {msg.role === "model" && (
                        <div className="flex items-center gap-3 mt-1.5 px-1.5">
                          <button
                            onClick={() => speekText(msg.id, msg.content)}
                            className={`text-[11px] font-extrabold flex items-center gap-1 transition ${
                              audioPlayId === msg.id 
                                ? "text-amber-600 animate-pulse" 
                                : "text-slate-500 hover:text-emerald-700"
                            }`}
                          >
                            {audioPlayId === msg.id ? (
                              <>
                                <VolumeX className="w-3.5 h-3.5 text-rose-600" />
                                <span>[Tap to stop reading]</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3.5 h-3.5" />
                                <span>Read in Ghanaian Voice</span>
                              </>
                            )}
                          </button>
                          
                          <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                        </div>
                      )}

                      {msg.role === "user" && (
                        <span className="text-[10px] text-slate-400 block text-right">Sent at {msg.timestamp}</span>
                      )}
                    </div>
                  </div>
                ))}

                {chatLoading && (
                  <div className="flex gap-3 max-w-[80%]">
                    <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0 flex items-center justify-center border border-emerald-700 text-emerald-850 font-mono text-xs">
                      UK
                    </div>
                    <div className="bg-white border border-slate-200 p-4 rounded-3xl rounded-tl-none shadow-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                      <span className="text-xs text-slate-400">Seeking biblical wisdom counseling...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input row */}
              <div className="p-4 border-t border-slate-100 bg-white space-y-2">
                {audioError && (
                  <div className="text-[11px] text-rose-700 bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-xl">
                    ⚠️ {audioError}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {/* Simulate Microphone audio button */}
                  <button
                    onClick={startVoiceCapture}
                    title="Simulate Voice Input"
                    className={`p-3.5 rounded-full text-white transition-all active:scale-95 cursor-pointer ${
                      isVoiceRecording 
                        ? "bg-red-500 animate-pulse" 
                        : "bg-amber-500 hover:bg-amber-600 shadow"
                    }`}
                  >
                    {isVoiceRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>

                  <input
                    type="text"
                    disabled={chatLoading}
                    placeholder={isVoiceRecording ? "Listening to simulated speech audio..." : "Ask: 'How do I counsel a teen who slams doors when corrected?'..."}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") sendChatMessage();
                    }}
                    className="flex-1 border border-slate-200 bg-slate-50 rounded-full px-5 py-3 text-sm focus:ring-1 focus:outline-none focus:ring-emerald-700 focus:bg-white"
                  />

                  <button
                    onClick={() => sendChatMessage()}
                    disabled={chatLoading || !chatInput.trim()}
                    className="p-3.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-full transition cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between px-3">
                  <span className="text-[10px] text-slate-400">
                    Uncle Kwame speaks English & translates counseling points seamlessly.
                  </span>
                  {isVoiceRecording && (
                    <span className="text-[10px] text-rose-600 font-bold animate-pulse">
                      Synthesizing simulated voice counseling sample...
                    </span>
                  )}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ==================== 3. SUPPORT FORUM VIEW ==================== */}
        {activeTab === "forum" && (
          <div id="forum-tab" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Filters and Active statistics (span-4) */}
            <section className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
              <div>
                <span className="bg-emerald-50 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider block w-max mb-1.5 border border-emerald-100">
                  Secure Spiritual Forum
                </span>
                <h3 className="text-base font-bold text-slate-900 leading-tight">Ghana Mentorship Circles</h3>
                <p className="text-xs text-slate-500 leading-relaxed mt-1">
                  Connect with Sunday school teachers, boarding school patrons, and parents spanning Accra, Kumasi, Takoradi, and Tamale.
                </p>
              </div>

              {/* Submit Post trigger button */}
              <button
                onClick={() => setShowNewPostForm(!showNewPostForm)}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow transition cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                {showNewPostForm ? "Close Form Window" : "Submit Encourgement / Prayer Topic"}
              </button>

              {/* Forum category filters */}
              <div className="border-t border-slate-150 pt-3">
                <span className="text-xs font-bold text-slate-400 block mb-2 uppercase">Filter by Pressure/Area:</span>
                <div className="flex flex-col gap-1">
                  {["All", "Boarding School", "Social Media", "Discipline", "Spiritual Growth"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setForumFilter(cat)}
                      className={`w-full text-left py-2 px-3 rounded-xl text-xs font-bold transition ${
                        forumFilter === cat 
                          ? "bg-slate-100 text-emerald-950 pr-4 flex justify-between items-center" 
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span>📁 {cat === "All" ? "View All Mentoring Topics" : cat}</span>
                      {forumFilter === cat && <span className="text-[9px] text-emerald-700">● Active</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notice guidelines */}
              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
                <span className="text-xs font-bold text-amber-900 block mb-1">🤝 Code of Collaboration</span>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  We maintain strict privacy: do not share specific real teenager names or school identity. Support every mentor with empathy and constructive guidance!
                </p>
              </div>
            </section>

            {/* Right Column: Forum Active stream (span-8) */}
            <section className="lg:col-span-8 space-y-4">
              
              {/* Submission Form Component */}
              {showNewPostForm && (
                <form onSubmit={submitNewForumPost} className="bg-white border border-amber-100 rounded-3xl p-6 shadow-sm space-y-4">
                  <h4 className="font-extrabold text-sm text-emerald-950">Draft Mentor Strategy Post</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1">Main Challenge Category:</label>
                      <select
                        value={newPostCategory}
                        onChange={(e: any) => setNewPostCategory(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-xs font-medium rounded-xl p-2.5"
                      >
                        <option value="Boarding School">🏫 Boarding School Prep & Pressure</option>
                        <option value="Social Media">📱 Social Media & Cyber Influence</option>
                        <option value="Discipline">🛡️ Boundaries & Healthy Discipline</option>
                        <option value="Spiritual Growth">⭐ Deep Focus & Lifestyle Balance</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1">Your Mentorship Role:</label>
                      <select
                        value={newPostRole}
                        onChange={(e: any) => setNewPostRole(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-xs font-medium rounded-xl p-2.5"
                      >
                        <option value="Parent">Parent</option>
                        <option value="Youth Guide">Youth Guide / Teen Counselor</option>
                        <option value="Teen Coach">Teen Development Coach</option>
                        <option value="Mentor">Local Mentor</option>
                        <option value="School Counselor">School Counselor</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1">Your Location / Ghana Region:</label>
                      <input
                        type="text"
                        placeholder="e.g. Tema, Greater Accra"
                        value={newPostRegion}
                        onChange={(e) => setNewPostRegion(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1">Headline Title:</label>
                      <input
                        type="text"
                        placeholder="e.g. Setting dinner screen boundaries..."
                        value={newPostTitle}
                        onChange={(e) => setNewPostTitle(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Encouragement / Question details:</label>
                    <textarea
                      rows={4}
                      placeholder="Share what is working or ask for guidance... Be sure to point to biblical values!"
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowNewPostForm(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl"
                    >
                      Post to Stream
                    </button>
                  </div>
                </form>
              )}

              {/* Forum post items Stream */}
              <div className="space-y-4">
                {filteredPosts.map((post) => {
                  const isExpanded = expandedPostId === post.id;
                  return (
                    <div 
                      key={post.id} 
                      className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4 hover:border-slate-300 transition-all"
                    >
                      {/* Post Header */}
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-amber-100 text-amber-800 rounded-full font-bold text-xs flex items-center justify-center">
                            {post.author.substring(0,2)}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h4 className="font-extrabold text-sm text-slate-900">{post.author}</h4>
                              <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-100 font-extrabold px-2 py-0.5 rounded-full uppercase">
                                {post.role}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span>{post.region}</span>
                              <span>•</span>
                              <span>{post.timestamp}</span>
                            </div>
                          </div>
                        </div>

                        {/* Category badge */}
                        <span className="text-[9px] bg-slate-100 text-slate-600 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                          {post.category}
                        </span>
                      </div>

                      {/* Main Title and Body */}
                      <div>
                        <h4 className="font-extrabold text-base text-emerald-950 mb-1.5">
                          {post.title}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                          {post.content}
                        </p>
                      </div>

                      {/* Anchor verses */}
                      {post.verses?.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-bold text-emerald-800 uppercase">Advice Anchors:</span>
                          {post.verses.map((v, i) => (
                            <span key={i} className="text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-100/50">
                              ✨ {v}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* React / Reply triggers */}
                      <div className="flex items-center gap-4 pt-3 border-t border-slate-100 text-xs">
                        <button
                          onClick={() => handleLikePost(post.id)}
                          className={`flex items-center gap-1 font-extrabold ${
                            post.hasLiked ? "text-emerald-700" : "text-slate-500 hover:text-emerald-700"
                          }`}
                        >
                          <ThumbsUp className="w-4 h-4" />
                          <span>{post.likes} Upvotes</span>
                        </button>

                        <button
                          onClick={() => setExpandedPostId(isExpanded ? null : post.id)}
                          className="flex items-center gap-1 text-slate-500 hover:text-emerald-700 font-extrabold"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.replies?.length || 0} Professional Replies</span>
                        </button>
                      </div>

                      {/* Expanded Comments & Responses section */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 bg-[#FFFDF9] border border-amber-100 rounded-2xl p-4 space-y-4">
                              <h5 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Counselor Discussion Panel:</h5>
                              
                              {/* List */}
                              <div className="space-y-3">
                                {post.replies?.map((rep) => (
                                  <div key={rep.id} className="bg-white border border-slate-100 p-3 rounded-xl space-y-2">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <span className="font-extrabold text-xs text-slate-900">{rep.author}</span>
                                        <span className="text-[9px] text-emerald-800 uppercase font-bold bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full ml-2">
                                          {rep.role}
                                        </span>
                                      </div>
                                      <span className="text-[9px] text-slate-400">{rep.timestamp}</span>
                                    </div>
                                    <p className="text-xs text-slate-600 leading-relaxed italic">
                                      "{rep.content}"
                                    </p>
                                  </div>
                                ))}

                                {post.replies?.length === 0 && (
                                  <span className="text-xs text-slate-400 italic block">No advice posted yet. Share your experience below!</span>
                                )}
                              </div>

                              {/* Quick reply typing bar */}
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="Write your biblical or developmental counsel..."
                                  value={tempReplyText[post.id] || ""}
                                  onChange={(e) => setTempReplyText(prev => ({ ...prev, [post.id]: e.target.value }))}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") handlePostReply(post.id);
                                  }}
                                  className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:outline-none focus:ring-emerald-700"
                                />
                                <button
                                  onClick={() => handlePostReply(post.id)}
                                  className="px-3 py-2 bg-emerald-900 text-white hover:bg-emerald-950 font-bold text-xs rounded-xl"
                                >
                                  Reply
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                    </div>
                  );
                })}

                {filteredPosts.length === 0 && (
                  <div className="bg-white rounded-3xl p-12 text-center text-slate-400 text-xs">
                    No mentoring topics found for category "{forumFilter}". Select another category or add a new post!
                  </div>
                )}
              </div>
            </section>

          </div>
        )}

        {/* ==================== 4. PARENTING RESOURCES DIRECTORY ==================== */}
        {activeTab === "resources" && (
          <div id="resources-tab" className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="max-w-xl">
                <span className="bg-emerald-50 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider block w-max mb-2">
                  Evidence-Based Guidance Manuals
                </span>
                <h3 className="text-xl font-bold text-emerald-950 tracking-tight leading-none mb-2">Expert-Led Adolescent Wellness Handbook</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  These booklets utilize modern teen psychological milestones and tie them into school, focus, and lifestyle scenarios across the country. Play any section text in audio to hear wise counseling narrated out.
                </p>
              </div>
              <div className="flex bg-emerald-50 px-4 py-3 rounded-2xl border border-emerald-100 text-xs text-emerald-900 max-w-sm gap-2 shrink-0">
                <span className="text-base text-emerald-800">💡</span>
                <p className="leading-relaxed">
                  Recommended to read with teen health educators, school counselors, mentors, and family members during weekly balance check-ins.
                </p>
              </div>
            </div>

            {/* List layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {PARENTING_RESOURCES.map((r) => (
                <div key={r.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[9px] bg-amber-50 text-amber-800 border border-amber-100 px-2.5 py-1 rounded-full uppercase font-bold tracking-widest">
                        {r.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold">{r.duration}</span>
                    </div>

                    <h4 className="font-extrabold text-base text-slate-900 leading-snug">
                      {r.title}
                    </h4>
                    <p className="text-xs font-bold text-amber-700 mt-1 mb-3">{r.subtitle}</p>

                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 mb-4">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        Anchor Verses:
                      </span>
                      <p className="text-[11px] font-bold text-slate-700 italic">
                        📖 {r.bibleFocus}
                      </p>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                      {r.summary}
                    </p>

                    <h5 className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider mb-2">Pillars of Action:</h5>
                    <ul className="space-y-2 mb-6">
                      {r.points.map((pt, pIdx) => (
                        <li key={pIdx} className="text-xs text-slate-600 flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                          <span className="font-medium">{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Playable button to read resources aloud */}
                  <button
                    onClick={() => speekText(r.id, `${r.title}. ${r.summary}. Let me highlight the core action plans. First, ${r.points[0]}. Second, ${r.points[1]}. Lastly, ${r.points[2]}`)}
                    className="w-full py-2.5 bg-emerald-900 hover:bg-emerald-950 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow-sm"
                  >
                    {audioPlayId === r.id ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-rose-300" />
                        <span>Stop Voice Counsel</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Listen to Audio Version</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* ==================== STEP-BY-STEP INTERACTIVE TEENS DIGITAL GROUP ENGAGEMENT ACADEMY ==================== */}
            <div id="interactive-digital-group-planner" className="bg-[#FFFDF9] border border-amber-200 rounded-3xl p-5 md:p-8 shadow-sm space-y-8 mt-10">
              {/* Feature Header */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-amber-100 pb-5 gap-3">
                <div className="space-y-1">
                  <span className="bg-amber-100 text-amber-800 text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider inline-block border border-amber-200">
                    Mentoring Playbook Widget
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    📱 Digital Fellowship Planner
                  </h3>
                  <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
                    Setting up a WhatsApp or Telegram group is simple, but achieving **consistent, meaningful daily teen engagement** requires planning. Use this interactive workbook to design safe, lively, and spiritually edifying digital communities!
                  </p>
                </div>

                {/* Platform Toggler */}
                <div className="bg-amber-50 p-1.5 rounded-2xl border border-amber-100 flex items-center gap-1 self-start md:self-auto shrink-0 shadow-inner">
                  <button
                    type="button"
                    onClick={() => setGroupPlannerPlatform("whatsapp")}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      groupPlannerPlatform === "whatsapp"
                        ? "bg-emerald-700 text-white shadow-md"
                        : "text-slate-600 hover:bg-amber-100/50"
                    }`}
                  >
                    <span>💬</span> <span>WhatsApp Groups</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGroupPlannerPlatform("telegram")}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      groupPlannerPlatform === "telegram"
                        ? "bg-sky-600 text-white shadow-md"
                        : "text-slate-600 hover:bg-amber-100/50"
                    }`}
                  >
                    <span>✈️</span> <span>Telegram Channels</span>
                  </button>
                </div>
              </div>

              {/* Step Segment Indicators */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
                {[
                  { s: 1, label: "1. Sanctuary Setup", short: "Setup" },
                  { s: 2, label: "2. Golden Conduct", short: "Rules" },
                  { s: 3, label: "3. Monthly Rhythms", short: "Calendar" },
                  { s: 4, label: "4. Fun & Play", short: "Gamify" },
                  { s: 5, label: "5. Mitigate Silence", short: "Revival" }
                ].map((item) => {
                  const isActive = groupPlannerStep === item.s;
                  const isDone = groupPlannerStep > item.s;
                  return (
                    <button
                      key={item.s}
                      type="button"
                      onClick={() => setGroupPlannerStep(item.s)}
                      className={`text-left p-3 rounded-2xl border transition-all cursor-pointer relative ${
                        isActive 
                          ? "bg-slate-900 border-slate-900 text-white shadow-md scale-[1.02]" 
                          : isDone
                            ? "bg-emerald-50/50 border-emerald-100 text-slate-600 hover:bg-emerald-50"
                            : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] uppercase font-bold tracking-wider ${isActive ? "text-amber-300" : isDone ? "text-emerald-700 font-extrabold" : "text-slate-400"}`}>
                          {isActive ? "Viewing" : isDone ? "Completed ✓" : "Step " + item.s}
                        </span>
                        {isActive && <div className="w-2 h-2 bg-amber-400 rounded-full animate-ping" />}
                      </div>
                      <p className="text-xs font-bold leading-tight line-clamp-1">{item.label}</p>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Step Content Showcase Panel */}
              <div className="bg-white border border-slate-150 rounded-3xl p-5 md:p-6 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
                {/* Left block (60% width) - Detailed bullet points */}
                <div className="lg:col-span-7 space-y-4">
                  {(() => {
                    const stepDetails = [
                      {
                        title: "Setting up the Digital Haven",
                        badge: "Foundation Step",
                        desc: "First impressions set the standard. Here's how to secure structure and profiles:",
                        rules: [
                          "Group Bifurcation: Create separate spaces for pre-teens (11-13) and older teens (14-18) to match their academic and emotional maturity.",
                          "Ensure Multi-Admin Oversight: Always include at least two school counselors, educators, or vetted mentors. This prevents administrative blindspots.",
                          "Verification Gateway: Never post group links publicly on social media channels. Distribute them strictly through verified parent connections.",
                          "Platform Locks: Enable the setting where only admins can edit the group metadata (photo, description) to eliminate disruptive behaviors."
                        ]
                      },
                      {
                        title: "Defining the Golden Codes of Conduct",
                        badge: "Security & Respect",
                        desc: "Establish firm, constructive expectations to shield youth from online distress & friction:",
                        rules: [
                          "Strict 'Direct Messaging (DM)' Rule: Forbid unsolicited, unverified private message exchanges of sensitive advice. Any counseling should occur with a certified therapist, guide, or parent in loop.",
                          "Maintain High Dignity: Ban abusive insult slangs, adult multimedia, cyberbullying, or taking screenshots of fragile member shared topics.",
                          "Account Verification: Advise teens to display their real names and profile pictures so that absolute transparency is preserved.",
                          "Restoration Framework: Create a friendly 'First Warn, Then Mute, Remove on Third Strike' code. Correct with empathy but prioritize the safety of the collective group."
                        ]
                      },
                      {
                        title: "Structuring Consistent Weekly Calendars",
                        badge: "High-Engagement Keys",
                        desc: "Spontaneous groups easily fall silent. True engagement comes from a recurring weekly blueprint:",
                        rules: [
                          "Constant Rhythm: When teens know Wednesday stands for Boarding Focus Checks and Saturday hosts the Trivia Arena, check-ins become habitual.",
                          "Small File-Sizes: Share lightweight JPEG wellness infographics or short voice recordings rather than heavy documents to respect their mobile data limits.",
                          "Praise Recognition: Constantly shout out active participants, crown high-performers, and highlight quiet members on their birthdays!"
                        ]
                      },
                      {
                        title: "Harnessing Gamification & Interactive Formats",
                        badge: "Sparks & Play",
                        desc: "Bridge typical student boredom with playful, highly-engaging activities:",
                        rules: [
                          "The 12-Word Lesson Challenge: Challenge youth to summarize their day's key insight in precisely 12 words with 2 emojis limit.",
                          "Recap Speedruns: Open the microphone for 10 minutes, prompting teens to record themselves reciting a focus concept from memory. Reward speed!",
                          "Anonymous Quiz Polls: Polls spike engagement because they shield shy teenagers. Let them test their lifestyle and ethical alignment privately first."
                        ]
                      },
                      {
                        title: "Resolving Dry Spells & Silent Weeks",
                        badge: "Group Revival Hacks",
                        desc: "How to breathe rich life back into a group that has gone completely silent:",
                        rules: [
                          "Empower Teen Co-Admins: Appoint mature student prefects or teen leaders to co-manage the channel. Peer-to-peer sparks ignite twice as fast!",
                          "Respect Academic Seasons: During examinations, lower formal coaching frequencies to zero. Share simple encouraging study tips or focus support instead.",
                          "The Desk Scramble: Launch a lightning game: 'First person to post a picture of a clean study focus desk setup wins 5 Vibe points!'"
                        ]
                      }
                    ][groupPlannerStep - 1];

                    return (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="bg-emerald-50 text-emerald-800 text-[9px] font-extrabold px-2 py-0.5 rounded-md border border-emerald-100 uppercase">
                            {stepDetails.badge}
                          </span>
                          <span className="text-slate-400 font-mono text-[11px] font-bold">Step {groupPlannerStep} of 5</span>
                        </div>
                        <h4 className="text-lg font-extrabold text-[#111827]">
                          {stepDetails.title}
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed italic">{stepDetails.desc}</p>
                        
                        <ul className="space-y-3 pt-2">
                          {stepDetails.rules.map((rule, idx) => (
                            <li key={idx} className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 text-xs text-slate-700 flex items-start gap-3">
                              <span className="w-5 h-5 rounded-full bg-slate-900 text-amber-300 font-extrabold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <p className="leading-relaxed font-semibold">{rule}</p>
                            </li>
                          ))}
                        </ul>
                      </>
                    );
                  })()}
                </div>

                {/* Right block (40% width) - Fully Live Interactive Extras depending on Step selected */}
                <div className="lg:col-span-5 bg-amber-50/45 border border-amber-100 rounded-3xl p-4 md:p-5 flex flex-col justify-between">
                  
                  {/* STEP 3 ONLY: Show Daily Calendar Switcher */}
                  {groupPlannerStep === 3 && (
                    <div className="space-y-4 h-full flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 mb-2">
                          <span className="text-sm">🗓️</span>
                          <h5 className="text-xs font-bold text-amber-900 uppercase tracking-wide">Weekly Schedule Blueprint</h5>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
                          Select any day to view the exact engagement strategy to keep group activities constant:
                        </p>

                        {/* Interactive circles */}
                        <div className="grid grid-cols-7 gap-1 mb-4 text-center">
                          {[
                            { d: "monday", l: "M" },
                            { d: "tuesday", l: "T" },
                            { d: "wednesday", l: "W" },
                            { d: "thursday", l: "T" },
                            { d: "friday", l: "F" },
                            { d: "saturday", l: "S" },
                            { d: "sunday", l: "S" }
                          ].map((dayObj) => (
                            <button
                              key={dayObj.d}
                              type="button"
                              onClick={() => setSelectedScheduleDay(dayObj.d)}
                              className={`w-7 h-7 mx-auto rounded-full text-[10px] font-extrabold tracking-tight flex items-center justify-center cursor-pointer transition-all ${
                                selectedScheduleDay === dayObj.d
                                  ? "bg-slate-900 text-white font-black scale-110 shadow-sm"
                                  : "bg-white hover:bg-amber-100/50 border border-amber-200 text-slate-600"
                              }`}
                            >
                              {dayObj.l}
                            </button>
                          ))}
                        </div>

                        {(() => {
                          const daysPlan: Record<string, { name: string; icon: string; desc: string; task: string }> = {
                            monday: {
                              name: "Monday Vibe-Check",
                              icon: "🌅",
                              desc: "Focus Goal Setup",
                              task: "Share a clean micro-focus quote or habit tip. Ask teens to key-reply with a single emoji describing their state of heart, or a 1-sentence goal for the week."
                            },
                            tuesday: {
                              name: "Tuesday Dilemma",
                              icon: "🤔",
                              desc: "Ethical Choice Probe",
                              task: "Publish an engaging poll or dilemma on tough school ethics (e.g., integrity under testing pressure, managing screen limits, peer friendships). Keep options highly relatable."
                            },
                            wednesday: {
                              name: "Wednesday Vault",
                              icon: "🛡️",
                              desc: "Mental-Health Sanctuary",
                              task: "Strictly focus on connection. Ask teens: 'Any boarding stressors or family worries?' Encourage mutual support, active validation, and empathy. Dedicate a silent hour for reflection or decompression."
                            },
                            thursday: {
                              name: "Thursday Shift",
                              icon: "🎯",
                              desc: "Focus Scramble Challenge",
                              task: "Paste a scrambled focus phrase or quote and ask: 'First person to rearrange and explain the wellness concept wins the Weekly Mastermind Crown!'"
                            },
                            friday: {
                              name: "Friday Echo Check",
                              icon: "🗣️",
                              desc: "Audio Win Sharing",
                              task: "Mandate the use of voice notes. Ask members to record a 30-second audio of what they achieved or how they overcame a distraction this week. Audio creates human warmth!"
                            },
                            saturday: {
                              name: "Saturday Trivia Arena",
                              icon: "🎮",
                              desc: "Balance Quiz Battle",
                              task: "Hold a scheduled 15-minute trivia duel about science, school, and focus settings. Publish the leaderboard scores immediately!"
                            },
                            sunday: {
                              name: "Sunday Vision",
                              icon: "🌱",
                              desc: "Weekly Balance Review",
                              task: "Prompt teens to share one core insight from their offline reflection: 'Which focus lesson will you practice this week?' Wrap up with mentoring alignment."
                            }
                          };

                          const activeDay = daysPlan[selectedScheduleDay] || daysPlan.monday;

                          return (
                            <div className="bg-white border border-amber-100 rounded-2xl p-3.5 space-y-2 text-left animate-fade-in">
                              <div className="flex items-center gap-2">
                                <span className="text-base">{activeDay.icon}</span>
                                <div>
                                  <h6 className="text-xs font-black text-slate-900 leading-none">{activeDay.name}</h6>
                                  <span className="text-[9px] font-bold text-amber-700">{activeDay.desc}</span>
                                </div>
                              </div>
                              <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">
                                {activeDay.task}
                              </p>
                            </div>
                          );
                        })()}
                      </div>

                      <div className="text-[10px] text-amber-800 italic bg-amber-100/40 p-2.5 rounded-xl border border-amber-200 mt-2 text-center">
                        💡 Rhythms build habits! Keep timelines strictly predictable.
                      </div>
                    </div>
                  )}

                  {/* STEP 4 ONLY: Live Simulated Quiz Maker */}
                  {groupPlannerStep === 4 && (
                    <div className="space-y-4 text-xs h-full flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 mb-2">
                          <span className="text-sm">🗳️</span>
                          <h5 className="text-xs font-bold text-amber-900 uppercase tracking-wide">Interactive Poll Test-Drive</h5>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
                          Test-vote on this simulated poll to see why anonymous choice probes immediately double teenager participation:
                        </p>

                        {/* Interactive poll container */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-sm text-left">
                          <span className="bg-sky-50 text-sky-700 text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wide inline-block border border-sky-100">
                            Anonymous Poll
                          </span>
                          <h6 className="font-extrabold text-slate-900 text-xs leading-snug">
                            How fast do you surrender to social media screen limits at night?
                          </h6>

                          {/* Poll options list */}
                          <div className="space-y-2">
                            {[
                              { label: "🥗 Instantly, I value sleep/ Quiet Time", startVotes: 12 },
                              { label: "📱 Stare till midnight under blankets", startVotes: 24 },
                              { label: "🛌 Tense but try to limit scroll hours", startVotes: 8 }
                            ].map((opt, idx) => {
                              const totalVotes = pollVotes.reduce((a, b) => a + b, 0);
                              const curVotes = pollVotes[idx] || opt.startVotes;
                              const pct = totalVotes > 0 ? Math.round((curVotes / totalVotes) * 100) : 0;
                              const optionsSelected = votedPollIndex === idx;

                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => {
                                    if (votedPollIndex === null) {
                                      const updated = [...pollVotes];
                                      updated[idx] = (updated[idx] || opt.startVotes) + 1;
                                      setPollVotes(updated);
                                      setVotedPollIndex(idx);
                                    }
                                  }}
                                  disabled={votedPollIndex !== null}
                                  className={`w-full text-left p-2.5 rounded-xl border relative overflow-hidden transition-all ${
                                    votedPollIndex !== null 
                                      ? optionsSelected 
                                        ? "border-emerald-600 bg-emerald-50/20" 
                                        : "border-slate-100 bg-slate-50/50"
                                      : "border-slate-200 hover:border-emerald-700 bg-slate-50 hover:bg-white"
                                  } cursor-pointer`}
                                >
                                  {/* Pct progress bar indicator */}
                                  {votedPollIndex !== null && (
                                    <div 
                                      className="absolute left-0 top-0 bottom-0 bg-emerald-100/50 transition-all duration-500"
                                      style={{ width: `${pct}%`, zIndex: 0 }}
                                    />
                                  )}

                                  <div className="relative z-10 flex justify-between items-center pr-1 text-[11px] font-semibold">
                                    <span className={optionsSelected ? "font-bold text-emerald-800" : "text-slate-700"}>
                                      {optionsSelected ? "✓ " : ""}{opt.label}
                                    </span>
                                    {votedPollIndex !== null && (
                                      <span className="font-mono text-slate-500 text-[10px]">
                                        {pct}% ({curVotes})
                                      </span>
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>

                          {/* Reset poll */}
                          {votedPollIndex !== null && (
                            <button
                              type="button"
                              onClick={() => {
                                setVotedPollIndex(null);
                                setPollVotes([12, 18, 5]);
                              }}
                              className="text-[10px] text-slate-400 hover:text-slate-600 font-bold underline block mx-auto pt-1 cursor-pointer"
                            >
                              Reset Poll Vote
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="text-[10px] text-emerald-800 bg-emerald-150/45 border border-emerald-200 p-2.5 rounded-xl text-center italic mt-2">
                        💡 Interactive polls shield shy teenagers. Always use them!
                      </div>
                    </div>
                  )}

                  {/* ALL OTHER STEPS (1, 2, 5): Show Copy-To-Clipboard Prompt Generator */}
                  {groupPlannerStep !== 3 && groupPlannerStep !== 4 && (
                    <div className="space-y-4 text-xs h-full flex flex-col justify-between">
                      <div>
                        {/* Selector label */}
                        <div className="flex items-center gap-1.5 mb-2">
                          <span className="text-sm">📋</span>
                          <h5 className="text-xs font-bold text-[#111827] uppercase tracking-wide">Copy-To-Share Prompt Treasury</h5>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
                          Select a category to customize and generate a professional template suited for your digital fellowship group:
                        </p>

                        {/* Dropdown switch category */}
                        <div className="space-y-3">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 block mb-1">Select Message Intent:</label>
                            <select
                              value={selectedPromptCategory}
                              onChange={(e) => setSelectedPromptCategory(e.target.value)}
                              className="w-full text-xs font-bold bg-white border border-slate-200 rounded-xl p-2.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-750 font-sans cursor-pointer shadow-sm"
                            >
                              <option value="discussion">💡 Friday Screen roundtable</option>
                              <option value="devotional">🌅 Morning focus challenge</option>
                              <option value="poll">🤔 Tuesday dilemma question</option>
                              <option value="safety">🛡️ Security & conduct admin alert</option>
                            </select>
                          </div>

                          {/* Template Preview wrapper */}
                          <div className="bg-white border border-slate-150 rounded-2xl p-3 text-left relative max-h-[160px] overflow-y-auto min-h-[110px]">
                            <span className="absolute top-2 right-2 text-[9px] uppercase font-bold text-slate-400">Preview</span>
                            <pre className="text-[10px] text-slate-600 leading-relaxed font-sans whitespace-pre-wrap font-semibold break-words">
                              {(() => {
                                const isWA = groupPlannerPlatform === "whatsapp";
                                switch (selectedPromptCategory) {
                                  case "devotional":
                                    return isWA 
                                      ? `🌅 *MORNING FOCUS CHALLENGE* 🌅\n\nHey family! Today we are practicing *focused morning habit entry*.\n\n"Start with clarity, proceed with purpose."\n\n👉 *Your Task:* Post a 30-second voice note or text sharing ONE goal you choose to focus on today! Let's get it! 🔥`
                                      : `🌅 *MORNING FOCUS CHALLENGE* 🌅\n\nHey team! Today's anchor is the *analog morning challenge*.\n\n"Start with clarity, proceed with purpose."\n\n👇 *Click reaction below* once you complete your analog 20-minute interval, then comment with one primary goal! 🚀`;
                                  case "poll":
                                    return isWA
                                      ? `🤔 *TUESDAY DILEMMA TIME* 🤔\n\nLet's get real class. If a classmate asks you to help them sneak an uncommitted smartphone into boarding housing, what do you do?\n\n1️⃣ Say "No, Charley, rules first."\n2️⃣ Compromise to stay close.\n3️⃣ Talk to our counselor.\n\nReply with option index! 👇`
                                      : `🤔 *DEEP FOCUS PROBE* 🤔\n\nHow do we handle study laziness during examination margins?\n\n(Use the anonymous quiz poll below to vote, then discuss inside parent comments!)`;
                                  case "safety":
                                    return isWA
                                      ? `⚠️ *COMMUNITY PROTECTION PROTOCOL* ⚠️\n\nHello mentors and teens! Remember:\n\n🙅‍♂️ NO unsolicited private-messaging of sensitive advice.\n🙅‍♂️ NO external group links without validation.\n🚪 Chat locks at 9:30 PM for restorative sleep. Let's stand strong!`
                                      : `🛡️ *SECURED CHAT HAVEN* 🛡️\n\nAttention Fellowship:\n\n1. Ensure your privacy config hides your numbers.\n2. Do NOT click unfamiliar outside host links.\n3. Keep text edifying and helpful!`;
                                  default:
                                    return isWA
                                      ? `💡 *FRIDAY ROUNDTABLE: SCREEN LIMITS* 💡\n\nLet's review our screen hours. We are guiding minds, not scrolling them.\n\n*Question:* What is one boundaries trick that saved your study hours this week? Speak out! 🗣️`
                                      : `💡 *FRIDAY ROUNDTABLE: INTENTIAL LIVING* 💡\n\n"He who walks with the wise grows wise..."\n\nComment below: Share one awesome focus trait you admire in a peer! 👇`;
                                }
                              })()}
                            </pre>
                          </div>
                        </div>
                      </div>

                      {/* Click copy button */}
                      <button
                        type="button"
                        onClick={() => {
                          const isWA = groupPlannerPlatform === "whatsapp";
                          let txt = "";
                          switch (selectedPromptCategory) {
                            case "devotional":
                              txt = isWA 
                                ? `🌅 *MORNING FOCUS CHALLENGE* 🌅\n\nHey family! Today we are practicing *focused morning habit entry*.\n\n"Start with clarity, proceed with purpose."\n\n👉 *Your Task:* Post a 30-second voice note or text sharing ONE goal you choose to focus on today! Let's get it! 🔥`
                                : `🌅 *MORNING FOCUS CHALLENGE* 🌅\n\nHey team! Today's anchor is the *analog morning challenge*.\n\n"Start with clarity, proceed with purpose."\n\n👇 *Click reaction below* once you complete your analog 20-minute interval, then comment with one primary goal! 🚀`;
                              break;
                            case "poll":
                              txt = isWA
                                ? `🤔 *TUESDAY DILEMMA TIME* 🤔\n\nLet's get real class. If a classmate asks you to help them sneak an uncommitted smartphone into boarding housing, what do you do?\n\n1️⃣ Say "No, Charley, rules first."\n2️⃣ Compromise to stay close.\n3️⃣ Talk to our counselor.\n\nReply with option index! 👇`
                                : `🤔 *DEEP FOCUS PROBE* 🤔\n\nHow do we handle study laziness during examination margins?\n\n(Use the anonymous quiz poll below to vote, then discuss inside parent comments!)`;
                              break;
                            case "safety":
                              txt = isWA
                                ? `⚠️ *COMMUNITY PROTECTION PROTOCOL* ⚠️\n\nHello mentors and teens! Remember:\n\n🙅‍♂️ NO unsolicited private-messaging of sensitive advice.\n🙅‍♂️ NO external group links without validation.\n🚪 Chat locks at 9:30 PM for restorative sleep. Let's stand strong!`
                                : `🛡️ *SECURED CHAT HAVEN* 🛡️\n\nAttention Fellowship:\n\n1. Ensure your privacy config hides your numbers.\n2. Do NOT click unfamiliar outside host links.\n3. Keep text edifying and helpful!`;
                              break;
                            default:
                              txt = isWA
                                ? `💡 *FRIDAY ROUNDTABLE: SCREEN LIMITS* 💡\n\nLet's review our screen hours. We are guiding minds, not scrolling them.\n\n*Question:* What is one boundaries trick that saved your study hours this week? Speak out! 🗣️`
                                : `💡 *FRIDAY ROUNDTABLE: INTENTIAL LIVING* 💡\n\n"He who walks with the wise grows wise..."\n\nComment below: Share one awesome focus trait you admire in a peer! 👇`;
                          }
                          
                          if (navigator && navigator.clipboard) {
                            navigator.clipboard.writeText(txt);
                            setIsPromptCopied(true);
                            setTimeout(() => setIsPromptCopied(false), 2000);
                          } else {
                            alert("Clipboard write restricted, here is your text:\n\n" + txt);
                          }
                        }}
                        className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transform transition shadow active:scale-95 ${
                          isPromptCopied 
                            ? "bg-emerald-700 text-white" 
                            : "bg-slate-900 border border-slate-900 text-white hover:bg-slate-800"
                        }`}
                      >
                        {isPromptCopied ? "✓ Prompt Copied to Clipboard!" : "📋 Copy Prompt Template"}
                      </button>
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
        )}

            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Floating alert for playing audio so user knows what's streaming globally */}
      {audioPlayId && (
        <div className="fixed bottom-6 right-6 bg-emerald-900 text-white shadow-2xl p-4 rounded-3xl border border-emerald-850 flex items-center gap-4 z-50 animate-bounce max-w-sm">
          <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-sm">
            🔊
          </div>
          <div>
            <p className="text-xs font-extrabold">Wisdom Voice Active</p>
            <p className="text-[10px] text-emerald-200">Our mentor voice synthesizers are active narrating guides.</p>
          </div>
          <button 
            onClick={() => {
              if (audioRef.current) audioRef.current.pause();
              setAudioPlayId(null);
            }}
            className="text-white hover:text-amber-300 font-bold ml-2 text-sm"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
