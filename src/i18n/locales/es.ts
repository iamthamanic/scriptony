export default {
  common: {
    welcome: "Bienvenido de nuevo",
    createAccount: "Crear cuenta",
    login: "Iniciar sesión",
    loginTo: "Inicia sesión en tu cuenta de Scriptony",
    joinCommunity: "Únete a la comunidad de Scriptony",
    continueWithGoogle: "Continuar con Google",
    or: "O",
    back: "Volver a la página principal",
    alreadyRegistered: "¿Ya estás registrado? Inicia sesión ahora",
    notRegistered: "¿Aún no tienes cuenta? Regístrate ahora",
    email: "Correo electrónico",
    password: "Contraseña",
    loading: "Cargando...",
    workspace: "Espacio de trabajo de {name}",
    accountSettings: "Configuración de la cuenta",
    newProject: "Nuevo proyecto",
    loggedInAs: "Conectado como {email}"
  },
  landing: {
    hero: {
      title: "Tu asistente para cada historia.",
      subtitle: "Ya sea película, serie, drama de audio o obra de teatro – Scriptony te ayuda a transformar ideas creativas en guiones estructurados. Visual. Intuitivo. Centrado en la historia.",
      start: "Comienza gratis con Google",
      login: "Iniciar sesión"
    },
    features: {
      title: "Cómo funciona Scriptony",
      startProject: "Iniciar proyecto",
      startProjectDesc: "Crea un nuevo proyecto con logline, medio y género.",
      chooseStructure: "Elegir estructura",
      chooseStructureDesc: "Elige p.ej. el viaje del héroe o estructura de 3 actos para tu trama.",
      visualizeScenes: "Visualizar escenas",
      visualizeScenesDesc: "Llena cada escena con imágenes, iluminación, sonido, tomas y diálogo."
    },
    media: {
      title: "Para todo tipo de historias",
      subtitle: "Scriptony es para todos los narradores creativos:",
      film: "Película y serie",
      audio: "Drama de audio y podcast",
      theater: "Teatro y escenario",
      game: "Historia de juego y novelas visuales"
    },
    featureList: {
      title: "Lo que Scriptony hace por ti",
      features: [
        "Editor de escenas con imágenes, código de tiempo y sonido",
        "Generador de estructura con plantillas de trama",
        "Lista de tomas y línea temporal visual",
        "Exportar como PDF, Markdown o ZIP",
        "Proyectos para película, audio o escenario",
        "Compatible con IA para generación visual"
      ]
    },
    comparison: {
      title: "Por qué Scriptony es único",
      subtitle: "En comparación con las herramientas de guión clásicas y plataformas de historias, Scriptony combina todos los aspectos creativos y técnicos en una sola herramienta:",
      features: {
        visualScene: "Edición visual de escenas",
        templates: "Plantillas de estructura (p.ej. viaje del héroe)",
        shots: "Tomas y ajustes de cámara",
        multimedia: "Multimedia (película, audio, escenario)",
        export: "Exportación PDF y ZIP",
        aiReady: "Compatible con IA (exportación a nivel de toma)"
      },
      competitors: {
        scriptBuddy: "Scriptony",
        finalDraft: "Final Draft",
        celtx: "Celtx",
        plottr: "Plottr",
        storyboardThat: "Storyboard That"
      }
    },
    pricing: {
      title: "Precios",
      free: {
        name: "Gratis",
        price: "0 €",
        features: ["5 proyectos", "Exportación PDF", "Plantillas de estructura de trama"]
      },
      pro: {
        name: "Pro",
        price: "9,99 € / mes",
        features: ["50 proyectos", "Exportación ZIP", "Módulo de blueprint de historia"]
      },
      studio: {
        name: "Studio",
        price: "19,99 € / mes",
        features: ["Ilimitado", "Función de equipo", "Versionado", "Asistente de IA"]
      },
      select: "Seleccionar"
    },
    footer: {
      startProject: "Comienza tu primer proyecto hoy",
      startFree: "Comenzar gratis",
      copyright: "© 2025 Scriptony. Todos los derechos reservados.",
      imprint: "Aviso legal",
      privacy: "Privacidad",
      contact: "Contacto"
    }
  },
  theme: {
    dark: "Modo oscuro",
    light: "Modo claro",
    system: "Configuración del sistema"
  },
  language: {
    de: "Alemán",
    en: "Inglés",
    es: "Español",
    fr: "Francés"
  },
  auth: {
    error: {
      login: "Error al iniciar sesión. Por favor, inténtalo de nuevo.",
      google: "Error al iniciar sesión con Google. Por favor, inténtalo de nuevo."
    },
    success: {
      login: "¡Inicio de sesión exitoso!"
    }
  },
  quotes: {
    categories: {
      film: "🎬 Cine y Teatro - Directores, Actores, Escritores",
      writers: "🖋️ Escritores y Autores",
      artists: "🖌️ Artistas, Diseñadores, Multidisciplinarios",
      general: "🎭 General sobre Creatividad, Trabajo y Vocación"
    },
    items: [
      {
        text: "No estoy seguro de ser un genio. Pero estoy seguro de que he trabajado duro.",
        author: "Stanley Kubrick, Director",
        source: "Colección de entrevistas \"Kubrick\", Michel Ciment",
        category: "film"
      },
      {
        text: "El arte es una mentira que nos hace dar cuenta de la verdad.",
        author: "Pablo Picasso, Pintor",
        source: "\"Picasso Speaks\", 1935",
        category: "artists"
      },
      {
        text: "Una película nunca está realmente terminada - simplemente se lanza en un cierto punto.",
        author: "George Lucas, Director y Guionista",
        source: "Entrevistas, Making of \"Star Wars\"",
        category: "film"
      },
      {
        text: "El actor es un atleta del alma.",
        author: "Antonin Artaud, Teórico del Teatro",
        source: "\"El Teatro y su Doble\", 1938",
        category: "film"
      },
      {
        text: "La historia es la moneda del entendimiento humano.",
        author: "Robert McKee, Gurú de Guiones",
        source: "\"Story: Substance, Structure, Style\"",
        category: "film"
      },
      {
        text: "La cámara nunca miente - a menos que la inclines.",
        author: "Orson Welles, Director",
        source: "Entrevistas",
        category: "film"
      },
      {
        text: "Todos tienen una historia. Solo hay que escuchar.",
        author: "Chimamanda Ngozi Adichie, Escritora",
        source: "TED Talk \"El peligro de una sola historia\"",
        category: "writers"
      },
      {
        text: "El teatro es el lugar donde el mundo se explica a sí mismo.",
        author: "Peter Brook, Director de Teatro",
        source: "\"El Espacio Vacío\", 1968",
        category: "film"
      },
      {
        text: "Escribo para descubrir lo que estoy pensando.",
        author: "Stephen King, Autor",
        source: "\"Mientras escribo\", 2000",
        category: "writers"
      },
      {
        text: "Un guión es una sugerencia - un poema es una orden.",
        author: "Jean-Luc Godard, Director",
        source: "Colección de entrevistas",
        category: "film"
      },
      {
        text: "La pluma es la lengua de la mente.",
        author: "Miguel de Cervantes, Escritor",
        source: "\"Don Quijote\", 1605",
        category: "writers"
      },
      {
        text: "Escribir es leerse a uno mismo.",
        author: "Max Frisch, Dramaturgo y Autor",
        source: "Diarios 1946–1949",
        category: "writers"
      },
      {
        text: "El comienzo es siempre un acto de valor.",
        author: "Johann Wolfgang von Goethe, Poeta",
        source: "\"Fausto I\", Introducción",
        category: "writers"
      },
      {
        text: "Narrar es resistencia.",
        author: "Elif Shafak, Autora",
        source: "\"La política de la ficción\" – Charla TED",
        category: "writers"
      },
      {
        text: "Cuando cuentas una historia, mantente fiel a la verdad. Pero cuéntala a lo grande.",
        author: "Tennessee Williams, Dramaturgo",
        source: "Entrevistas sobre \"El Zoológico de Cristal\"",
        category: "writers"
      },
      {
        text: "No escribo lo que sé. Escribo para descubrir lo que sé.",
        author: "Patricia Highsmith, Escritora de crimen",
        source: "Diarios, publicados en 2021",
        category: "writers"
      },
      {
        text: "El arte debería mostrar la herida y el cuchillo que la hizo.",
        author: "Bertolt Brecht, Dramaturgo",
        source: "Notas sobre el teatro épico",
        category: "writers"
      },
      {
        text: "La novela es la única herramienta con la que puedes capturar el tiempo.",
        author: "Virginia Woolf, Autora",
        source: "\"Una habitación propia\", 1929",
        category: "writers"
      },
      {
        text: "Solo puedo escribir cuando siento algo. De lo contrario, queda vacío.",
        author: "Ingeborg Bachmann, Poeta",
        source: "Entrevistas, Cartas",
        category: "writers"
      },
      {
        text: "Una buena historia no es una escapada - es un mapa.",
        author: "Neil Gaiman, Autor",
        source: "Charlas y \"La vista desde los asientos baratos\"",
        category: "writers"
      },
      {
        text: "El acto creativo es una rebelión contra el olvido.",
        author: "Ai Weiwei, Artista y Activista",
        source: "Entrevistas y \"Never Sorry\", 2012",
        category: "artists"
      },
      {
        text: "El diseño no es solo lo que se ve y se siente. El diseño es cómo funciona.",
        author: "Steve Jobs, Emprendedor y Visionario del Diseño",
        source: "\"El Diseño del iPhone\", 2007",
        category: "artists"
      },
      {
        text: "Cada línea debe ser una decisión.",
        author: "Paul Klee, Pintor",
        source: "\"Cuadernos\", 1921",
        category: "artists"
      },
      {
        text: "El arte comienza donde termina el plan.",
        author: "Yayoi Kusama, Artista",
        source: "Autobiografía",
        category: "artists"
      },
      {
        text: "Dibuja lo que sientes, no lo que ves.",
        author: "Edvard Munch, Pintor",
        source: "Diarios, 1890s",
        category: "artists"
      },
      {
        text: "Una imagen no lo dice todo - pero abre un espacio.",
        author: "Gerhard Richter, Pintor",
        source: "\"Texto – Escritos, Entrevistas y Cartas\"",
        category: "artists"
      },
      {
        text: "No pinto lo que veo - pinto lo que soy.",
        author: "Mark Rothko, Pintor",
        source: "\"La realidad del artista\", 2004",
        category: "artists"
      },
      {
        text: "La creatividad es la inteligencia divirtiéndose.",
        author: "Albert Einstein, Físico (¡pero pensador muy creativo!)",
        source: "Frecuentemente citado en cartas",
        category: "general"
      },
      {
        text: "Necesitas caos dentro de ti para dar a luz una estrella bailarina.",
        author: "Friedrich Nietzsche, Filósofo",
        source: "\"Así habló Zaratustra\", 1883",
        category: "general"
      },
      {
        text: "El arte es la forma más fuerte de esperanza.",
        author: "Banksy, Artista callejero",
        source: "Redes sociales / Catálogo de exposición",
        category: "general"
      }
    ]
  }
};
