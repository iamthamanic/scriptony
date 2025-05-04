
import type { EmotionalSignificance } from '../common';
import type { ProjectType, VideoFormat } from '../projects';
import type { Genre } from '../genres';

/**
 * Core narrative structure types
 */

export type NarrativeStructureType = 
  | 'none'
  | 'hero-journey'
  | 'three-act'
  | 'save-the-cat'
  | 'story-circle'
  | 'tragedy'
  | 'cyclical'
  | 'five-act'
  | 'season-arc'
  | 'procedural'
  | 'character-arc'
  | 'cyclic-beckett'
  | 'episode-brecht'
  | 'three-act-audio'
  | 'narrator-scenes'
  | 'inner-monologue'
  | 'audio-series'
  | 'novel-three-act'
  | 'seven-point'
  | 'snowflake'
  | 'novel-hero-journey'
  | 'hook-impact-punch'
  | 'micro-story'
  | 'problem-solution'
  | 'youtube-hero'
  | 'list-structure'
  | 'tutorial-structure';

export interface StructureTemplate {
  id: NarrativeStructureType;
  name: string;
  description: string;
  recommendedFor?: Genre[];
  scenes: Array<{
    sceneNumber: number;
    location: string;
    description: string;
    emotionalSignificance?: string;
  }>;
}

export interface NarrativeStructureOption {
  value: NarrativeStructureType;
  label: string;
  description: string;
  recommendedFor?: Genre[];
}

export const getStructureOptions = (projectType: ProjectType, videoFormat?: VideoFormat): NarrativeStructureOption[] => {
  // Always include 'none' option
  const baseOptions: NarrativeStructureOption[] = [
    { value: 'none', label: 'Keine Struktur auswählen', description: 'Manuell aufbauen ohne vordefinierte Struktur' }
  ];
  
  // Add media-specific options
  switch(projectType) {
    case 'movie':
      return [
        ...baseOptions,
        { 
          value: 'three-act', 
          label: 'Drei-Akt-Struktur', 
          description: 'Die klassische Drei-Akt-Struktur mit Setup, Konfrontation und Auflösung' 
        },
        { 
          value: 'hero-journey', 
          label: 'Heldenreise (Campbell)', 
          description: 'Joseph Campbells Heldenreise mit 12 Stationen des Helden' 
        },
        { 
          value: 'save-the-cat', 
          label: 'Save the Cat (Snyder)', 
          description: 'Blake Snyders 15-Beats-Struktur für erfolgreiche Drehbücher' 
        },
        { 
          value: 'tragedy', 
          label: 'Tragische Heldenreise', 
          description: 'Struktur mit tragischem Ende für den Protagonisten' 
        }
      ];
    
    case 'series':
      return [
        ...baseOptions,
        { 
          value: 'season-arc', 
          label: 'Serienbogen (Staffelstruktur)', 
          description: 'Übergreifender Handlungsbogen für eine komplette Staffel' 
        },
        { 
          value: 'story-circle', 
          label: 'Dan Harmon\'s Story Circle', 
          description: '8-teilige zyklische Struktur für Episoden und Staffelbögen' 
        },
        { 
          value: 'procedural', 
          label: 'Procedural-Loop', 
          description: 'Sich wiederholendes Format mit "Fall der Woche", z.B. für Krimiserien' 
        },
        { 
          value: 'character-arc', 
          label: 'Staffel mit Charakterbogen', 
          description: 'Fokus auf Entwicklung der Hauptfiguren über die Staffel hinweg' 
        }
      ];
      
    case 'theaterstück':
      return [
        ...baseOptions,
        { 
          value: 'five-act', 
          label: 'Fünf-Akt-Struktur (Freytag)', 
          description: 'Klassische Dramenstruktur mit fünf Akten: Exposition, Steigerung, Höhepunkt, Fall, Katastrophe' 
        },
        { 
          value: 'three-act', 
          label: 'Drei-Akt-Struktur (modern)', 
          description: 'Modernisierte Version der Drei-Akt-Struktur für Bühnenwerke' 
        },
        { 
          value: 'cyclic-beckett', 
          label: 'Zyklische Struktur (Beckett)', 
          description: 'Sich wiederholende Ereignisse, Kreisstruktur, absurdes Theater' 
        },
        { 
          value: 'episode-brecht', 
          label: 'Episodenstruktur (Brecht)', 
          description: 'Nicht-aristotelische Erzählstruktur mit eigenständigen Szenen und Verfremdungseffekten' 
        }
      ];
      
    case 'hörspiel':
      return [
        ...baseOptions,
        { 
          value: 'three-act-audio', 
          label: 'Drei-Akt (hörspieloptimiert)', 
          description: 'An das Hörmedium angepasste Drei-Akt-Struktur' 
        },
        { 
          value: 'narrator-scenes', 
          label: 'Erzähler + Szenen-Mix', 
          description: 'Wechsel zwischen Erzählerstimme und szenischen Elementen' 
        },
        { 
          value: 'inner-monologue', 
          label: 'Innerer Monolog / Solo-Stück', 
          description: 'Fokus auf Gedankenwelt und inneren Dialog einer Hauptfigur' 
        },
        { 
          value: 'audio-series', 
          label: 'Serienstruktur mit Cliffhangern', 
          description: 'Episodischer Aufbau mit Spannungsbögen am Ende jeder Folge' 
        }
      ];
      
    case 'buch':
      return [
        ...baseOptions,
        { 
          value: 'novel-three-act', 
          label: 'Drei-Akt-Romanstruktur', 
          description: 'Klassische Romanstruktur mit Anfang, Mittelteil und Ende' 
        },
        { 
          value: 'seven-point', 
          label: 'Sieben-Punkt-Modell (Dan Wells)', 
          description: 'Sieben Schlüsselszenen als Gerüst für die Geschichte' 
        },
        { 
          value: 'snowflake', 
          label: 'Snowflake-Methode', 
          description: 'Vom einfachen Konzept zum komplexen Roman durch iteratives Erweitern' 
        },
        { 
          value: 'novel-hero-journey', 
          label: 'Heldenreise für Romane', 
          description: 'An Romanerzählungen angepasste Version der klassischen Heldenreise' 
        }
      ];
      
    case 'social_video':
      if (videoFormat === 'shortform') {
        return [
          ...baseOptions,
          { 
            value: 'hook-impact-punch', 
            label: 'Hook-Impact-Punch', 
            description: 'Aufmerksamkeit wecken, Inhalte liefern, starker Abschluss' 
          },
          { 
            value: 'micro-story', 
            label: 'Micro-Story-Arc', 
            description: 'Komprimierte Erzählstruktur für Kurzformate' 
          },
          { 
            value: 'problem-solution', 
            label: 'Problem–Lösung–CTA', 
            description: 'Problem identifizieren, Lösung anbieten, Call-to-Action' 
          }
        ];
      } else if (videoFormat === 'longform') {
        return [
          ...baseOptions,
          { 
            value: 'youtube-hero', 
            label: 'YouTube Hero Structure', 
            description: 'Optimierte Erzählstruktur für längere YouTube-Videos' 
          },
          { 
            value: 'list-structure', 
            label: 'Listenstruktur', 
            description: 'Aufbau nach Listenformat, z.B. Top 5, 10 Gründe für...' 
          },
          { 
            value: 'tutorial-structure', 
            label: 'Tutorial-Aufbau', 
            description: 'Schritt-für-Schritt-Anleitung mit Einführung und Zusammenfassung' 
          }
        ];
      }
      return baseOptions;
      
    default:
      return baseOptions;
  }
};

// Export the function as a replacement for the static options array
export const narrativeStructureOptions = getStructureOptions('movie');
