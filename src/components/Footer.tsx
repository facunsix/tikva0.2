import React from 'react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { ShoppingBag, Instagram, Facebook, MessageCircle, Mail, MapPin, Phone, Heart } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t mt-16">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center overflow-hidden">
                <ImageWithFallback 
                  src="https://i.ibb.co/1JTm1rQk/logo.png"
                  alt="Logo Tikvá"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-primary">Tikvá</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Tu tienda de confianza para productos de calidad premium. Ofrecemos zapatillas, cremas Skala, perfumes árabes y más, con envío gratis en todas las compras.
            </p>
            <div className="flex space-x-3">
              <Button variant="outline" size="icon" asChild>
                <a 
                  href="https://www.instagram.com/tikva_ok/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a 
                  href="https://www.facebook.com/profile.php?id=61579900372343" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a 
                  href="https://wa.me/5493764145766" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Products Section */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Productos</h4>
            <div className="space-y-2">
              <a href="#productos" className="block text-muted-foreground hover:text-primary transition-colors">
                Zapatillas
              </a>
              <a href="#productos" className="block text-muted-foreground hover:text-primary transition-colors">
                Cremas Skala
              </a>
              <a href="#productos" className="block text-muted-foreground hover:text-primary transition-colors">
                Perfumes Árabes
              </a>
              <a href="#productos" className="block text-muted-foreground hover:text-primary transition-colors">
                Pasta Dental
              </a>
            </div>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Contacto</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <span>+54 9 3764 14-5766</span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span>tikvaok@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Posadas, Misiones, Argentina</span>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Información</h4>
            <div className="space-y-2">
              <div className="text-muted-foreground">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Envío Gratis</span>
                </div>
                <p className="text-sm">En todas las compras</p>
              </div>
              
              <div className="text-muted-foreground">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">Atención 24/7</span>
                </div>
                <p className="text-sm">Soporte por WhatsApp</p>
              </div>
              
              <div className="text-muted-foreground">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm font-medium">Calidad Premium</span>
                </div>
                <p className="text-sm">Productos garantizados</p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Bottom Footer */}
        <div className="py-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © {currentYear} Tikvá. Todos los derechos reservados.
          </div>
          
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <span>Hecho con</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>para nuestros clientes</span>
          </div>
          

        </div>
      </div>
    </footer>
  );
};