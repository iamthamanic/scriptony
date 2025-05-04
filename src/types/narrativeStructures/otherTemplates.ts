
import { StructureTemplate } from './types';

/**
 * Save the Cat narrative structure template
 */
export const saveTheCatTemplate: StructureTemplate = {
  id: 'save-the-cat',
  name: 'Save the Cat',
  description: 'Blake Snyders 15-Beat Struktur für erfolgreiche Drehbücher.',
  scenes: [
    {
      sceneNumber: 1,
      location: "Opening Image",
      description: "Ein Bild, das den Ausgangszustand der Geschichte darstellt.",
      emotionalSignificance: "introduction"
    },
    {
      sceneNumber: 2,
      location: "Theme Stated",
      description: "Eine Aussage über das zentrale Thema der Geschichte.",
      emotionalSignificance: "introduction"
    },
    {
      sceneNumber: 3,
      location: "Setup",
      description: "Einführung der Hauptfigur und ihrer Welt.",
      emotionalSignificance: "introduction"
    },
    {
      sceneNumber: 4,
      location: "Catalyst",
      description: "Das auslösende Ereignis, das die Geschichte in Gang setzt.",
      emotionalSignificance: "turning-point"
    },
    {
      sceneNumber: 5,
      location: "Debate",
      description: "Der Held zögert, die Herausforderung anzunehmen.",
      emotionalSignificance: "buildup"
    },
    {
      sceneNumber: 6,
      location: "Break into Two",
      description: "Der Held entscheidet sich, die Herausforderung anzunehmen.",
      emotionalSignificance: "turning-point"
    },
    {
      sceneNumber: 7,
      location: "B Story",
      description: "Beginn einer Nebenhandlung, oft eine Liebesgeschichte.",
      emotionalSignificance: "buildup"
    },
    {
      sceneNumber: 8,
      location: "Fun and Games",
      description: "Der 'Kern' des Films, in dem das Versprechen des Konzepts erfüllt wird.",
      emotionalSignificance: "buildup"
    },
    {
      sceneNumber: 9,
      location: "Midpoint",
      description: "Ein wichtiger Wendepunkt in der Mitte des Films.",
      emotionalSignificance: "turning-point"
    },
    {
      sceneNumber: 10,
      location: "Bad Guys Close In",
      description: "Die Antagonisten erhöhen den Druck, und Zweifel tauchen auf.",
      emotionalSignificance: "buildup"
    },
    {
      sceneNumber: 11,
      location: "All Is Lost",
      description: "Der tiefste Punkt für den Helden.",
      emotionalSignificance: "climax"
    },
    {
      sceneNumber: 12,
      location: "Dark Night of the Soul",
      description: "Der Held steht am Abgrund und muss sich neu finden.",
      emotionalSignificance: "climax"
    },
    {
      sceneNumber: 13,
      location: "Break into Three",
      description: "Der Held findet eine neue Lösung und geht zum Finale über.",
      emotionalSignificance: "turning-point"
    },
    {
      sceneNumber: 14,
      location: "Finale",
      description: "Der Held setzt seinen Plan um und erreicht sein Ziel.",
      emotionalSignificance: "finale"
    },
    {
      sceneNumber: 15,
      location: "Final Image",
      description: "Ein Bild, das zeigt, wie sich die Welt verändert hat.",
      emotionalSignificance: "resolution"
    }
  ]
};

export const storyCircleTemplate: StructureTemplate = {
  id: 'story-circle',
  name: 'Dan Harmon\'s Story Circle',
  description: 'Ein zyklisches 8-Stufen-Modell, basierend auf der Heldenreise.',
  scenes: [
    {
      sceneNumber: 1,
      location: "You (Comfort Zone)",
      description: "Einführung des Protagonisten in seiner gewohnten Umgebung.",
      emotionalSignificance: "introduction"
    },
    {
      sceneNumber: 2,
      location: "Need (Unerfülltes Bedürfnis)",
      description: "Der Protagonist spürt ein unerfülltes Bedürfnis oder Verlangen.",
      emotionalSignificance: "buildup"
    },
    {
      sceneNumber: 3,
      location: "Go (Überschreitung der Schwelle)",
      description: "Der Protagonist verlässt seine Komfortzone und betritt die unbekannte Welt.",
      emotionalSignificance: "turning-point"
    },
    {
      sceneNumber: 4,
      location: "Search (Suche und Anpassung)",
      description: "Der Protagonist passt sich an die neue Situation an und sucht nach Lösungen.",
      emotionalSignificance: "buildup"
    },
    {
      sceneNumber: 5,
      location: "Find (Entdeckung)",
      description: "Der Protagonist findet, wonach er gesucht hat, aber mit Komplikationen.",
      emotionalSignificance: "turning-point"
    },
    {
      sceneNumber: 6,
      location: "Take (Preis zahlen)",
      description: "Der Protagonist muss einen Preis für seine Entdeckung zahlen.",
      emotionalSignificance: "climax"
    },
    {
      sceneNumber: 7,
      location: "Return (Rückkehr)",
      description: "Der Protagonist kehrt mit dem Erlernten zurück in seine ursprüngliche Welt.",
      emotionalSignificance: "resolution"
    },
    {
      sceneNumber: 8,
      location: "Change (Veränderung)",
      description: "Die Welt (oder der Protagonist) hat sich durch die Reise verändert.",
      emotionalSignificance: "finale"
    }
  ]
};

export const tragedyTemplate: StructureTemplate = {
  id: 'tragedy',
  name: 'Tragic Structure',
  description: 'Klassische Struktur für Tragödien mit dem Fall des Protagonisten',
  scenes: [
    {
      sceneNumber: 1,
      location: "Hybris",
      description: "Der tragische Held zeigt Überheblichkeit oder Arroganz.",
      emotionalSignificance: "introduction"
    },
    {
      sceneNumber: 2,
      location: "Nemesis",
      description: "Die Gegenkraft oder der Antagonist tritt auf.",
      emotionalSignificance: "buildup"
    },
    {
      sceneNumber: 3,
      location: "Hamartia",
      description: "Der tragische Fehler oder die Schwäche des Helden wird offensichtlich.",
      emotionalSignificance: "turning-point"
    },
    {
      sceneNumber: 4,
      location: "Peripeteia",
      description: "Die Wende, bei der das Schicksal des Helden zu kippen beginnt.",
      emotionalSignificance: "climax"
    },
    {
      sceneNumber: 5,
      location: "Anagnorisis",
      description: "Moment der Erkenntnis, in dem der Held seinen Fehler begreift.",
      emotionalSignificance: "turning-point"
    },
    {
      sceneNumber: 6,
      location: "Katastrophe",
      description: "Der endgültige Fall des Helden und die Konsequenzen seiner Handlungen.",
      emotionalSignificance: "finale"
    }
  ]
};

export const cyclicalTemplate: StructureTemplate = {
  id: 'cyclical',
  name: 'Cyclical Structure',
  description: 'Eine zyklische Erzählstruktur, bei der die Geschichte zum Ausgangspunkt zurückkehrt',
  scenes: [
    {
      sceneNumber: 1,
      location: "Ausgangspunkt",
      description: "Der Startpunkt der Geschichte, zu dem sie am Ende zurückkehren wird.",
      emotionalSignificance: "introduction"
    },
    {
      sceneNumber: 2,
      location: "Aufbruch",
      description: "Der Protagonist verlässt seinen Ausgangspunkt.",
      emotionalSignificance: "buildup"
    },
    {
      sceneNumber: 3,
      location: "Erste Herausforderung",
      description: "Die erste große Herausforderung auf dem Weg.",
      emotionalSignificance: "buildup"
    },
    {
      sceneNumber: 4,
      location: "Zentrale Krise",
      description: "Der Wendepunkt der Geschichte und größte Herausforderung.",
      emotionalSignificance: "climax"
    },
    {
      sceneNumber: 5,
      location: "Veränderung",
      description: "Der Protagonist verändert sich durch die Erfahrungen.",
      emotionalSignificance: "turning-point"
    },
    {
      sceneNumber: 6,
      location: "Rückkehr",
      description: "Rückkehr zum Ausgangspunkt, aber mit neuer Perspektive.",
      emotionalSignificance: "resolution"
    },
    {
      sceneNumber: 7,
      location: "Neuer Zyklus",
      description: "Andeutung eines neuen Beginns oder Wiederholung des Zyklus.",
      emotionalSignificance: "finale"
    }
  ]
};

// New templates
export const fiveActTemplate: StructureTemplate = {
  id: 'five-act',
  name: 'Fünf-Akt-Struktur (Freytag)',
  description: 'Klassische Dramenstruktur nach Gustav Freytag mit fünf Akten',
  scenes: [
    {
      sceneNumber: 1,
      location: "Exposition",
      description: "Einführung der Charaktere, des Settings und des grundlegenden Konflikts.",
      emotionalSignificance: "introduction"
    },
    {
      sceneNumber: 2,
      location: "Steigende Handlung",
      description: "Die Handlung nimmt an Intensität zu, Konflikte werden komplexer.",
      emotionalSignificance: "buildup"
    },
    {
      sceneNumber: 3,
      location: "Höhepunkt",
      description: "Der zentrale Wendepunkt des Stücks, maximale Intensität des Konflikts.",
      emotionalSignificance: "climax"
    },
    {
      sceneNumber: 4,
      location: "Fallende Handlung",
      description: "Die Konsequenzen des Höhepunkts entfalten sich, Spannung nimmt ab.",
      emotionalSignificance: "turning-point"
    },
    {
      sceneNumber: 5,
      location: "Katastrophe",
      description: "Die finale Auflösung, entweder tragisch oder versöhnlich.",
      emotionalSignificance: "finale"
    }
  ]
};

export const seasonArcTemplate: StructureTemplate = {
  id: 'season-arc',
  name: 'Serienbogen (Staffelstruktur)',
  description: 'Übergreifender Handlungsbogen für eine komplette Staffel',
  scenes: [
    {
      sceneNumber: 1,
      location: "Pilotkonfiguration",
      description: "Einführung der Hauptfiguren, des Settings und des zentralen Konflikts.",
      emotionalSignificance: "introduction"
    },
    {
      sceneNumber: 2,
      location: "Etablierung des Staffelbogens",
      description: "Frühzeitige Definition der saisonübergreifenden Handlungsstränge.",
      emotionalSignificance: "introduction"
    },
    {
      sceneNumber: 3,
      location: "Erste Komplikation",
      description: "Erste größere Herausforderung für die Hauptfiguren.",
      emotionalSignificance: "buildup"
    },
    {
      sceneNumber: 4,
      location: "Midseason-Wendepunkt",
      description: "Bedeutender Wendepunkt in der Mitte der Staffel, der die Dynamik verändert.",
      emotionalSignificance: "turning-point"
    },
    {
      sceneNumber: 5,
      location: "Steigende Spannung",
      description: "Die Konflikte werden intensiver, die Einsätze höher.",
      emotionalSignificance: "buildup"
    },
    {
      sceneNumber: 6,
      location: "Vorbereitung auf das Finale",
      description: "Zusammenführung der Handlungsstränge zur Vorbereitung auf den Höhepunkt.",
      emotionalSignificance: "buildup"
    },
    {
      sceneNumber: 7,
      location: "Staffelhöhepunkt",
      description: "Dramatischer Höhepunkt der Staffel, an dem die Hauptkonflikte kulminieren.",
      emotionalSignificance: "climax"
    },
    {
      sceneNumber: 8,
      location: "Staffelfinale mit Cliffhanger",
      description: "Teilweise Auflösung mit offenem Ende für die nächste Staffel.",
      emotionalSignificance: "finale"
    }
  ]
};

export const proceduralTemplate: StructureTemplate = {
  id: 'procedural',
  name: 'Procedural-Loop',
  description: 'Sich wiederholendes Format mit "Fall der Woche"',
  scenes: [
    {
      sceneNumber: 1,
      location: "Präsentation des Falls/Problems",
      description: "Einführung des zentralen Problems oder Falls der Episode.",
      emotionalSignificance: "introduction"
    },
    {
      sceneNumber: 2,
      location: "Team-Briefing/Versammlung",
      description: "Die Hauptfiguren besprechen den Fall und planen ihr Vorgehen.",
      emotionalSignificance: "introduction"
    },
    {
      sceneNumber: 3,
      location: "Erste Untersuchung",
      description: "Erste Schritte zur Lösung des Problems, sammeln erster Hinweise.",
      emotionalSignificance: "buildup"
    },
    {
      sceneNumber: 4,
      location: "Unerwartete Komplikation",
      description: "Ein Hindernis oder eine unerwartete Wendung erschwert die Lösung.",
      emotionalSignificance: "turning-point"
    },
    {
      sceneNumber: 5,
      location: "Vertiefte Untersuchung",
      description: "Tiefere Erforschung der Hintergründe und verborgenen Zusammenhänge.",
      emotionalSignificance: "buildup"
    },
    {
      sceneNumber: 6,
      location: "Durchbruch",
      description: "Entscheidende Erkenntnis, die zur Lösung führt.",
      emotionalSignificance: "turning-point"
    },
    {
      sceneNumber: 7,
      location: "Konfrontation/Auflösung",
      description: "Konfrontation mit dem Täter oder Lösung des Problems.",
      emotionalSignificance: "climax"
    },
    {
      sceneNumber: 8,
      location: "Abschluss & Team-Reflexion",
      description: "Reflexion über den Fall und seine Auswirkungen auf die Charaktere.",
      emotionalSignificance: "resolution"
    },
    {
      sceneNumber: 9,
      location: "B-Plot-Abschluss",
      description: "Auflösung des persönlichen Nebenhandlungsstrangs der Episode.",
      emotionalSignificance: "resolution"
    },
    {
      sceneNumber: 10,
      location: "Vorschau auf kommende Episode",
      description: "Andeutung des nächsten Falls oder Problems.",
      emotionalSignificance: "finale"
    }
  ]
};

export const characterArcTemplate: StructureTemplate = {
  id: 'character-arc',
  name: 'Staffel mit Charakterbogen',
  description: 'Fokus auf Entwicklung der Hauptfiguren über die Staffel hinweg',
  scenes: [
    {
      sceneNumber: 1,
      location: "Charakterstatus Quo",
      description: "Darstellung des Ausgangszustands der Hauptfigur und ihrer Schwächen.",
      emotionalSignificance: "introduction"
    },
    {
      sceneNumber: 2,
      location: "Auslösender Vorfall",
      description: "Ereignis, das den Charakter zwingt, sich zu verändern.",
      emotionalSignificance: "introduction"
    },
    {
      sceneNumber: 3,
      location: "Widerstand gegen Veränderung",
      description: "Der Charakter wehrt sich gegen die notwendige Veränderung.",
      emotionalSignificance: "buildup"
    },
    {
      sceneNumber: 4,
      location: "Erster Transformationsversuch",
      description: "Erster Versuch zur Veränderung, der teilweise misslingt.",
      emotionalSignificance: "turning-point"
    },
    {
      sceneNumber: 5,
      location: "Midseason-Krise",
      description: "Tiefpunkt, an dem alte Verhaltensmuster zurückkehren.",
      emotionalSignificance: "climax"
    },
    {
      sceneNumber: 6,
      location: "Neue Entschlossenheit",
      description: "Erneute Entscheidung zur Veränderung mit größerer Überzeugung.",
      emotionalSignificance: "turning-point"
    },
    {
      sceneNumber: 7,
      location: "Unterstützer und Gegenspieler",
      description: "Charaktere, die die Entwicklung unterstützen oder behindern.",
      emotionalSignificance: "buildup"
    },
    {
      sceneNumber: 8,
      location: "Finale Prüfung",
      description: "Entscheidende Situation, die zeigt, ob die Veränderung gelungen ist.",
      emotionalSignificance: "climax"
    },
    {
      sceneNumber: 9,
      location: "Neue Identität",
      description: "Der Charakter etabliert seinen neuen, veränderten Zustand.",
      emotionalSignificance: "resolution"
    },
    {
      sceneNumber: 10,
      location: "Ausblick auf weiteren Weg",
      description: "Andeutung zukünftiger Herausforderungen für den veränderten Charakter.",
      emotionalSignificance: "finale"
    }
  ]
};

export const cyclicBeckettTemplate: StructureTemplate = {
  id: 'cyclic-beckett',
  name: 'Zyklische Struktur (Beckett)',
  description: 'Sich wiederholende Ereignisse, Kreisstruktur, absurdes Theater',
  scenes: [
    {
      sceneNumber: 1,
      location: "Grundsituation",
      description: "Etablierung einer repetitiven oder statischen Grundsituation.",
      emotionalSignificance: "introduction"
    },
    {
      sceneNumber: 2,
      location: "Routine/Ritual",
      description: "Darstellung wiederkehrender Handlungsmuster oder Rituale.",
      emotionalSignificance: "buildup"
    },
    {
      sceneNumber: 3,
      location: "Störung",
      description: "Eine kleine Abweichung vom gewohnten Muster tritt auf.",
      emotionalSignificance: "turning-point"
    },
    {
      sceneNumber: 4,
      location: "Versuch der Änderung",
      description: "Figuren versuchen, aus dem Zyklus auszubrechen, ohne Erfolg.",
      emotionalSignificance: "climax"
    },
    {
      sceneNumber: 5,
      location: "Resignation/Akzeptanz",
      description: "Einsicht in die Unveränderlichkeit der Situation.",
      emotionalSignificance: "turning-point"
    },
    {
      sceneNumber: 6,
      location: "Rückkehr zum Anfang",
      description: "Wiedereinsetzung des ursprünglichen Zustands, evtl. mit subtilen Unterschieden.",
      emotionalSignificance: "resolution"
    }
  ]
};

export const episodeBretchTemplate: StructureTemplate = {
  id: 'episode-brecht',
  name: 'Episodenstruktur (Brecht)',
  description: 'Nicht-aristotelische Erzählstruktur mit eigenständigen Szenen und Verfremdungseffekten',
  scenes: [
    {
      sceneNumber: 1,
      location: "Prolog/Ankündigung",
      description: "Direkte Ansprache ans Publikum oder Ankündigung des Themas.",
      emotionalSignificance: "introduction"
    },
    {
      sceneNumber: 2,
      location: "Exposition der sozialen Umstände",
      description: "Darstellung der gesellschaftlichen Verhältnisse und Konflikte.",
      emotionalSignificance: "introduction"
    },
    {
      sceneNumber: 3,
      location: "Erste Episode",
      description: "Eigenständige Szene, die einen Aspekt des Themas beleuchtet.",
      emotionalSignificance: "buildup"
    },
    {
      sceneNumber: 4,
      location: "Kommentar/Song",
      description: "Reflexion über die gezeigte Episode, oft durch Lieder oder direkte Kommentare.",
      emotionalSignificance: "turning-point"
    },
    {
      sceneNumber: 5,
      location: "Zweite Episode",
      description: "Weitere eigenständige Szene zu einem anderen Aspekt des Themas.",
      emotionalSignificance: "buildup"
    },
    {
      sceneNumber: 6,
      location: "Verfremdungseffekt",
      description: "Bewusster Bruch der Theaterillusion zur kritischen Distanzierung.",
      emotionalSignificance: "turning-point"
    },
    {
      sceneNumber: 7,
      location: "Dritte Episode",
      description: "Zuspitzung des Konflikts in einer weiteren eigenständigen Szene.",
      emotionalSignificance: "climax"
    },
    {
      sceneNumber: 8,
      location: "Offenes Ende/Appell",
      description: "Keine vollständige Auflösung, sondern Aufforderung zum Nachdenken.",
      emotionalSignificance: "finale"
    }
  ]
};

export const threeActAudioTemplate: StructureTemplate = {
  id: 'three-act-audio',
  name: 'Drei-Akt (hörspieloptimiert)',
  description: 'An das Hörmedium angepasste Drei-Akt-Struktur',
  scenes: [
    {
      sceneNumber: 1,
      location: "Akustische Eröffnung",
      description: "Charakteristischer Sound oder Musik zur Etablierung der Atmosphäre.",
      emotionalSignificance: "introduction"
    },
    {
      sceneNumber: 2,
      location: "Exposition durch Dialog",
      description: "Einführung der Hauptfiguren und des Settings durch Dialoge.",
      emotionalSignificance: "introduction"
    },
    {
      sceneNumber: 3,
      location: "Auslösender Konflikt",
      description: "Akustisch dramatisiertes Ereignis, das die Handlung in Gang setzt.",
      emotionalSignificance: "turning-point"
    },
    {
      sceneNumber: 4,
      location: "Erster Akt: Komplikation",
      description: "Die Hauptfigur wird mit ersten Hindernissen konfrontiert.",
      emotionalSignificance: "buildup"
    },
    {
      sceneNumber: 5,
      location: "Klangliche Überleitung",
      description: "Akustisches Intermezzo zur Überleitung in den zweiten Akt.",
      emotionalSignificance: "turning-point"
    },
    {
      sceneNumber: 6,
      location: "Zweiter Akt: Konfrontation",
      description: "Vertiefung des Konflikts und Steigerung der Spannung.",
      emotionalSignificance: "buildup"
    },
    {
      sceneNumber: 7,
      location: "Akustischer Höhepunkt",
      description: "Dramatischer Wendepunkt mit intensiver Soundgestaltung.",
      emotionalSignificance: "climax"
    },
    {
      sceneNumber: 8,
      location: "Dritter Akt: Auflösung",
      description: "Lösung des Konflikts und Abschluss der Handlungsstränge.",
      emotionalSignificance: "resolution"
    },
    {
      sceneNumber: 9,
      location: "Akustischer Epilog",
      description: "Abschließende Klänge oder Stimmen, die einen Ausblick geben.",
      emotionalSignificance: "finale"
    }
  ]
};

export const narratorScenesTemplate: StructureTemplate = {
  id: 'narrator-scenes',
  name: 'Erzähler + Szenen-Mix',
  description: 'Wechsel zwischen Erzählerstimme und szenischen Elementen',
  scenes: [
    {
      sceneNumber: 1,
      location: "Erzähler: Einführung",
      description: "Die Erzählerstimme führt in die Geschichte und die Charaktere ein.",
      emotionalSignificance: "introduction"
    },
    {
      sceneNumber: 2,
      location: "Szenischer Einstieg",
      description: "Erste dialogische Szene mit den Hauptfiguren.",
      emotionalSignificance: "introduction"
    },
    {
      sceneNumber: 3,
      location: "Erzähler: Überleitung",
      description: "Überleitung zur nächsten Szene mit zusätzlichen Informationen.",
      emotionalSignificance: "buildup"
    },
    {
      sceneNumber: 4,
      location: "Szenische Entwicklung",
      description: "Dialogszene, die den Konflikt etabliert.",
      emotionalSignificance: "buildup"
    },
    {
      sceneNumber: 5,
      location: "Erzähler: Hintergrund",
      description: "Zusätzliche Informationen über Charaktere oder Setting.",
      emotionalSignificance: "buildup"
    },
    {
      sceneNumber: 6,
      location: "Szenischer Höhepunkt",
      description: "Dialogische Darstellung des Höhepunkts ohne Erzählereingriff.",
      emotionalSignificance: "climax"
    },
    {
      sceneNumber: 7,
      location: "Erzähler: Konsequenzen",
      description: "Reflexion über die Ereignisse und ihre Bedeutung.",
      emotionalSignificance: "turning-point"
    },
    {
      sceneNumber: 8,
      location: "Szenische Auflösung",
      description: "Finale Szene mit Dialog zur Auflösung des Konflikts.",
      emotionalSignificance: "resolution"
    },
    {
      sceneNumber: 9,
      location: "Erzähler: Epilog",
      description: "Abschließende Gedanken und Ausblick des Erzählers.",
      emotionalSignificance: "finale"
    }
  ]
};

export const innerMonologueTemplate: StructureTemplate = {
  id: 'inner-monologue',
  name: 'Innerer Monolog / Solo-Stück',
  description: 'Fokus auf Gedankenwelt und inneren Dialog einer Hauptfigur',
  scenes: [
    {
      sceneNumber: 1,
      location: "Gedankeneinstieg",
      description: "Einführung in die Gedankenwelt und aktuelle Situation der Hauptfigur.",
      emotionalSignificance: "introduction"
    },
    {
      sceneNumber: 2,
      location: "Erinnerung 1",
      description: "Erste wichtige Erinnerung, die den Charakter geprägt hat.",
      emotionalSignificance: "buildup"
    },
    {
      sceneNumber: 3,
      location: "Gegenwartsproblem",
      description: "Darstellung des aktuellen inneren Konflikts.",
      emotionalSignificance: "turning-point"
    },
    {
      sceneNumber: 4,
      location: "Erinnerung 2",
      description: "Weitere Erinnerung, die zum Verständnis des Konflikts beiträgt.",
      emotionalSignificance: "buildup"
    },
    {
      sceneNumber: 5,
      location: "Innerer Dialog/Zwiespalt",
      description: "Auseinandersetzung widerstreitender Gedanken oder Persönlichkeitsanteile.",
      emotionalSignificance: "climax"
    },
    {
      sceneNumber: 6,
      location: "Selbsterkenntnis",
      description: "Moment der Einsicht oder Erkenntnis.",
      emotionalSignificance: "turning-point"
    },
    {
      sceneNumber: 7,
      location: "Entscheidung",
      description: "Innerer Entschluss zur Lösung des Konflikts oder Akzeptanz.",
      emotionalSignificance: "resolution"
    },
    {
      sceneNumber: 8,
      location: "Ausblick",
      description: "Gedanklicher Ausblick auf die Zukunft oder Konsequenzen.",
      emotionalSignificance: "finale"
    }
  ]
};

export const audioSeriesTemplate: StructureTemplate = {
  id: 'audio-series',
  name: 'Serienstruktur mit Cliffhangern',
  description: 'Episodischer Aufbau mit Spannungsbögen am Ende jeder Folge',
  scenes: [
    {
      sceneNumber: 1,
      location: "Rückblick/Intro",
      description: "Kurze Zusammenfassung vorheriger Ereignisse oder markantes Intro.",
      emotionalSignificance: "introduction"
    },
    {
      sceneNumber: 2,
      location: "Einstieg aktuelle Folge",
      description: "Etablierung des Hauptthemas oder Problems dieser Episode.",
      emotionalSignificance: "introduction"
    },
    {
      sceneNumber: 3,
      location: "A-Plot Entwicklung",
      description: "Entwicklung des Haupthandlungsstrangs der Folge.",
      emotionalSignificance: "buildup"
    },
    {
      sceneNumber: 4,
      location: "B-Plot Einführung",
      description: "Etablierung eines Nebenhandlungsstrangs.",
      emotionalSignificance: "buildup"
    },
    {
      sceneNumber: 5,
      location: "A-Plot Komplikation",
      description: "Unerwartetes Hindernis im Haupthandlungsstrang.",
      emotionalSignificance: "turning-point"
    },
    {
      sceneNumber: 6,
      location: "B-Plot Entwicklung",
      description: "Weiterentwicklung des Nebenhandlungsstrangs.",
      emotionalSignificance: "buildup"
    },
    {
      sceneNumber: 7,
      location: "A-Plot Höhepunkt",
      description: "Klimax des Haupthandlungsstrangs.",
      emotionalSignificance: "climax"
    },
    {
      sceneNumber: 8,
      location: "B-Plot Auflösung",
      description: "Abschluss des Nebenhandlungsstrangs, oft mit Verbindung zum Hauptstrang.",
      emotionalSignificance: "resolution"
    },
    {
      sceneNumber: 9,
      location: "Episode-Abschluss",
      description: "Teilweise Auflösung des Hauptkonflikts dieser Folge.",
      emotionalSignificance: "resolution"
    },
    {
      sceneNumber: 10,
      location: "Cliffhanger",
      description: "Spannungsvolle offene Situation als Überleitung zur nächsten Folge.",
      emotionalSignificance: "finale"
    }
  ]
};

export const novelThreeActTemplate: StructureTemplate = {
  id: 'novel-three-act',
  name: 'Drei-Akt-Romanstruktur',
  description: 'Klassische Romanstruktur mit Anfang, Mittelteil und Ende',
  scenes: [
    {
      sceneNumber: 1,
      location: "Exposition",
      description: "Einführung der Hauptfigur, des Settings und der normalen Welt.",
      emotionalSignificance: "introduction"
    },
    {
      sceneNumber: 2,
      location: "Auslösender Vorfall",
      description: "Ereignis, das den Protagonisten aus seiner gewohnten Welt reißt.",
      emotionalSignificance: "turning-point"
    },
    {
      sceneNumber: 3,
      location: "Erste Schwelle",
      description: "Der Protagonist überschreitet die Schwelle zur unbekannten Welt.",
      emotionalSignificance: "turning-point"
    },
    {
      sceneNumber: 4,
      location: "Steigende Handlung",
      description: "Der Protagonist begegnet Verbündeten und Feinden, lernt die neuen Regeln.",
      emotionalSignificance: "buildup"
    },
    {
      sceneNumber: 5,
      location: "Mittelpunkt",
      description: "Wendepunkt in der Mitte der Geschichte, oft eine wichtige Enthüllung.",
      emotionalSignificance: "turning-point"
    },
    {
      sceneNumber: 6,
      location: "Komplikationen",
      description: "Rückschläge und zunehmende Hindernisse für den Protagonisten.",
      emotionalSignificance: "buildup"
    },
    {
      sceneNumber: 7,
      location: "Tiefpunkt",
      description: "Der dunkelste Moment, an dem alles verloren scheint.",
      emotionalSignificance: "climax"
    },
    {
      sceneNumber: 8,
      location: "Zweite Schwelle",
      description: "Der Protagonist überwindet die zweite große Hürde, um zum Finale zu gelangen.",
      emotionalSignificance: "turning-point"
    },
    {
      sceneNumber: 9,
      location: "Klimax",
      description: "Die finale Konfrontation mit dem Antagonisten oder Problem.",
      emotionalSignificance: "climax"
    },
    {
      sceneNumber: 10,
      location: "Auflösung",
      description: "Abschluss der Handlungsstränge und Rückkehr in eine veränderte Welt.",
      emotionalSignificance: "resolution"
    }
  ]
};

export const sevenPointTemplate: StructureTemplate = {
  id: 'seven-point',
  name: 'Sieben-Punkt-Modell (Dan Wells)',
  description: 'Sieben Schlüsselszenen als Gerüst für die Geschichte',
  scenes: [
    {
      sceneNumber: 1,
      location: "Endpunkt",
      description: "Das Ziel oder der Endzustand, den der Protagonist erreichen will.",
      emotionalSignificance: "introduction"
    },
    {
      sceneNumber: 2,
      location: "Startpunkt",
      description: "Der Ausgangspunkt des Protagonisten, oft das Gegenteil des Endpunkts.",
      emotionalSignificance: "introduction"
    },
    {
      sceneNumber: 3,
      location: "Pinch Point 1",
      description: "Erste große Herausforderung oder Begegnung mit dem Antagonisten.",
      emotionalSignificance: "buildup"
    },
    {
      sceneNumber: 4,
      location: "Midpoint",
      description: "Wendepunkt in der Mitte, an dem der Protagonist aktiv wird.",
      emotionalSignificance: "turning-point"
    },
    {
      sceneNumber: 5,
      location: "Pinch Point 2",
      description: "Zweite große Herausforderung, oft mit einem scheinbaren Scheitern.",
      emotionalSignificance: "climax"
    },
    {
      sceneNumber: 6,
      location: "Pre-Climax Reversal",
      description: "Wendung vor dem Höhepunkt, die den Protagonisten zum Endkampf führt.",
      emotionalSignificance: "turning-point"
    },
    {
      sceneNumber: 7,
      location: "Resolution",
      description: "Die Erreichung (oder Nichterreichung) des Endpunkts und die Konsequenzen.",
      emotionalSignificance: "resolution"
    }
  ]
};

export const snowflakeTemplate: StructureTemplate = {
  id: 'snowflake',
  name: 'Snowflake-Methode',
  description: 'Vom einfachen Konzept zum komplexen Roman durch iteratives Erweitern',
  scenes: [
    {
      sceneNumber: 1,
      location: "Zentrale Prämisse",
      description: "Ein-Satz-Zusammenfassung der gesamten Geschichte.",
      emotionalSignificance: "introduction"
    },
    {
      sceneNumber: 2,
      location: "Erweiterte Prämisse",
      description: "Ein-Absatz-Zusammenfassung mit Anfang, Mittelteil, Katastrophe und Ende.",
      emotionalSignificance: "introduction"
    },
    {
      sceneNumber: 3,
      location: "Hauptfiguren-Setup",
      description: "Definition der wichtigsten Charaktere und ihrer Entwicklungsbögen.",
      emotionalSignificance: "introduction"
    },
    {
      sceneNumber: 4,
      location: "Erweiterte Synopsis",
      description: "Eine Seite Zusammenfassung, die aus jedem Satz des Absatzes einen eigenen Absatz macht.",
      emotionalSignificance: "buildup"
    },
    {
      sceneNumber: 5,
      location: "Erweiterte Charakterbeschreibungen",
      description: "Ausführliche Beschreibungen der Hauptfiguren, ihrer Motivation und Entwicklung.",
      emotionalSignificance: "buildup"
    },
    {
      sceneNumber: 6,
      location: "Detaillierte Synopsis",
      description: "Vier-Seiten-Zusammenfassung mit allen wichtigen Handlungssträngen.",
      emotionalSignificance: "turning-point"
    },
    {
      sceneNumber: 7,
      location: "Szenenauflistung",
      description: "Liste aller Szenen mit kurzen Beschreibungen ihres Inhalts.",
      emotionalSignificance: "buildup"
    },
    {
      sceneNumber: 8,
      location: "Erster Entwurf",
      description: "Ausarbeitung der Geschichte basierend auf der detaillierten Vorarbeit.",
      emotionalSignificance: "resolution"
    }
  ]
};

export const novelHeroJourneyTemplate: StructureTemplate = {
  id: 'novel-hero-journey',
  name: 'Heldenreise für Romane',
  description: 'An Romanerzählungen angepasste Version der klassischen Heldenreise',
  scenes: [
    {
      sceneNumber: 1,
      location: "Gewohnte Welt",
      description: "Etablierung des Protagonisten in seiner alltäglichen Umgebung.",
      emotionalSignificance: "introduction"
    },
    {
      sceneNumber: 2,
      location: "Ruf zum Abenteuer",
      description: "Herausforderung, Einladung oder Ereignis, das den Protagonisten in die Geschichte zieht.",
      emotionalSignificance: "turning-point"
    },
    {
      sceneNumber: 3,
      location: "Weigerung",
      description: "Der Protagonist zögert oder lehnt den Ruf zunächst ab.",
      emotionalSignificance: "buildup"
    },
    {
      sceneNumber: 4,
      location: "Begegnung mit dem Mentor",
      description: "Eine Figur bietet Rat, Ausbildung oder magische Gegenstände.",
      emotionalSignificance: "buildup"
    },
    {
      sceneNumber: 5,
      location: "Überschreiten der ersten Schwelle",
      description: "Der Protagonist verlässt die gewohnte Welt und betritt das Abenteuer.",
      emotionalSignificance: "turning-point"
    },
    {
      sceneNumber: 6,
      location: "Prüfungen, Verbündete, Feinde",
      description: "Der Protagonist bewältigt Tests, findet Helfer und begegnet Gegnern.",
      emotionalSignificance: "buildup"
    },
    {
      sceneNumber: 7,
      location: "Vordringen zur tiefsten Höhle",
      description: "Annäherung an den gefährlichsten Ort oder die größte Herausforderung.",
      emotionalSignificance: "buildup"
    },
    {
      sceneNumber: 8,
      location: "Entscheidende Prüfung",
      description: "Die zentrale Krise der Geschichte, oft als Tod und Wiedergeburt dargestellt.",
      emotionalSignificance: "climax"
    },
    {
      sceneNumber: 9,
      location: "Belohnung",
      description: "Der Protagonist erhält eine Belohnung, ein Elixier oder eine Erkenntnis.",
      emotionalSignificance: "turning-point"
    },
    {
      sceneNumber: 10,
      location: "Rückweg",
      description: "Beginn der Rückkehr in die gewohnte Welt mit der gewonnenen Belohnung.",
      emotionalSignificance: "buildup"
    },
    {
      sceneNumber: 11,
      location: "Auferstehung",
      description: "Eine finale Prüfung, bei der der Protagonist seine Transformation zeigt.",
      emotionalSignificance: "climax"
    },
    {
      sceneNumber: 12,
      location: "Rückkehr mit dem Elixier",
      description: "Der Protagonist kehrt mit einem Schatz oder einer Lehre zurück, die anderen hilft.",
      emotionalSignificance: "resolution"
    }
  ]
};

export const hookImpactPunchTemplate: StructureTemplate = {
  id: 'hook-impact-punch',
  name: 'Hook-Impact-Punch',
  description: 'Aufmerksamkeit wecken, Inhalte liefern, starker Abschluss',
  scenes: [
    {
      sceneNumber: 1,
      location: "Hook (0-3 Sekunden)",
      description: "Aufmerksamkeitsstarker Einstieg, der zum Weiterschauen animiert.",
      emotionalSignificance: "introduction"
    },
    {
      sceneNumber: 2,
      location: "Pattern-Interrupt (3-5 Sekunden)",
      description: "Unerwartete Wendung, die das Interesse weiter steigert.",
      emotionalSignificance: "turning-point"
    },
    {
      sceneNumber: 3,
      location: "Impact (5-25 Sekunden)",
      description: "Hauptinhalt des Videos, liefert den versprochenen Wert.",
      emotionalSignificance: "climax"
    },
    {
      sceneNumber: 4,
      location: "Punch/CTA (25-30 Sekunden)",
      description: "Starker Abschluss mit Handlungsaufforderung oder Pointe.",
      emotionalSignificance: "finale"
    }
  ]
};

export const microStoryTemplate: StructureTemplate = {
  id: 'micro-story',
  name: 'Micro-Story-Arc',
  description: 'Komprimierte Erzählstruktur für Kurzformate',
  scenes: [
    {
      sceneNumber: 1,
      location: "Setup (0-5 Sekunden)",
      description: "Schnelle Etablierung von Figur und Situation.",
      emotionalSignificance: "introduction"
    },
    {
      sceneNumber: 2,
      location: "Konflikt (5-15 Sekunden)",
      description: "Einführung eines Problems oder einer Herausforderung.",
      emotionalSignificance: "turning-point"
    },
    {
      sceneNumber: 3,
      location: "Höhepunkt (15-25 Sekunden)",
      description: "Dramatischer oder humorvoller Wendepunkt.",
      emotionalSignificance: "climax"
    },
    {
      sceneNumber: 4,
      location: "Auflösung (25-30 Sekunden)",
      description: "Schnelle Lösung oder überraschende Pointe.",
      emotionalSignificance: "finale"
    }
  ]
};

export const problemSolutionTemplate: StructureTemplate = {
  id: 'problem-solution',
  name: 'Problem–Lösung–CTA',
  description: 'Problem identifizieren, Lösung anbieten, Call-to-Action',
  scenes: [
    {
      sceneNumber: 1,
      location: "Problemaufstellung (0-5 Sekunden)",
      description: "Identifikation eines Problems, das beim Publikum Resonanz findet.",
      emotionalSignificance: "introduction"
    },
    {
      sceneNumber: 2,
      location: "Verstärkung (5-10 Sekunden)",
      description: "Verstärkung der Dringlichkeit oder Relevanz des Problems.",
      emotionalSignificance: "buildup"
    },
    {
      sceneNumber: 3,
      location: "Lösungspräsentation (10-20 Sekunden)",
      description: "Vorstellung der Lösung oder des Tipps.",
      emotionalSignificance: "turning-point"
    },
    {
      sceneNumber: 4,
      location: "Beweis/Demonstration (20-25 Sekunden)",
      description: "Demonstration der Wirksamkeit oder des Ergebnisses.",
      emotionalSignificance: "climax"
    },
    {
      sceneNumber: 5,
      location: "Call-to-Action (25-30 Sekunden)",
      description: "Klare Handlungsaufforderung an das Publikum.",
      emotionalSignificance: "finale"
    }
  ]
};

export const youtubeHeroTemplate: StructureTemplate = {
  id: 'youtube-hero',
  name: 'YouTube Hero Structure',
  description: 'Optimierte Erzählstruktur für längere YouTube-Videos',
  scenes: [
    {
      sceneNumber: 1,
      location: "Hook (0-30 Sekunden)",
      description: "Aufmerksamkeitsstarker Einstieg, der den Mehrwert des Videos verspricht.",
      emotionalSignificance: "introduction"
    },
    {
      sceneNumber: 2,
      location: "Intro (30-60 Sekunden)",
      description: "Kurze Einführung des Themas und Überblick über den Videoinhalt.",
      emotionalSignificance: "introduction"
    },
    {
      sceneNumber: 3,
      location: "Storytelling Setup (1-2 Minuten)",
      description: "Persönliche Anekdote oder Kontext, der das Thema emotional verankert.",
      emotionalSignificance: "buildup"
    },
    {
      sceneNumber: 4,
      location: "Value Segment 1 (2-4 Minuten)",
      description: "Erster Hauptinhaltspunkt mit detaillierten Informationen.",
      emotionalSignificance: "buildup"
    },
    {
      sceneNumber: 5,
      location: "Pattern Interrupt (4-5 Minuten)",
      description: "Kurze Unterbrechung durch Humor, Frage oder visuellen Wechsel.",
      emotionalSignificance: "turning-point"
    },
    {
      sceneNumber: 6,
      location: "Value Segment 2 (5-7 Minuten)",
      description: "Zweiter Hauptinhaltspunkt, der auf dem ersten aufbaut.",
      emotionalSignificance: "buildup"
    },
    {
      sceneNumber: 7,
      location: "Challenge/Objection (7-8 Minuten)",
      description: "Ansprechen von Einwänden oder Herausforderungen beim Thema.",
      emotionalSignificance: "turning-point"
    },
    {
      sceneNumber: 8,
      location: "Value Segment 3 (8-10 Minuten)",
      description: "Dritter Hauptinhaltspunkt oder Lösung der Challenge.",
      emotionalSignificance: "climax"
    },
    {
      sceneNumber: 9,
      location: "Zusammenfassung (10-11 Minuten)",
      description: "Wiederholung der wichtigsten Punkte und Erkenntnisse.",
      emotionalSignificance: "resolution"
    },
    {
      sceneNumber: 10,
      location: "Call-to-Action (11-12 Minuten)",
      description: "Aufforderung zum Liken, Abonnieren und Weiterverbreiten.",
      emotionalSignificance: "finale"
    }
  ]
};

export const listStructureTemplate: StructureTemplate = {
  id: 'list-structure',
  name: 'Listenstruktur',
  description: 'Aufbau nach Listenformat, z.B. Top 5, 10 Gründe für...',
  scenes: [
    {
      sceneNumber: 1,
      location: "Intro-Hook (0-45 Sekunden)",
      description: "Spannende Einführung des Listenthemas und warum es wichtig ist.",
      emotionalSignificance: "introduction"
    },
    {
      sceneNumber: 2,
      location: "Überblick (45-60 Sekunden)",
      description: "Kurze Vorschau auf die Liste und den Aufbau des Videos.",
      emotionalSignificance: "introduction"
    },
    {
      sceneNumber: 3,
      location: "Punkt 1 (1-3 Minuten)",
      description: "Meist beginnt man mit einem mittelstarken Punkt, um Interesse aufzubauen.",
      emotionalSignificance: "buildup"
    },
    {
      sceneNumber: 4,
      location: "Punkt 2 (3-5 Minuten)",
      description: "Zweiter Listenpunkt mit etwas mehr Tiefe oder Relevanz.",
      emotionalSignificance: "buildup"
    },
    {
      sceneNumber: 5,
      location: "Engagement Break (5-6 Minuten)",
      description: "Kurze Interaktion mit dem Publikum, Frage oder Aufforderung zum Kommentieren.",
      emotionalSignificance: "turning-point"
    },
    {
      sceneNumber: 6,
      location: "Punkt 3 (6-8 Minuten)",
      description: "Fortführung der Liste, oft mit steigendem Interesse oder Wichtigkeit.",
      emotionalSignificance: "buildup"
    },
    {
      sceneNumber: 7,
      location: "Punkt 4 (8-10 Minuten)",
      description: "Einer der stärkeren Punkte, der besondere Aufmerksamkeit verdient.",
      emotionalSignificance: "buildup"
    },
    {
      sceneNumber: 8,
      location: "Spannung vor dem Höhepunkt (10-11 Minuten)",
      description: "Aufbau von Spannung vor dem wichtigsten Punkt der Liste.",
      emotionalSignificance: "turning-point"
    },
    {
      sceneNumber: 9,
      location: "Punkt 5 / Höhepunkt (11-13 Minuten)",
      description: "Der wichtigste oder überraschendste Punkt der Liste.",
      emotionalSignificance: "climax"
    },
    {
      sceneNumber: 10,
      location: "Zusammenfassung und CTA (13-15 Minuten)",
      description: "Kurze Wiederholung der Liste und Call-to-Action.",
      emotionalSignificance: "finale"
    }
  ]
};

export const tutorialStructureTemplate: StructureTemplate = {
  id: 'tutorial-structure',
  name: 'Tutorial-Aufbau',
  description: 'Schritt-für-Schritt-Anleitung mit Einführung und Zusammenfassung',
  scenes: [
    {
      sceneNumber: 1,
      location: "Problem-Hook (0-30 Sekunden)",
      description: "Vorstellung des Problems, das durch das Tutorial gelöst wird.",
      emotionalSignificance: "introduction"
    },
    {
      sceneNumber: 2,
      location: "Ergebnis-Vorschau (30-60 Sekunden)",
      description: "Zeigen des Endergebnisses, um Motivation zu schaffen.",
      emotionalSignificance: "introduction"
    },
    {
      sceneNumber: 3,
      location: "Voraussetzungen (1-2 Minuten)",
      description: "Erklärung der benötigten Werkzeuge, Fähigkeiten oder Materialien.",
      emotionalSignificance: "introduction"
    },
    {
      sceneNumber: 4,
      location: "Schritt 1 (2-4 Minuten)",
      description: "Detaillierte Anleitung für den ersten Schritt.",
      emotionalSignificance: "buildup"
    },
    {
      sceneNumber: 5,
      location: "Schritt 2 (4-6 Minuten)",
      description: "Anleitung für den zweiten Schritt des Tutorials.",
      emotionalSignificance: "buildup"
    },
    {
      sceneNumber: 6,
      location: "Häufiger Fehler / Tipp (6-7 Minuten)",
      description: "Hinweis auf typische Fehler und wie man sie vermeidet.",
      emotionalSignificance: "turning-point"
    },
    {
      sceneNumber: 7,
      location: "Schritt 3 (7-9 Minuten)",
      description: "Anleitung für den dritten Schritt des Tutorials.",
      emotionalSignificance: "buildup"
    },
    {
      sceneNumber: 8,
      location: "Schritt 4 (9-11 Minuten)",
      description: "Anleitung für den vierten und oft komplexesten Schritt.",
      emotionalSignificance: "climax"
    },
    {
      sceneNumber: 9,
      location: "Fertiges Ergebnis (11-12 Minuten)",
      description: "Präsentation des fertigen Projekts oder der Lösung.",
      emotionalSignificance: "resolution"
    },
    {
      sceneNumber: 10,
      location: "Alternative Ansätze (12-13 Minuten)",
      description: "Kurze Erwähnung von Variationen oder alternativen Methoden.",
      emotionalSignificance: "resolution"
    },
    {
      sceneNumber: 11,
      location: "Zusammenfassung und Nächste Schritte (13-15 Minuten)",
      description: "Zusammenfassung des Gelernten und Vorschläge für Weiterführendes.",
      emotionalSignificance: "finale"
    }
  ]
};
