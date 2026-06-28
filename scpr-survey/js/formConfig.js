export const formConfig = {
  header: {
    title: "🎓 SCPR Career Guidance Survey",
    subtitle: "Smart Career Path Recommendation System",
    tagline: "Help us build better career guidance for students like you!"
  },
  sections: [
    {
      id: "section1",
      icon: "🌟",
      title: "Welcome & Consent",
      intro: {
        heading: "🌟 Welcome to the Career Guidance Survey",
        body: [
          "Hi there! 👋",
          "I'm building a Smart Career Path Recommendation System that uses Artificial Intelligence to help students discover the right career.",
          "This survey takes 10-12 minutes. Your honest answers will help make career guidance better for everyone!",
          "",
          "🔒 Privacy Guaranteed:",
          "- ✓ Your answers are completely ANONYMOUS",
          "- ✓ No one will know it's you",
          "- ✓ You can stop anytime",
          "- ✓ You can skip any question you're not comfortable with",
          "",
          "By continuing, you agree to participate voluntarily."
        ],
        list: null,
        closing: null
      },
      questions: [
        {
          id: "consent",
          type: "checkbox",
          required: true,
          label: "I agree to participate in this survey",
          helper: null,
          options: [],
          allowOtherSpecify: false
        },
        {
          id: "anonymity",
          type: "checkbox",
          required: true,
          label: "I understand my answers are anonymous",
          helper: null,
          options: [],
          allowOtherSpecify: false
        }
      ]
    },
    {
      id: "section2",
      icon: "📋",
      title: "About You",
      intro: null,
      questions: [
        {
          id: "age",
          type: "radio",
          required: true,
          label: "What is your age?",
          helper: null,
          options: [
            "14 years",
            "15 years",
            "16 years",
            "17 years",
            "18 years",
            "19-20 years",
            "21-25 years"
          ],
          allowOtherSpecify: false
        },
        {
          id: "gender",
          type: "radio",
          required: false,
          label: "What is your gender?",
          helper: "(Optional — for analysis only)",
          options: [
            "Male",
            "Female",
            "Prefer not to say",
            "Other"
          ],
          allowOtherSpecify: false
        },
        {
          id: "grade",
          type: "radio",
          required: true,
          label: "Which class/grade are you currently in?",
          helper: null,
          options: [
            "Class 10",
            "Class 11",
            "Class 12",
            "1st Year College",
            "2nd Year College",
            "3rd Year College",
            "Other"
          ],
          allowOtherSpecify: false
        }
      ]
    },
    {
      id: "section3",
      icon: "📚",
      title: "Academic Information",
      intro: null,
      questions: [
        {
          id: "stream",
          type: "radio",
          required: true,
          label: "What is your academic stream?",
          helper: null,
          options: [
            "Science (PCM - Physics, Chemistry, Math)",
            "Science (PCB - Physics, Chemistry, Biology)",
            "Commerce",
            "Arts/Humanities",
            "Diploma (Engineering)",
            "Other (please specify)"
          ],
          allowOtherSpecify: true
        },
        {
          id: "marks",
          type: "radio",
          required: true,
          label: "What was your marks percentage in your last exam?",
          helper: null,
          options: [
            "90-100% (Excellent)",
            "75-89% (Good)",
            "60-74% (Above Average)",
            "40-59% (Average)",
            "Below 40%"
          ],
          allowOtherSpecify: false
        },
        {
          id: "favoriteSubjects",
          type: "checkbox",
          required: true,
          minSelected: 1,
          label: "Which subjects are your favorites?",
          helper: "(Select all that apply)",
          options: [
            "Mathematics",
            "Physics",
            "Chemistry",
            "Biology",
            "Computer Science / IT",
            "English / Literature",
            "History / Geography",
            "Economics",
            "Accountancy",
            "Business Studies",
            "Art / Drawing",
            "Physical Education",
            "Languages",
            "Other (please specify)"
          ],
          allowOtherSpecify: true
        }
      ]
    },
    {
      id: "section4",
      icon: "🌟",
      title: "Your Interests",
      intro: null,
      questions: [
        {
          id: "activities",
          type: "checkbox",
          required: true,
          minSelected: 1,
          label: "What activities do you enjoy doing?",
          helper: "(Select all that apply)",
          options: [
            "Solving puzzles and brain teasers",
            "Building or making things with hands",
            "Writing stories, articles, or blogs",
            "Drawing, painting, or creating art",
            "Programming or coding",
            "Researching topics I'm curious about",
            "Teaching or explaining things to others",
            "Leading groups or organizing events",
            "Helping people or volunteering",
            "Working with numbers and calculations",
            "Playing sports or physical activities",
            "Playing musical instruments",
            "Photography or videography",
            "Traveling and exploring new places",
            "Other (please specify)"
          ],
          allowOtherSpecify: true
        },
        {
          id: "subjectAreas",
          type: "checkbox",
          required: true,
          exactSelected: 3,
          label: "Which subject areas interest you the most?",
          helper: "(Select exactly 3)",
          options: [
            "Mathematics & Logic",
            "Science & Experiments",
            "Technology & Computers",
            "Business & Finance",
            "Arts & Creativity",
            "Health & Biology",
            "Law & Society",
            "Languages & Communication",
            "History & Culture",
            "Sports & Fitness",
            "Environment & Nature",
            "Psychology & Human Behavior"
          ],
          allowOtherSpecify: false
        },
        {
          id: "careerFields",
          type: "checkbox",
          required: true,
          minSelected: 1,
          label: "Which career fields excite you the most?",
          helper: "(Select all that apply)",
          options: [
            "Technology / Information Technology",
            "Healthcare / Medicine",
            "Education / Teaching",
            "Business / Finance / Banking",
            "Engineering",
            "Creative Arts / Design",
            "Law / Justice / Legal",
            "Research / Science",
            "Government / Public Services",
            "Sports / Fitness",
            "Media / Journalism",
            "Agriculture / Environment",
            "Hospitality / Tourism",
            "Not sure yet",
            "Other (please specify)"
          ],
          allowOtherSpecify: true
        }
      ]
    },
    {
      id: "section5",
      icon: "💪",
      title: "Your Skills Assessment",
      intro: {
        heading: "Rate yourself honestly on a scale of 1 to 5:",
        body: [
          "- 1 = Beginner / Needs Improvement",
          "- 2 = Basic / Getting Started",
          "- 3 = Average / Comfortable",
          "- 4 = Good / Strong",
          "- 5 = Excellent / Very Confident"
        ],
        list: null,
        closing: null
      },
      questions: [
        {
          id: "problemSolving",
          type: "scale",
          required: true,
          min: 1,
          max: 5,
          label: "Problem Solving",
          description: "Ability to analyze and solve complex problems"
        },
        {
          id: "communication",
          type: "scale",
          required: true,
          min: 1,
          max: 5,
          label: "Communication",
          description: "Speaking, writing, and expressing ideas clearly"
        },
        {
          id: "teamwork",
          type: "scale",
          required: true,
          min: 1,
          max: 5,
          label: "Teamwork",
          description: "Working effectively in groups and teams"
        },
        {
          id: "leadership",
          type: "scale",
          required: true,
          min: 1,
          max: 5,
          label: "Leadership",
          description: "Motivating and guiding others"
        },
        {
          id: "technicalSkills",
          type: "scale",
          required: true,
          min: 1,
          max: 5,
          label: "Technical Skills",
          description: "Using computers, software, and tools"
        },
        {
          id: "creativity",
          type: "scale",
          required: true,
          min: 1,
          max: 5,
          label: "Creativity",
          description: "Generating new ideas and thinking outside the box"
        },
        {
          id: "analyticalThinking",
          type: "scale",
          required: true,
          min: 1,
          max: 5,
          label: "Analytical Thinking",
          description: "Breaking down complex problems logically"
        },
        {
          id: "timeManagement",
          type: "scale",
          required: true,
          min: 1,
          max: 5,
          label: "Time Management",
          description: "Managing time and meeting deadlines effectively"
        },
        {
          id: "adaptability",
          type: "scale",
          required: true,
          min: 1,
          max: 5,
          label: "Adaptability",
          description: "Adjusting to new situations and learning quickly"
        }
      ]
    },
    {
      id: "section6",
      icon: "🎯",
      title: "Career Preferences",
      intro: null,
      questions: [
        {
          id: "careerPriorities",
          type: "checkbox",
          required: true,
          exactSelected: 3,
          label: "What matters MOST to you in a career?",
          helper: "(Select top 3)",
          options: [
            "High salary / Good earnings",
            "Work-life balance (time for family and hobbies)",
            "Making a positive social impact",
            "Continuous learning and growth opportunities",
            "Job security and stability",
            "Creative freedom and expression",
            "Working with people and helping them",
            "Working independently / alone",
            "Leadership and management opportunities",
            "International exposure and travel",
            "Prestige and recognition",
            "Fast-paced and challenging environment"
          ],
          allowOtherSpecify: false
        },
        {
          id: "dreamCareer",
          type: "text",
          required: true,
          min: 3,
          label: "What is your DREAM career?",
          helper: "(What would you love to do if anything were possible?)",
          placeholder: "What would you love to do if anything were possible?"
        },
        {
          id: "interestedCareers",
          type: "checkbox",
          required: true,
          minSelected: 1,
          label: "Which careers are you MOST interested in?",
          helper: "(Select all that apply)",
          options: [
            "Software Developer / Engineer",
            "Data Scientist / Analyst",
            "Doctor / Medical Professional",
            "Nurse / Healthcare Worker",
            "Teacher / Professor",
            "Business Owner / Entrepreneur",
            "Banker / Financial Analyst",
            "Graphic Designer / Artist",
            "Lawyer / Advocate",
            "Scientist / Researcher",
            "Government Officer / IAS",
            "Civil Engineer",
            "Mechanical Engineer",
            "Electrical Engineer",
            "Journalist / Writer",
            "Pilot / Aviation Professional",
            "Sports Professional",
            "Photographer / Videographer",
            "Social Worker",
            "Architect",
            "Psychologist / Counselor",
            "Marketing Professional",
            "Human Resources (HR) Professional",
            "Not sure yet",
            "Other (please specify)"
          ],
          allowOtherSpecify: true
        },
        {
          id: "backupCareer",
          type: "text",
          required: false,
          min: 0,
          label: "Do you have a backup career option in mind?",
          helper: "(Optional — just in case your first choice doesn't work out)",
          placeholder: "What would you do as a backup?"
        },
        {
          id: "careerConfidence",
          type: "radio",
          required: true,
          label: "How confident are you about your career choice?",
          helper: null,
          options: [
            "Very confident - I know exactly what I want",
            "Somewhat confident - I have a good idea",
            "Unsure - I'm still exploring options",
            "Completely undecided - I have no idea yet"
          ],
          allowOtherSpecify: false
        }
      ]
    },
    {
      id: "section7",
      icon: "➕",
      title: "Additional Questions (Optional)",
      intro: null,
      questions: [
        {
          id: "familyInfluence",
          type: "radio",
          required: false,
          label: "Does your family influence your career choice?",
          helper: null,
          options: [
            "Yes, they actively guide me",
            "Yes, they have certain expectations",
            "No, I'm free to choose on my own",
            "Not sure"
          ],
          allowOtherSpecify: false
        },
        {
          id: "counselingAccess",
          type: "radio",
          required: false,
          label: "Do you have access to career counseling at your institution?",
          helper: null,
          options: [
            "Yes, we have good counseling services",
            "Yes, but it's limited",
            "No, we don't have any",
            "Not sure"
          ],
          allowOtherSpecify: false
        },
        {
          id: "skillsToImprove",
          type: "checkbox",
          required: false,
          maxSelected: 3,
          label: "Which skills would you like to improve the most?",
          helper: "(Select top 3)",
          options: [
            "Problem Solving",
            "Communication Skills",
            "Leadership Skills",
            "Technical Skills",
            "Time Management",
            "Creative Thinking",
            "Teamwork",
            "Public Speaking",
            "Negotiation Skills",
            "Emotional Intelligence",
            "Critical Thinking"
          ],
          allowOtherSpecify: false
        },
        {
          id: "comments",
          type: "textarea",
          required: false,
          min: 0,
          label: "Any other thoughts, questions, or comments about your career journey?",
          helper: null,
          placeholder: "Share any additional thoughts..."
        }
      ]
    },
    {
      id: "section8",
      icon: "📧",
      title: "Stay Connected (Optional)",
      intro: "Would you like to receive personalized career recommendations based on your answers?",
      questions: [
        {
          id: "wantsRecommendations",
          type: "radio",
          required: false,
          label: null,
          helper: null,
          options: [
            "Yes! Please send me recommendations",
            "No, thanks"
          ],
          allowOtherSpecify: false
        },
        {
          id: "email",
          type: "email",
          required: false,
          min: 0,
          label: "Email",
          helper: null,
          placeholder: "your@email.com"
        }
      ]
    },
    {
      id: "section9",
      icon: "✅",
      title: null,
      intro: null,
      questions: []
    }
  ]
};