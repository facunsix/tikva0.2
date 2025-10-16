import React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Truck, Percent, Gift, Star } from 'lucide-react';

interface PromoBannerProps {
  onScrollToProducts: () => void;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({ onScrollToProducts }) => {
  return (
    <section id="promociones" className="py-12">
      <div className="container mx-auto px-4">
        {/* Banner principal */}
        <Card className="bg-gradient-to-r from-primary via-primary to-destructive text-primary-foreground mb-8 overflow-hidden relative">
          <CardContent className="p-8 text-center relative z-10">
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative z-10">
              <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
                🔥 OFERTA ESPECIAL
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                ¡Envío a Domicilio en Todas las Compras!
              </h2>
              <p className="text-lg mb-6 text-primary-foreground/90">
                Aprovecha nuestros precios únicos y recibe tu pedido sin complicaciones
              </p>
              <Button
                onClick={onScrollToProducts}
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90"
              >
                Ver Productos
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Grid de promociones */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Envío a domicilio */}
          <Card className="text-center p-6 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950">
            <CardContent className="p-0">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full mb-4">
                <Truck className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold mb-2 text-green-800 dark:text-green-200">Envío a Domicilio</h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                Recibí tus productos en tu casa
              </p>
            </CardContent>
          </Card>

          {/* Precios especiales */}
          <Card className="text-center p-6 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950">
            <CardContent className="p-0">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
                <Percent className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold mb-2 text-blue-800 dark:text-blue-200">Descuentos por Caja</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Mejores precios comprando por caja
              </p>
            </CardContent>
          </Card>

          {/* Productos únicos */}
          <Card className="text-center p-6 border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950">
            <CardContent className="p-0">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full mb-4">
                <Gift className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold mb-2 text-purple-800 dark:text-purple-200">Productos Exclusivos</h3>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Marcas de calidad internacional
              </p>
            </CardContent>
          </Card>

          {/* Calidad garantizada */}
          <Card className="text-center p-6 border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950">
            <CardContent className="p-0">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full mb-4">
                <Star className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="font-semibold mb-2 text-yellow-800 dark:text-yellow-200">Calidad Premium</h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Productos originales garantizados
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Banner de categorías */}
        <Card className="mt-8 bg-gradient-to-r from-secondary to-accent">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-center">Nuestras Categorías</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Zapatillas', emoji: '👟' },
                { name: 'Cremas Skala', emoji: '🧴' },
                { name: 'Perfumes Árabes', emoji: '🌹' },
                { name: 'Pasta Dental', emoji: '🦷' }
              ].map((category) => (
                <div key={category.name} className="text-center p-4 bg-white/10 rounded-lg">
                  <div className="text-2xl mb-2">{category.emoji}</div>
                  <p className="font-medium text-sm">{category.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
