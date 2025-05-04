
import { Genre, Project, Scene, TimeOfDay, ProjectType, EmotionalSignificance, Character } from "../types";
import { genres, projectTypes, timesOfDay, emotionalSignificances } from "./constants";

export const mockProjects: Project[] = [
  {
    id: "p1",
    title: "Neo Tokyo Adventures",
    type: "series",
    logline: "In a cyberpunk future, a group of teenage hackers uncover a conspiracy that threatens their city.",
    genres: ["action", "sci-fi", "adventure"],
    duration: 24, // per episode
    inspirations: ["Ghost in the Shell", "Akira", "Serial Experiments Lain"],
    coverImage: "/placeholder.svg",
    scenes: [],
    characters: [],
    createdAt: new Date("2025-04-28"),
    updatedAt: new Date("2025-05-01")
  },
  {
    id: "p2",
    title: "Spirit Academy",
    type: "movie",
    logline: "A young girl discovers she can see spirits and is invited to attend a magical academy.",
    genres: ["fantasy", "supernatural", "adventure"],
    duration: 110,
    inspirations: ["Spirited Away", "The Ancient Magus' Bride", "Little Witch Academia"],
    scenes: [],
    characters: [],
    createdAt: new Date("2025-03-15"),
    updatedAt: new Date("2025-04-20")
  }
];

export const mockScenes: Scene[] = [
  {
    id: "s1",
    projectId: "p1",
    episodeTitle: "The Digital Frontier",
    sceneNumber: 1,
    location: "Exterior - Neo Tokyo Skyline",
    timeOfDay: "night",
    timecodeStart: "00:00:30",
    timecodeEnd: "00:01:45",
    visualComposition: "Wide establishing shot of the neon-lit skyline of Neo Tokyo with massive holographic advertisements.",
    lighting: "High contrast with neon blue and purple highlights against dark silhouettes.",
    colorGrading: "Cool blue tones with vibrant neon accents.",
    soundDesign: "Ambient city noise, distant hover vehicles, electronic music fading in.",
    specialEffects: "Holographic billboards, flying cars, rain effects.",
    keyframeImage: "/placeholder.svg",
    description: "The camera slowly pans across the massive skyline of Neo Tokyo, showcasing towering skyscrapers with holographic advertisements. Rain pours down, reflecting the neon lights.",
    dialog: "",
    transitions: "Fade in from black. Later dissolves to street level.",
    productionNotes: "Reference Blade Runner 2049 for atmospheric quality.",
    emotionalSignificance: "introduction",
    emotionalNotes: "Sets the tone for the cyberpunk world and creates a sense of wonder and isolation.",
    characterIds: [],
    createdAt: new Date("2025-04-28"),
    updatedAt: new Date("2025-04-30")
  },
  {
    id: "s2",
    projectId: "p1",
    episodeTitle: "The Digital Frontier",
    sceneNumber: 2,
    location: "Interior - Miko's Apartment",
    timeOfDay: "morning",
    timecodeStart: "00:01:46",
    timecodeEnd: "00:03:15",
    visualComposition: "Medium shot of Miko waking up in her small, cluttered apartment. Technology everywhere.",
    lighting: "Soft morning light through blinds, creating shadow patterns.",
    colorGrading: "Warmer tones contrasting with the blue light from screens.",
    soundDesign: "Beeping alarm, humming computers, neighbor arguments through thin walls.",
    specialEffects: "Holographic computer interfaces, augmented reality overlay.",
    description: "Miko wakes up surrounded by computer equipment. She checks her messages on a holographic display appearing above her bed.",
    dialog: "MIKO (groggy): Another day in paradise... [looks at notification] Wait, what? That can't be right.",
    transitions: "Cut to closeup of the message.",
    productionNotes: "Actress should look sleep-deprived but alert once she sees the message.",
    emotionalSignificance: "buildup",
    characterIds: [],
    createdAt: new Date("2025-04-28"),
    updatedAt: new Date("2025-04-30")
  },
  {
    id: "s3",
    projectId: "p2",
    episodeTitle: "",
    sceneNumber: 1,
    location: "Exterior - Forest Path",
    timeOfDay: "day",
    timecodeStart: "00:00:15",
    timecodeEnd: "00:02:00",
    visualComposition: "Wide shot of Hana walking through a forest path. Sunlight filters through leaves.",
    lighting: "Natural dappled sunlight, ethereal and warm.",
    colorGrading: "Vivid greens with golden sunlight highlights.",
    soundDesign: "Forest ambient sounds, distant bird calls, subtle magical chimes when spirits appear.",
    specialEffects: "Subtle floating particles, semi-transparent spirit creatures among trees.",
    description: "Hana walks to school through her usual forest shortcut. Unlike other days, she begins to notice small spirits hiding among the trees, watching her.",
    dialog: "",
    transitions: "Open with fade in from white.",
    productionNotes: "Spirits should be barely visible at first, becoming clearer as the scene progresses.",
    emotionalSignificance: "introduction",
    emotionalNotes: "Establishes the magical realism and Hana's growing awareness.",
    characterIds: [],
    createdAt: new Date("2025-03-18"),
    updatedAt: new Date("2025-04-15")
  }
];

// Add references to scenes in projects
mockProjects[0].scenes = mockScenes.filter(scene => scene.projectId === "p1");
mockProjects[1].scenes = mockScenes.filter(scene => scene.projectId === "p2");

export const timeOfDayOptions: { label: string; value: TimeOfDay }[] = 
  timesOfDay.map(time => ({ 
    label: time.charAt(0).toUpperCase() + time.slice(1), 
    value: time 
  }));

export const emotionalSignificanceOptions: { label: string; value: EmotionalSignificance }[] = 
  emotionalSignificances.map(significance => ({ 
    label: significance.charAt(0).toUpperCase() + significance.slice(1), 
    value: significance 
  }));

export const genreOptions: { label: string; value: Genre }[] = [
  { label: "Action", value: "action" },
  { label: "Adventure", value: "adventure" },
  { label: "Comedy", value: "comedy" },
  { label: "Drama", value: "drama" },
  { label: "Fantasy", value: "fantasy" },
  { label: "Horror", value: "horror" },
  { label: "Mystery", value: "mystery" },
  { label: "Romance", value: "romance" },
  { label: "Sci-Fi", value: "sci-fi" },
  { label: "Slice of Life", value: "slice-of-life" },
  { label: "Supernatural", value: "supernatural" },
  { label: "Thriller", value: "thriller" }
];

export const projectTypeOptions: { label: string; value: ProjectType }[] = [
  { label: "Movie", value: "movie" },
  { label: "Series", value: "series" },
  { label: "Short Film", value: "short" }
];
