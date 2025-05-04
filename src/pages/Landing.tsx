
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X, AlertCircle } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-foreground">
                Dein Assistent für jede Geschichte.
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Egal ob Film, Serie, Hörspiel oder Theaterstück – ScriptBuddy hilft dir, kreative Ideen in strukturierte Skripte zu verwandeln. Visuell. Intuitiv. Story-fokussiert.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90" onClick={() => navigate('/auth')}>
                  Kostenlos starten mit Google
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/auth', { state: { mode: 'login' } })}>
                  Login
                </Button>
              </div>
            </div>
            <div className="flex-1 mt-8 md:mt-0">
              <div className="bg-card rounded-lg shadow-lg overflow-hidden">
                <img 
                  src="/placeholder.svg" 
                  alt="ScriptBuddy Demo Scene" 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">So funktioniert ScriptBuddy</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="text-4xl mb-4">🪄</div>
                <h3 className="text-xl font-semibold mb-2">Projekt starten</h3>
                <p className="text-muted-foreground">Erstelle ein neues Projekt mit Logline, Medium & Genre.</p>
              </CardContent>
            </Card>
            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-xl font-semibold mb-2">Struktur wählen</h3>
                <p className="text-muted-foreground">Wähle z. B. die Heldenreise oder 3-Akt-Struktur für deinen Plot.</p>
              </CardContent>
            </Card>
            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="text-4xl mb-4">🎞️</div>
                <h3 className="text-xl font-semibold mb-2">Szenen visualisieren</h3>
                <p className="text-muted-foreground">Fülle jede Szene mit Bild, Licht, Sound, Shots & Dialog.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Media Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Für jede Art von Geschichte</h2>
            <p className="text-lg text-muted-foreground">ScriptBuddy ist für alle kreativen Erzähler:innen gedacht:</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 hover:bg-accent rounded-lg transition-colors">
              <p className="text-2xl mb-2">🎬</p>
              <p className="font-medium">Film & Serie</p>
            </div>
            <div className="p-4 hover:bg-accent rounded-lg transition-colors">
              <p className="text-2xl mb-2">🎧</p>
              <p className="font-medium">Hörspiel & Podcast-Drama</p>
            </div>
            <div className="p-4 hover:bg-accent rounded-lg transition-colors">
              <p className="text-2xl mb-2">🎭</p>
              <p className="font-medium">Theaterstück & Bühne</p>
            </div>
            <div className="p-4 hover:bg-accent rounded-lg transition-colors">
              <p className="text-2xl mb-2">🎮</p>
              <p className="font-medium">Game-Story & Visual Novels</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature List */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Was ScriptBuddy für dich macht</h2>
          </div>
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Szenen-Editor mit Bildern, Timecode & Sound",
              "Struktur-Generator mit Plot-Vorlagen",
              "Shotliste & visuelle Timeline",
              "Export als PDF, Markdown oder ZIP",
              "Projekte für Film, Audio oder Bühne",
              "KI-tauglich für visuelle Generierung"
            ].map((feature, index) => (
              <div key={index} className="flex items-center p-3 bg-card rounded-lg shadow">
                <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Warum ScriptBuddy einzigartig ist</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Im Vergleich zu klassischen Drehbuch-Tools und Story-Plattformen vereint ScriptBuddy alle kreativen & technischen Aspekte in einem einzigen Tool:
            </p>
          </div>
          
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left">Funktion</th>
                  <th className="px-4 py-3 text-center">ScriptBuddy</th>
                  <th className="px-4 py-3 text-center">Final Draft</th>
                  <th className="px-4 py-3 text-center">Celtx</th>
                  <th className="px-4 py-3 text-center">Plottr</th>
                  <th className="px-4 py-3 text-center">Storyboard That</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="bg-card">
                  <td className="px-4 py-3">Visuelle Szenenbearbeitung</td>
                  <td className="px-4 py-3 text-center"><Check className="h-5 w-5 mx-auto text-green-500" /></td>
                  <td className="px-4 py-3 text-center"><X className="h-5 w-5 mx-auto text-red-500" /></td>
                  <td className="px-4 py-3 text-center"><AlertCircle className="h-5 w-5 mx-auto text-amber-500" /></td>
                  <td className="px-4 py-3 text-center"><X className="h-5 w-5 mx-auto text-red-500" /></td>
                  <td className="px-4 py-3 text-center"><Check className="h-5 w-5 mx-auto text-green-500" /></td>
                </tr>
                <tr className="bg-background">
                  <td className="px-4 py-3">Struktur-Vorlagen (z. B. Heldenreise)</td>
                  <td className="px-4 py-3 text-center"><Check className="h-5 w-5 mx-auto text-green-500" /></td>
                  <td className="px-4 py-3 text-center"><X className="h-5 w-5 mx-auto text-red-500" /></td>
                  <td className="px-4 py-3 text-center"><Check className="h-5 w-5 mx-auto text-green-500" /></td>
                  <td className="px-4 py-3 text-center"><Check className="h-5 w-5 mx-auto text-green-500" /></td>
                  <td className="px-4 py-3 text-center"><X className="h-5 w-5 mx-auto text-red-500" /></td>
                </tr>
                <tr className="bg-card">
                  <td className="px-4 py-3">Shots & Kameraeinstellungen</td>
                  <td className="px-4 py-3 text-center"><Check className="h-5 w-5 mx-auto text-green-500" /></td>
                  <td className="px-4 py-3 text-center"><X className="h-5 w-5 mx-auto text-red-500" /></td>
                  <td className="px-4 py-3 text-center"><X className="h-5 w-5 mx-auto text-red-500" /></td>
                  <td className="px-4 py-3 text-center"><X className="h-5 w-5 mx-auto text-red-500" /></td>
                  <td className="px-4 py-3 text-center"><AlertCircle className="h-5 w-5 mx-auto text-amber-500" /></td>
                </tr>
                <tr className="bg-background">
                  <td className="px-4 py-3">Multimedial (Film, Audio, Bühne)</td>
                  <td className="px-4 py-3 text-center"><Check className="h-5 w-5 mx-auto text-green-500" /></td>
                  <td className="px-4 py-3 text-center"><X className="h-5 w-5 mx-auto text-red-500" /></td>
                  <td className="px-4 py-3 text-center"><X className="h-5 w-5 mx-auto text-red-500" /></td>
                  <td className="px-4 py-3 text-center"><AlertCircle className="h-5 w-5 mx-auto text-amber-500" /></td>
                  <td className="px-4 py-3 text-center"><X className="h-5 w-5 mx-auto text-red-500" /></td>
                </tr>
                <tr className="bg-card">
                  <td className="px-4 py-3">PDF & ZIP-Export</td>
                  <td className="px-4 py-3 text-center"><Check className="h-5 w-5 mx-auto text-green-500" /></td>
                  <td className="px-4 py-3 text-center"><Check className="h-5 w-5 mx-auto text-green-500" /></td>
                  <td className="px-4 py-3 text-center"><Check className="h-5 w-5 mx-auto text-green-500" /></td>
                  <td className="px-4 py-3 text-center"><X className="h-5 w-5 mx-auto text-red-500" /></td>
                  <td className="px-4 py-3 text-center"><X className="h-5 w-5 mx-auto text-red-500" /></td>
                </tr>
                <tr className="bg-background">
                  <td className="px-4 py-3">KI-tauglich (Shot-Level Export)</td>
                  <td className="px-4 py-3 text-center"><Check className="h-5 w-5 mx-auto text-green-500" /></td>
                  <td className="px-4 py-3 text-center"><X className="h-5 w-5 mx-auto text-red-500" /></td>
                  <td className="px-4 py-3 text-center"><X className="h-5 w-5 mx-auto text-red-500" /></td>
                  <td className="px-4 py-3 text-center"><X className="h-5 w-5 mx-auto text-red-500" /></td>
                  <td className="px-4 py-3 text-center"><X className="h-5 w-5 mx-auto text-red-500" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Preise</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Free",
                price: "0 €",
                features: ["5 Projekte", "PDF-Export", "Plotstruktur-Vorlagen"]
              },
              {
                name: "Pro",
                price: "9,99 € / Monat",
                features: ["50 Projekte", "ZIP-Export", "Story-Blueprint-Modul"]
              },
              {
                name: "Studio",
                price: "19,99 € / Monat",
                features: ["Unlimitiert", "Team-Funktion", "Versioning", "AI-Assistent"]
              }
            ].map((plan, index) => (
              <Card key={index} className={`hover-scale ${index === 1 ? 'border-primary shadow-lg' : ''}`}>
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <div className="text-3xl font-bold">{plan.price}</div>
                    <div className="pt-4 space-y-2">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-center">
                          <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Button 
                      className={`mt-6 w-full ${index === 1 ? 'bg-primary hover:bg-primary/90' : ''}`}
                      variant={index === 1 ? 'default' : 'outline'}
                      onClick={() => navigate('/auth')}
                    >
                      Auswählen
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Starte dein erstes Projekt heute</h2>
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90"
            onClick={() => navigate('/auth')}
          >
            Kostenlos loslegen
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-card border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="font-bold text-lg">ScriptBuddy</span>
              <p className="text-sm text-muted-foreground">© 2025 ScriptBuddy. Alle Rechte vorbehalten.</p>
            </div>
            <div className="flex gap-4">
              <Link to="#" className="text-muted-foreground hover:text-foreground">Impressum</Link>
              <Link to="#" className="text-muted-foreground hover:text-foreground">Datenschutz</Link>
              <Link to="#" className="text-muted-foreground hover:text-foreground">Kontakt</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
