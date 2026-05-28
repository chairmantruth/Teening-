import { ForumPost } from "./types";

export const PRE_POPULATED_POSTS: ForumPost[] = [
  {
    id: "post-1",
    title: "How to navigate dopamine spikes and TikTok doomscrolling with high schoolers?",
    author: "Elena Vance",
    role: "Parent",
    region: "London, UK",
    content: "My 15-year-old daughter is constantly swiping. At dinner, she is physically present but emotionally detached, almost experiencing twitching or anxiety when her phone is out of sight. I am trying to introduce soft boundaries without being seen as 'toxic' or 'controlling'. Any tips from parents who successfully co-created text-free zones?",
    verses: ["#DigitalDetox", "#ScreenBalance", "#AestheticDisconnect"],
    likes: 38,
    hasLiked: false,
    timestamp: "2 hours ago",
    category: "Social Media",
    replies: [
      {
        id: "rep-1-1",
        author: "Marcus Brody",
        role: "Teen Coach",
        content: "What worked for my clients was replacing 'bans' with high-value alternatives. We set up an aesthetic record player and journaling desk in her room, making 'analog unwinding' look cool and aesthetic rather than a punishment. Also, establish a 'phones-on-the-charger-by-9pm' house rule that applies to adults first!",
        timestamp: "1 hour ago",
        likes: 18
      },
      {
        id: "rep-1-2",
        author: "Coach Riley",
        role: "Mentor",
        content: "Absolutely. Frame it as preserving 'clean energy' and focus intervals. High schoolers actually crave quiet focus but suffer from massive FOMO. If the whole family commits to putting phones on airplane mode during dinner, it feels like a collective mental wellness pact, not screen-shaming.",
        timestamp: "45 mins ago",
        likes: 14
      }
    ]
  },
  {
    id: "post-2",
    title: "Setting healthy limits on Discord & gaming without getting completely shut out",
    author: "Jordan Peterson",
    role: "Parent",
    region: "New York, USA",
    content: "My 14-year-old lives in his Discord servers and Minecraft custom realms. I understand it is his primary social circle, but he is staying awake until 3:00 AM. When I pull the Wi-Fi plug, it triggers major outbursts. How do we negotiate healthy curfews while honoring their digital friendships?",
    verses: ["#ActiveGamingLimits", "#DigitalDiplomacy", "#FOMOShield"],
    likes: 52,
    hasLiked: false,
    timestamp: "1 day ago",
    category: "Social Media",
    replies: [
      {
        id: "rep-2-1",
        author: "Ariel Sterling",
        role: "School Counselor",
        content: "Pro-tip: Avoid pulling the plug on-the-fly. This registers as an unpredictable threat to their autonomy. Instead, use a 'digital contract' approach. Agree during a calm, non-gaming moment on automatic DNS schedules (Wi-Fi pauses for his MAC address at 11 PM). This takes the emotional burden off you; the tech enforces itself neutral and predictable.",
        timestamp: "18 hours ago",
        likes: 29
      }
    ]
  },
  {
    id: "post-3",
    title: "Helping teens navigate physical self-image vs heavily-filtered digital clout",
    author: "Sophia Chen",
    role: "Mentor",
    region: "San Francisco, USA",
    content: "We are seeing massive increases in teenage physical anxiety. Teens feel they are failing unless their lifestyle looks like a curated Pinterest board or a viral TikTok loop. We must find creative ways to validate raw, real, unfiltered offline activities and celebrate human quirks.",
    verses: ["#AuthenticAesthetic", "#BodyVibeCheck", "#RealLifeClout"],
    likes: 47,
    hasLiked: false,
    timestamp: "3 days ago",
    category: "Spiritual Growth",
    replies: [
      {
        id: "rep-3-1",
        author: "Chloe James",
        role: "Teen Coach",
        content: "Yes! Encourage physical hands-on craft hobbies (clay modeling, skateboarding, cooking, hiking) where mistakes are part of the fun and cannot be easily filtered. Experiencing the friction of the physical world is the ultimate remedy for curation fatigue.",
        timestamp: "2 days ago",
        likes: 22
      }
    ]
  }
];

export const PARENTING_RESOURCES = [
  {
    id: "res-1",
    title: "The Aesthetic Detox Manual: Curating Clean Mental Spaces",
    subtitle: "Dopamine resets, custom curfews, and visual quiet hours",
    duration: "10 mins read",
    category: "Character & Ethics",
    bibleFocus: "Mindfulness, Dopamine resets, Screen balance",
    summary: "A practical guide to help teens replace endless algorithmic feeds with premium analog aesthetics, creative workstations, and healthy digital separation.",
    points: [
      "Co-design the bedroom context: Help them clean clutter and replace high-intensity RGB lights with warm, ambient lighting that cues sleep.",
      "Analog dopamine substitutes: Provide instant cameras, vintage magazines, or physical sketchbooks to satisfy visual creativity offline.",
      "The collective curfew: Create a cool central docking station in the kitchen where everyone docks their screens by 10:00 PM."
    ]
  },
  {
    id: "res-2",
    title: "The Peer Flow & FOMO Survival Handbook",
    subtitle: "Navigating digital exclusions, Snapchat streaks, and group chats",
    duration: "12 mins read",
    category: "Leadership & Faith",
    bibleFocus: "Emotional Resilience, Group inclusion hacks",
    summary: "Guiding teenagers past social exclusion, toxic online hierarchies, viral gossip spikes, and the crushing anxiety of Snapchat ranking levels.",
    points: [
      "The 'No-Streak' validation: Discuss how snap streaks are marketing gamification tricks designed to capture attention, not measure friendship.",
      "Identify community anchors: Encourage physical local club participation, sports, or creative camps where digital status carries zero weight.",
      "The Open-Door policy: Validate the pain of social exclusion without preaching, allowing them to express disappointment securely."
    ]
  },
  {
    id: "res-3",
    title: "Active Listening: Replacing Lectures with Vibe Checks",
    subtitle: "Fostering psychological safety and open dialogue without micromanagement",
    duration: "15 mins read",
    category: "Discipline & Guidance",
    bibleFocus: "Empathy, Reflective feedback, Non-judgment",
    summary: "A blueprint for modern parents. Pivot the conversation from top-down grilling to collaborative inquiry, allowing teens to express authentic feelings safely.",
    points: [
      "The 3-Second Pause: Never interrupt. When a teenager confesses an error, breathe for three seconds before replying to avoid triggering a defense reflex.",
      "Reflective phrasing: Say 'It sounds like you felt really overwhelmed when that happened. Is that right?' rather than pointing out rules instantly.",
      "Collaborative recovery: Draft solutions together. Give them agency in setting the consequences for their own boundary-crossings."
    ]
  },
  {
    id: "res-4",
    title: "Creative Collaborative Digital Contracts",
    subtitle: "How to negotiate gaming screens and tech budgets cleanly",
    duration: "8 mins read",
    category: "Digital Mentorship",
    bibleFocus: "Mutual agreement, Tech safety, Autonomy",
    summary: "A step-by-step framework to finalize a household tech contract that protects sleep and homework blocks while honoring teen interests.",
    points: [
      "Establish non-negotiable slots: Protect hours 10:00 PM to 7:00 AM as absolute screen-free zones for brain restoration.",
      "Gamified reward triggers: Tie high-speed gaming specs or custom gear acquisitions to consistent offline discipline and health goals.",
      "Transparent monitoring: Install shared curfews instead of secret spyware, showing respect for their growing privacy."
    ]
  }
];
