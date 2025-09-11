import React from 'react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { ShoppingCart, User, Sun, Moon, Instagram, Facebook } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface NavbarProps {
  isDarkMode: boolean;
  onThemeToggle: () => void;
  currency: string;
  onCurrencyChange: (currency: string) => void;
  onLoginClick: () => void;
  cartItemsCount: number;
  onCartClick: () => void;
  isLoggedIn: boolean;
  userEmail?: string;
  onLogout: () => void;
  onProfileClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isDarkMode,
  onThemeToggle,
  currency,
  onCurrencyChange,
  onLoginClick,
  cartItemsCount,
  onCartClick,
  isLoggedIn,
  userEmail,
  onLogout,
  onProfileClick
}) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-2 md:px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 md:space-x-4 flex-shrink-0">
            <ImageWithFallback
              src="https://i.ibb.co/1JTm1rQk/logo.png"
              alt="Tikvá Logo"
              className="h-8 md:h-10 w-auto"
            />
            <h1 className="text-lg md:text-xl font-bold text-primary hidden xs:block">Tikvá</h1>
          </div>

          {/* Centro - Enlaces de navegación */}
          <div className="hidden lg:flex items-center space-x-6">
            <a href="#productos" className="hover:text-primary transition-colors">Productos</a>
            <a href="#promociones" className="hover:text-primary transition-colors">Promociones</a>
          </div>

          {/* Derecha - Controles */}
          <div className="flex items-center space-x-1 md:space-x-3">
            {/* Selector de moneda */}
            <Select value={currency} onValueChange={onCurrencyChange}>
              <SelectTrigger className="w-16 md:w-20 h-8 md:h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="ARS">ARS</SelectItem>
                <SelectItem value="PYG">PYG</SelectItem>
              </SelectContent>
            </Select>

            {/* Toggle tema - Solo icono en móvil */}
            <div className="flex items-center">
              <div className="hidden md:flex items-center space-x-2">
                <Sun className="h-4 w-4" />
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={onThemeToggle}
                />
                <Moon className="h-4 w-4" />
              </div>

            </div>

            {/* Redes sociales */}
            <div className="hidden lg:flex items-center space-x-1">
              <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                <a href="https://www.instagram.com/tikva_ok/" target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                <a href="https://www.facebook.com/profile.php?id=61579900372343" target="_blank" rel="noopener noreferrer">
                  <Facebook className="h-4 w-4" />
                </a>
              </Button>
            </div>

            {/* Usuario/Login */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-1 md:space-x-2">
                <Button variant="ghost" onClick={onProfileClick} className="h-8 md:h-10 px-2 md:px-4">
                  <User className="h-4 w-4" />
                  <span className="hidden lg:inline ml-2">{userEmail}</span>
                </Button>
                <Button variant="outline" onClick={onLogout} className="h-8 md:h-10 px-2 md:px-4 text-xs md:text-sm">
                  Salir
                </Button>
              </div>
            ) : (
              <Button onClick={onLoginClick} className="h-8 md:h-10 px-2 md:px-4">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Login</span>
              </Button>
            )}

            {/* Carrito */}
            <Button variant="outline" onClick={onCartClick} className="relative h-8 md:h-10 w-8 md:w-10 p-0">
              <ShoppingCart className="h-4 w-4" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 md:h-5 md:w-5 flex items-center justify-center text-[10px] md:text-xs">
                  {cartItemsCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
