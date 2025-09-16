export type StudyPlanItem = {
  id: number;
  topic: string;
  status: "completed" | "in-progress" | "not-started";
  summary: string;
};

export type QuizQuestion = {
  id: number;
  question: string;
  type: "mcq" | "fib";
  options?: string[];
  answer: string;
  topic: string;
};

export type ProgressDataItem = {
  topic: string;
  mastery: number;
};

export const studyPlanItems: StudyPlanItem[] = [
  {
    id: 1,
    topic: "Introduction to Cellular Biology",
    status: "completed",
    summary:
      "This section covers the basic structure of prokaryotic and eukaryotic cells, including the functions of major organelles like the nucleus, mitochondria, and ribosomes. Key concepts include cell theory and the differences between cell types.",
  },
  {
    id: 2,
    topic: "Photosynthesis and Cellular Respiration",
    status: "in-progress",
    summary:
      "Focuses on the processes of energy conversion in cells. Photosynthesis converts light energy into chemical energy, while cellular respiration releases this energy to power cellular activities. Understand the inputs and outputs of both processes.",
  },
  {
    id: 3,
    topic: "Genetics and DNA Replication",
    status: "not-started",
    summary:
      "Explores the structure of DNA, the process of replication, and the principles of Mendelian genetics. This topic is foundational to understanding heredity and genetic variation.",
  },
  {
    id: 4,
    topic: "Mitosis and Meiosis",
    status: "not-started",
    summary:
      "Details the two types of cell division. Mitosis results in two identical daughter cells, crucial for growth and repair. Meiosis produces gametes for sexual reproduction, introducing genetic diversity.",
  },
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    topic: "Cellular Biology",
    question: "Which organelle is known as the 'powerhouse' of the cell?",
    type: "mcq",
    options: ["Nucleus", "Ribosome", "Mitochondrion", "Golgi Apparatus"],
    answer: "Mitochondrion",
  },
  {
    id: 2,
    topic: "Photosynthesis",
    question: "What are the main products of photosynthesis?",
    type: "mcq",
    options: [
      "Oxygen and Glucose",
      "Carbon Dioxide and Water",
      "ATP and NADP+",
      "Light and Chlorophyll",
    ],
    answer: "Oxygen and Glucose",
  },
  {
    id: 3,
    topic: "Genetics",
    question: "What is the primary function of DNA?",
    type: "mcq",
    options: [
      "Energy storage",
      "Catalyzing reactions",
      "Storing genetic information",
      "Transporting molecules",
    ],
    answer: "Storing genetic information",
  },
   {
    id: 4,
    topic: "Cellular Respiration",
    question: "Where in the cell does glycolysis occur?",
    type: "mcq",
    options: [
      "Mitochondrial matrix",
      "Cytoplasm",
      "Inner mitochondrial membrane",
      "Nucleus",
    ],
    answer: "Cytoplasm",
  },
];

export const progressData: ProgressDataItem[] = [
  { topic: "Cell Bio", mastery: 92 },
  { topic: "Photosyn", mastery: 78 },
  { topic: "Genetics", mastery: 45 },
  { topic: "Mitosis", mastery: 20 },
  { topic: "Ecology", mastery: 65 },
  { topic: "Evolution", mastery: 88 },
];
