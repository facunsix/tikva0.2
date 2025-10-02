import React from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { ArrowRight, Sparkles, Star } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

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
      gradient: 'from-blue-500/10 via-purple-500/10 to-pink-500/10',
      accentColor: 'blue'
    },
    {
      id: 'frutastica',
      title: 'Skala Línea',
      subtitle: 'Frutástica',
      description: 'Hidratación intensa con extractos de frutas naturales para cabellos secos y dañados.',
      image: 'https://i.ibb.co/CK38vd9V/frutastica.png',
      buttonText: 'Ver productos',
      category: 'Cremas Skala',
      gradient: 'from-green-500/10 via-emerald-500/10 to-teal-500/10',
      accentColor: 'green'
    },
    {
      id: 'expert',
      title: 'Línea',
      subtitle: 'Expert',
      description: 'Tratamiento de salón con keratina para reparación profunda del cabello.',
      image: 'https://i.ibb.co/x8Ddv3kp/expert.png',
      buttonText: 'Ver productos',
      category: 'Cremas Skala',
      gradient: 'from-amber-500/10 via-orange-500/10 to-red-500/10',
      accentColor: 'amber'
    },
    {
      id: 'brasil',
      title: 'Línea Brasil',
      subtitle: '& Ceramidas',
      description: 'Ingredientes 100% naturales sin sulfatos ni parabenos para un cuidado suave.',
      image: 'https://i.ibb.co/p6NYdNL2/brasil.png',
      buttonText: 'Ver productos',
      category: 'Cremas Skala',
      gradient: 'from-emerald-500/10 via-green-500/10 to-lime-500/10',
      accentColor: 'emerald'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const getAccentClasses = (color: string) => {
    const colors: Record<string, { badge: string; text: string; hover: string }> = {
      blue: {
        badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        text: 'text-blue-600 dark:text-blue-400',
        hover: 'group-hover:shadow-blue-500/20'
      },
      green: {
        badge: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
        text: 'text-green-600 dark:text-green-400',
        hover: 'group-hover:shadow-green-500/20'
      },
      amber: {
        badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        text: 'text-amber-600 dark:text-amber-400',
        hover: 'group-hover:shadow-amber-500/20'
      },
      emerald: {
        badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        text: 'text-emerald-600 dark:text-emerald-400',
        hover: 'group-hover:shadow-emerald-500/20'
      }
    };
    return colors[color] || colors.blue;
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background via-muted/30 to-background relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="w-7 h-7 text-primary" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Productos Destacados
            </h2>
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="w-7 h-7 text-primary" />
            </motion.div>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explora nuestras líneas premium cuidadosamente seleccionadas para ofrecerte lo mejor en calidad y estilo
          </p>
        </motion.div>

        {/* Grid de secciones destacadas */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        >
          {featuredSections.map((section, index) => {
            const accentClasses = getAccentClasses(section.accentColor);
            
            return (
              <motion.div
                key={section.id}
                variants={itemVariants}
                className="group relative"
              >
                <div className={`
                  relative overflow-hidden rounded-2xl bg-gradient-to-br ${section.gradient}
                  backdrop-blur-sm border border-border/50
                  shadow-lg hover:shadow-2xl ${accentClasses.hover}
                  transition-all duration-500
                  h-full
                `}>
                  <div className="relative flex flex-col md:flex-row h-full">
                    {/* Imagen */}
                    <div className="relative md:w-1/2 h-64 md:h-auto overflow-hidden">
                      <div className="absolute inset-0">
                        <ImageWithFallback
                          src={section.image}
                          alt={`${section.title} ${section.subtitle}`}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        {/* Gradient overlay sutil */}
                        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/20 via-transparent to-transparent" />
                      </div>
                      
                      {/* Badge flotante */}
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                        className="absolute top-4 left-4 z-10"
                      >
                        <div className={`
                          inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                          ${accentClasses.badge}
                          backdrop-blur-md shadow-lg
                          border
                        `}>
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="text-sm font-semibold">Destacado</span>
                        </div>
                      </motion.div>
                    </div>

                    {/* Contenido */}
                    <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center relative">
                      <div className="space-y-4">
                        {/* Título */}
                        <div>
                          <motion.h3
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 + index * 0.1 }}
                            className="text-2xl md:text-3xl font-bold mb-1"
                          >
                            {section.title}
                          </motion.h3>
                          <motion.h4
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                            className={`text-xl font-semibold ${accentClasses.text} mb-3`}
                          >
                            {section.subtitle}
                          </motion.h4>
                        </div>

                        {/* Descripción */}
                        <motion.p
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                          className="text-muted-foreground leading-relaxed text-sm md:text-base"
                        >
                          {section.description}
                        </motion.p>

                        {/* Botón */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                        >
                          <Button
                            onClick={() => onNavigateToCategory(section.category)}
                            className="group/btn w-full md:w-auto shadow-md hover:shadow-xl transition-all duration-300"
                            size="lg"
                          >
                            {section.buttonText}
                            <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                          </Button>
                        </motion.div>
                      </div>

                      {/* Decorative corner */}
                      <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
                        <div className={`absolute inset-0 bg-gradient-to-bl ${section.gradient} rounded-bl-full`} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-16"
        >
          <div className="inline-flex flex-wrap items-center justify-center gap-3 md:gap-4 text-muted-foreground bg-muted/50 backdrop-blur-sm px-6 py-3 rounded-full border border-border/50">
            <span className="text-sm md:text-base">✨ Envío gratis en todas las compras</span>
            <span className="hidden md:inline">•</span>
            <span className="text-sm md:text-base">💬 Atención 24/7 por WhatsApp</span>
            <span className="hidden md:inline">•</span>
            <span className="text-sm md:text-base">🔒 Productos garantizados</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};