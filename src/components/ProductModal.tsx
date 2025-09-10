import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ShoppingCart, Package } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Product } from './ProductCard';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  currency: string;
  exchangeRates: { USD: number; ARS: number; PYG: number };
  onAddToCart: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
  currency,
  exchangeRates,
  onAddToCart
}) => {
  if (!product) return null;

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{product.name}</span>
            <Badge variant="secondary">{product.category}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Imagen */}
          <div className="space-y-4">
            <div className="rounded-lg overflow-hidden">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-80 object-cover"
              />
            </div>
          </div>

          {/* Detalles */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
              <p className="text-muted-foreground">
                Categoría: {product.category}
              </p>
            </div>

            {/* Precios */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
                <span className="text-sm text-muted-foreground">por unidad</span>
              </div>
              
              {product.boxPrice && (
                <div className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-secondary" />
                  <span className="text-lg font-semibold text-secondary">
                    {formatPrice(product.boxPrice)}
                  </span>
                  <span className="text-sm text-muted-foreground">caja (6 unidades)</span>
                </div>
              )}
            </div>

            {/* Información adicional */}
            <div className="space-y-2">
              {product.sizes && (
                <div>
                  <span className="font-medium">Talles disponibles: </span>
                  <span className="text-muted-foreground">{product.sizes}</span>
                </div>
              )}
              
              {product.stock !== undefined && (
                <div>
                  <span className="font-medium">Stock disponible: </span>
                  <span className={`${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {product.stock} unidades
                  </span>
                </div>
              )}
            </div>

            {/* Botones de acción */}
            <div className="space-y-3">
              <Button 
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className="w-full"
                size="lg"
                disabled={product.stock === 0}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {product.stock === 0 ? 'Sin Stock' : 'Añadir al Carrito'}
              </Button>
              
              {product.boxPrice && product.stock !== 0 && (
                <Button 
                  onClick={() => {
                    // Crear producto de caja
                    const boxProduct = {
                      ...product,
                      id: `${product.id}-box`,
                      name: `${product.name} (Caja x6)`,
                      price: product.boxPrice
                    };
                    onAddToCart(boxProduct);
                    onClose();
                  }}
                  variant="secondary"
                  className="w-full"
                  size="lg"
                >
                  <Package className="h-5 w-5 mr-2" />
                  Añadir Caja (6 unidades)
                </Button>
              )}
            </div>

            {/* Banner de envío gratis */}
            <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <p className="text-sm text-green-700 dark:text-green-300 text-center font-medium">
                🚚 ¡Envío gratis en todas las compras!
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};