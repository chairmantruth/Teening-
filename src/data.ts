import { ForumPost } from "./types";

export const PRE_POPULATED_POSTS: ForumPost[] = [
  {
    id: "post-1",
    title: "How to handle boarding school prep for a teen easily misled by friends?",
    author: "Sister Faustina",
    role: "Parent",
    region: "Kumasi, Ashanti Region",
    content: "My 14-year-old son is moving to a boarding school in Cape Coast next term. At home, he participates in family altars, but he is easily swayed by peer groups. I am anxious that he might compromise his Christian values under boarding school pressure. Any practical tips from veteran guides on how to strengthen his foundation before he leaves?",
    verses: ["Proverbs 13:20", "1 Corinthians 15:33"],
    likes: 24,
    hasLiked: false,
    timestamp: "2 hours ago",
    category: "Boarding School",
    replies: [
      {
        id: "rep-1-1",
        author: "Pastor Emmanuel",
        role: "Youth Pastor",
        content: "Peace be with you, Sis Faustina. First, don't worry. Before he leaves, walk through the school rules together and buy him a physical copy of 'Our Daily Bread' or a Scripture Union devotional. Encourage him to register with the school's Scripture Union (SU) on the very first Sunday! The SU acts as a replacement spiritual family. Let's lift him in prayers.",
        timestamp: "1 hour ago",
        likes: 12
      },
      {
        id: "rep-1-2",
        author: "Uncle Kwame",
        role: "Mentor",
        content: "Amen. I also advise doing a 'mock trial' at home. Re-enact scenarios where friends invite him to sneak out or peer pressure him to skip morning devotions. Help him practice saying 'No, Charley, I want to study and pray.' It builds real confidence!",
        timestamp: "45 mins ago",
        likes: 8
      }
    ]
  },
  {
    id: "post-2",
    title: "Smartphone lockouts and morning Quiet Time discipline",
    author: "Brother Andrews",
    role: "SU Patron",
    region: "Legon, Greater Accra",
    content: "Many of our SHS day-students are staying awake until 2:00 AM scrolling social media (TikTok/Instagram) or chatting. By 5:00 AM during family prayers, they are fast asleep or physically present but spiritually vacant. I want to pitch a 'Digital Family Fast' to our PTA. Has anyone implemented this?",
    verses: ["Proverbs 25:28", "Ephesians 5:15-16"],
    likes: 42,
    hasLiked: false,
    timestamp: "1 day ago",
    category: "Social Media",
    replies: [
      {
        id: "rep-2-1",
        author: "Auntie Comfort",
        role: "School Counselor",
        content: "Yes, Andrews! We hold a 'Basket Devotion' in our home in Accra. By 9:30 PM, all family members (including my husband and I!) drop our phones in a wooden basket in the hallway. No phones in bedrooms. It is hard the first week, but it restores early morning devotions beautifully. Lead by example!",
        timestamp: "18 hours ago",
        likes: 19
      }
    ]
  },
  {
    id: "post-3",
    title: "Discipling our boys to respect women and model 'Barima' values",
    author: "Elder Kofi Tsatsu",
    role: "Mentor",
    region: "Ho, Volta Region",
    content: "The worldly version of masculinity teaches boys to be proud, rough, and view girls as objects of conquest. We must reframe 'Barima' (manhood in Twi) around Christ-like stewardship: protector, hard worker, kind, polite, obedient, and respectful. We must raise modern Josephs who flee from lust.",
    verses: ["Genesis 39:9", "2 Timothy 2:22"],
    likes: 31,
    hasLiked: false,
    timestamp: "3 days ago",
    category: "Spiritual Growth",
    replies: [
      {
        id: "rep-3-1",
        author: "Sister Efua",
        role: "Parent",
        content: "Medaase Elder Kofi for this reminder! If our brothers see their fathers respecting their mothers and helping in the kitchen, they learn respect naturally. Discipleship is lived out every single day in our Ghanaian homes.",
        timestamp: "2 days ago",
        likes: 15
      }
    ]
  }
];

export const PARENTING_RESOURCES = [
  {
    id: "res-1",
    title: "Obaasima Guidelines: Raising Virtuous Teen Girls",
    subtitle: "Dignity, Spiritual Devotion, and Self-Worth",
    duration: "10 mins read",
    category: "Character & Ethics",
    bibleFocus: "Proverbs 31:30, Titus 2:3-5",
    summary: "A blueprint to mentor teen girls to appreciate spiritual depth, healthy boundaries, academic diligence, and biblical womanhood in a modern commercialized culture.",
    points: [
      "Guard against digital beauty comparisons: Teach her that her self-worth is rooted in Christ, not online views.",
      "Model active leadership: Involve her in church fellowships, teaching junior departments, or local charity.",
      "The mother-mentor channel: Foster a relationship where she can talk about hormonal shifts and emotional interests without fear of physical beating or shouting."
    ]
  },
  {
    id: "res-2",
    title: "The Boarding School Spiritual Survival Handbook",
    subtitle: "How to stay pure from Accra up to Cape Coast boarding lives",
    duration: "15 mins read",
    category: "Leadership & Faith",
    bibleFocus: "Joshua 1:9, Daniel 1:8",
    summary: "Guiding teenagers past boarding school hierarchies, bullying, exam anxiety, and the peer pressure to join cliques.",
    points: [
      "The Daniel Resolve: Encourage your teen to decide in their heart NOT to participate in light rituals, bad slang, or cheating.",
      "Adopt a Mentor Student: Connect them with key Christian senior prefects or SU leaders who can look out for them.",
      "The Letter connection: Send warm, encouraging physical letters quoting favorite family scriptures, reminding them of how much they are loved."
    ]
  },
  {
    id: "res-3",
    title: "Biblical Discipline: Moving from Whip to Wisdom",
    subtitle: "Understanding the difference between raw anger and godly correction",
    duration: "12 mins read",
    category: "Discipline & Guidance",
    bibleFocus: "Hebrews 12:11, Proverbs 29:17",
    summary: "A revolutionary manual about discipling Ghanaian kids. Shifts behavior from superficial fear of physical lashes to deep heart-level conviction and repentance.",
    points: [
      "Wait until cooled: Never correct a teenager when you are screaming in rage. Calm down first.",
      "The Dialogue approach: Let the teenager verbalize exactly why their action was harmful or disrespectful.",
      "Follow up with restorative prayer: Conclude correction times with a collaborative prayer of forgiveness and emotional reassurance."
    ]
  },
  {
    id: "res-4",
    title: "Vibrant Digital Fellowships: WhatsApp & Telegram Circles",
    subtitle: "Practical guidebook to run high-engagement online teen groups",
    duration: "8 mins read",
    category: "Digital Mentorship",
    bibleFocus: "Hebrews 10:24-25, Colossians 4:6",
    summary: "A blueprint to assist mentors and student leaders in launching, securing, and sustaining active daily engagement in mobile chat threads without dry spells.",
    points: [
      "Dynamic Weekly Rhythms: Implement a steady calendar from Monday Devotionals to Sunday Evening Altars to avoid dead silence.",
      "Bulletproof Boundary System: Restrict late-night posting, verify and secure all member profiles, and set clear codes of conduct.",
      "Empower Teen Co-Admins: Delegate active group ownership (polls, graphics, prayer chains) to teen leaders to build godly characters."
    ]
  }
];
