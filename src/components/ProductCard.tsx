import React from 'react';
import { Card, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ShoppingCart, Eye, MessageCircle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number;
  boxPrice?: number;
  sizes?: string;
  stock?: number;
}

interface ProductCardProps {
  product: Product;
  currency: string;
  exchangeRates: { USD: number; ARS: number; PYG: number };
  onAddToCart: (product: Product) => void;
  onBuyOnWhatsApp: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  exchangeRates,
  onAddToCart,
  onBuyOnWhatsApp,
  onViewDetails
}) => {
  const formatPrice = (price: number) => {
    // Los precios están guardados en ARS (moneda base)
    let convertedPrice = price;
    
    if (currency === 'USD') {
      convertedPrice = price / exchangeRates.USD;
    } else if (currency === 'PYG') {
      convertedPrice = price / exchangeRates.PYG;
    }
    // Para ARS no necesitamos conversión ya que es la moneda base
    
    const symbol = currency === 'USD' ? 'US$' : currency === 'ARS' ? '$' : '₲';
    return `${symbol}${Math.round(convertedPrice).toLocaleString()}`;
  };

  return (
    <Card className="group h-full backdrop-blur-md bg-background/80 border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
      <CardContent className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={() => onViewDetails(product)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-medium line-clamp-2 flex-1">{product.name}</h3>
            <Badge variant="secondary" className="ml-2 shrink-0">
              {product.category}
            </Badge>
          </div>
          
          <div className="space-y-1">
            <p className="text-lg font-semibold text-primary">
              {formatPrice(product.price)}
            </p>
            {product.boxPrice && (
              <p className="text-sm text-muted-foreground">
                Caja (6u): {formatPrice(product.boxPrice)}
              </p>
            )}
            {product.sizes && (
              <p className="text-sm text-muted-foreground">
                Talles: {product.sizes}
              </p>
            )}
            {product.stock !== undefined && (
              <p className="text-xs text-muted-foreground">
                Stock: {product.stock}
              </p>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex flex-col gap-2">
        <Button 
          onClick={() => onAddToCart(product)}
          className="w-full shadow-sm hover:shadow-md transition-shadow"
          disabled={product.stock === 0}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.stock === 0 ? 'Sin Stock' : 'Añadir al Carrito'}
        </Button>
        <Button 
          onClick={() => onBuyOnWhatsApp(product)}
          variant="outline"
          size="sm"
          className="w-full bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-700 dark:text-green-400 transition-all"
          disabled={product.stock === 0}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          {product.stock === 0 ? 'Sin Stock' : 'Comprar por WhatsApp'}
        </Button>
      </CardFooter>
    </Card>
  );
};
