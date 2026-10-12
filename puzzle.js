// =====================================================
// RANDOM PUZZLE DATABASE
// =====================================================

const puzzles = [

    // =========================
    // CSE / ENGINEERING
    // =========================

    {
        title: "The Stack",
        question: "Which data structure follows LIFO?",
        answer: "stack",
        clue: "Think about the last item that enters.",
        icon: "💻"
    },

    {
        title: "The Queue",
        question: "Which data structure follows FIFO?",
        answer: "queue",
        clue: "First in, first out.",
        icon: "🧠"
    },

    {
        title: "Binary Search",
        question: "What is the time complexity of binary search?",
        answer: "O(log n)",
        clue: "The search space is divided in half.",
        icon: "🔍"
    },

    {
        title: "The Byte",
        question: "How many bits are there in one byte?",
        answer: "8",
        clue: "A very common computer measurement.",
        icon: "💾"
    },

    {
        title: "Operating System",
        question: "What does OS stand for?",
        answer: "operating system",
        clue: "It manages the computer's hardware and software.",
        icon: "🖥️"
    },

    {
        title: "CPU",
        question: "What does CPU stand for?",
        answer: "central processing unit",
        clue: "It is often called the brain of the computer.",
        icon: "⚙️"
    },

    {
        title: "Database",
        question: "Which SQL command is commonly used to retrieve data?",
        answer: "select",
        clue: "It begins many database queries.",
        icon: "🗄️"
    },

    {
        title: "HTML",
        question: "What does HTML stand for?",
        answer: "hypertext markup language",
        clue: "It is used to structure web pages.",
        icon: "🌐"
    },

    {
        title: "CSS",
        question: "What does CSS stand for?",
        answer: "cascading style sheets",
        clue: "It controls the appearance of web pages.",
        icon: "🎨"
    },

    {
        title: "HTTP",
        question: "What does HTTP stand for?",
        answer: "hypertext transfer protocol",
        clue: "Think about communication between browser and server.",
        icon: "🌐"
    },

    {
        title: "Binary",
        question: "What are the only two digits used in binary?",
        answer: "0 and 1",
        clue: "Computers love these two numbers.",
        icon: "🔢"
    },

    {
        title: "RAM",
        question: "What does RAM stand for?",
        answer: "random access memory",
        clue: "It is temporary working memory.",
        icon: "🧠"
    },


    // =========================
    // GENERAL KNOWLEDGE
    // =========================

    {
        title: "The Red Planet",
        question: "Which planet is known as the Red Planet?",
        answer: "mars",
        clue: "It is the fourth planet from the Sun.",
        icon: "🪐"
    },

    {
        title: "The Ocean",
        question: "What is the largest ocean on Earth?",
        answer: "pacific",
        clue: "Its name begins with P.",
        icon: "🌊"
    },

    {
        title: "The Sun",
        question: "What is the closest star to Earth?",
        answer: "sun",
        clue: "You see it almost every day.",
        icon: "☀️"
    },

    {
        title: "The Moon",
        question: "What is Earth's natural satellite?",
        answer: "moon",
        clue: "You can see it at night.",
        icon: "🌙"
    },


    // =========================
    // RIDDLES
    // =========================

    {
        title: "The Keyboard",
        question:
            "I have keys but open no locks. I have space but no room. What am I?",
        answer: "keyboard",
        clue: "You may have one in front of you right now.",
        icon: "⌨️"
    },

    {
        title: "The Clock",
        question:
            "I have hands but cannot clap. What am I?",
        answer: "clock",
        clue: "You use me to know the time.",
        icon: "🕐"
    },

    {
        title: "The Shadow",
        question:
            "I follow you everywhere but disappear in the dark. What am I?",
        answer: "shadow",
        clue: "Look behind you when there is light.",
        icon: "🌑"
    },

    {
        title: "The Echo",
        question:
            "I speak without a mouth and hear without ears. What am I?",
        answer: "echo",
        clue: "You might hear me in a valley.",
        icon: "🔊"
    },


    // =========================
    // SIMPLE CALCULATIONS
    // =========================

    {
        title: "Calculate",
        question: "What is 12 × 8?",
        answer: "96",
        clue: "Take your time.",
        icon: "🔢"
    },

    {
        title: "Calculate",
        question: "What is 144 ÷ 12?",
        answer: "12",
        clue: "A simple division puzzle.",
        icon: "➗"
    },

    {
        title: "Calculate",
        question: "What is 25 + 37?",
        answer: "62",
        clue: "Add the two numbers.",
        icon: "➕"
    },

    {
        title: "Calculate",
        question: "What is 100 - 43?",
        answer: "57",
        clue: "Subtract carefully.",
        icon: "➖"
    }

];


// =====================================================
// RANDOM PUZZLE
// =====================================================

export function generatePuzzle() {

    const randomIndex =
        Math.floor(
            Math.random() *
            puzzles.length
        );

    return puzzles[randomIndex];

}