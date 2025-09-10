import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ArrowRight, Sparkles } from 'lucide-react';

interface FeaturedSectionsProps {
  onNavigateToCategory: (category: string) => void;
}

export const FeaturedSections: React.FC<FeaturedSectionsProps> = ({ onNavigateToCategory }) => {
  const featuredSections = [
    {
      id: 'zapatillas',
      title: 'Zapatillas',
      subtitle: 'Última colección',
      description: 'DESCUBRE LA ÚLTIMA COLECCIÓN. Encuentra el par perfecto que se adapte a tu estilo urbano y marca tendencia donde vayas.',
      image: 'https://i.ibb.co/M5Vx6tnv/Pisa-Fuerte-este-a-o-1.png',
      buttonText: 'Explorar Colección',
      category: 'Zapatillas',
      gradient: 'from-blue-600/20 via-purple-600/20 to-pink-600/20',
      accentColor: 'blue-500'
    },
    {
      id: 'frutastica',
      title: 'Skala Línea',
      subtitle: 'Frutástica',
      description: 'Hidratación intensa con extractos de frutas naturales para cabellos secos y dañados.',
      image: 'https://i.ibb.co/CK38vd9V/frutastica.png',
      buttonText: 'Ver productos',
      category: 'Cremas Skala',
      gradient: 'from-green-500/20 via-emerald-500/20 to-teal-500/20',
      accentColor: 'green-500'
    },
    {
      id: 'expert',
      title: 'Línea',
      subtitle: 'Expert',
      description: 'Tratamiento de salón con keratina para reparación profunda del cabello.',
      image: 'https://i.ibb.co/x8Ddv3kp/expert.png',
      buttonText: 'Ver productos',
      category: 'Cremas Skala',
      gradient: 'from-amber-500/20 via-orange-500/20 to-red-500/20',
      accentColor: 'amber-500'
    },
    {
      id: 'brasil',
      title: 'Línea Brasil',
      subtitle: '& Ceramidas',
      description: 'Ingredientes 100% naturales sin sulfatos ni parabenos para un cuidado suave.',
      image: 'https://i.ibb.co/p6NYdNL2/brasil.png',
      buttonText: 'Ver productos',
      category: 'Cremas Skala',
      gradient: 'from-emerald-600/20 via-green-600/20 to-lime-600/20',
      accentColor: 'emerald-500'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold">Productos Destacados</h2>
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explora nuestras líneas premium cuidadosamente seleccionadas para ofrecerte lo mejor en calidad y estilo
          </p>
        </div>

        {/* Grid de secciones destacadas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredSections.map((section, index) => (
            <Card 
              key={section.id}
              className={`group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500 bg-gradient-to-br ${section.gradient} backdrop-blur-sm`}
            >
              <CardContent className="p-0">
                <div className={`flex ${index % 2 === 0 ? 'flex-col md:flex-row' : 'flex-col md:flex-row-reverse'} h-full`}>
                  {/* Imagen */}
                  <div className="md:w-1/2 relative overflow-hidden">
                    <div className="aspect-[4/3] md:aspect-[3/4] relative">
                      <img
                        src={section.image}
                        alt={`${section.title} ${section.subtitle}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                    <div className="space-y-4">
                      {/* Badge */}
                      <div className={`inline-flex items-center px-3 py-1 rounded-full bg-${section.accentColor}/10 text-${section.accentColor} border border-${section.accentColor}/20`}>
                        <span className="text-sm font-medium">Destacado</span>
                      </div>

                      {/* Título */}
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold mb-1">
                          {section.title}
                        </h3>
                        <h4 className={`text-lg font-semibold text-${section.accentColor} mb-3`}>
                          {section.subtitle}
                        </h4>
                      </div>

                      {/* Descripción */}
                      <p className="text-muted-foreground leading-relaxed">
                        {section.description}
                      </p>

                      {/* Botón */}
                      <Button
                        onClick={() => onNavigateToCategory(section.category)}
                        className="group/btn w-full md:w-auto"
                        size="lg"
                      >
                        {section.buttonText}
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Footer */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <span>Envío gratis en todas las compras</span>
            <span>•</span>
            <span>Atención 24/7 por WhatsApp</span>
            <span>•</span>
            <span>Productos garantizados</span>
          </div>
        </div>
      </div>
    </section>
  );
};