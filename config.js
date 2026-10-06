// ============ EDIT ONLY THIS FILE ============
const CONFIG = {
  herName: "babygirl",
  yourEmail: "harshparkar27@gmail.com",      // used for the fallback email button

  // Free key from https://web3forms.com (type your email there, they send you a key).
  // With it, her wish arrives in your inbox automatically, with no email app involved.
  web3formsKey: "5dc9077a-9f04-48f4-9a4c-c645fe7566c4",

  video: "video.mp4",                // the file sitting next to index.html

  introTitle: "Hey Akshu, ready to remember? 💭",
  introText: "I made a little game about one of our moments. Answer 3 questions and solve 3 puzzles to unlock a surprise.",
  finalTitle: "You remembered everything! 🥹",
  prizeQuestion: "What do you want as your prize, my babygirl? 🎀",

  // Each round: question, answer keyword (blank = any answer works), hint, memory message
  rounds: [
    { q: "What color we both were wearing?",
      image: "frames/frame1.jpg",
      a: "pink black", hint: "We were looking soo cute together!",
      m: "I still smile every time I think about that date. 😂" },
    // { q: "Where were we in the end of the day on our first date?",
    //   image: "frames/frame2.jpg",
    //   a: "cafe", hint: "Think about the place…",
    //   m: "That place, that day… it was perfect because you were there. 💕" },
    // { q: "What dishes did we order?",
    //   image: "frames/frame3.jpg",
    //   a: "sandwich", hint: "that was quite big…",
    //   m: "I remembered how you taught me how to eat that sandwich. 😂" },
  ]
};
