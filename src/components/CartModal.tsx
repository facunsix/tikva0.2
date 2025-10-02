import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ShoppingCart, Plus, Minus, Trash2, MessageCircle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Product } from './ProductCard';

export interface CartItem extends Product {
  quantity: number;
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  currency: string;
  exchangeRates: { USD: number; ARS: number; PYG: number };
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  currency,
  exchangeRates,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
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

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);



  const generateWhatsAppMessage = () => {
    const message = `🛒 *Pedido desde Tikvá*\\n\\n` +
      cartItems.map(item => 
        `• ${item.name}\\n  Cantidad: ${item.quantity}\\n  Precio: ${formatPrice(item.price * item.quantity)}`
      ).join('\\n\\n') +
      `\\n\\n💰 *Total: ${formatPrice(total)}*\\n\\n` +
      `🚚 *Envío gratis incluido*`;
    
    return encodeURIComponent(message);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5" />
            <span>Carrito de Compras</span>
            <Badge variant="secondary">{cartItems.length} productos</Badge>
          </DialogTitle>
        </DialogHeader>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <ShoppingCart className="h-16 w-16 text-muted-foreground" />
            <h3 className="text-lg font-medium">Tu carrito está vacío</h3>
            <p className="text-muted-foreground text-center">
              Explora nuestros productos y añade algunos al carrito
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="p-4 bg-muted/50 rounded-lg">
                  {/* Layout móvil: vertical */}
                  <div className="flex flex-col sm:hidden space-y-3">
                    {/* Fila superior: imagen + info */}
                    <div className="flex items-start space-x-3">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium line-clamp-2">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">{item.category}</p>
                        <p className="text-sm font-medium text-primary mt-1">
                          {formatPrice(item.price)} c/u
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive flex-shrink-0"
                        onClick={() => onRemoveItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Fila inferior: controles cantidad + precio total */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-muted-foreground">Cantidad:</span>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-10 text-center font-medium text-base">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total:</p>
                        <p className="font-semibold text-primary">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Layout desktop: horizontal */}
                  <div className="hidden sm:flex items-center space-x-4">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                      <p className="text-sm font-medium text-primary">
                        {formatPrice(item.price)} c/u
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="text-right">
                      <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => onRemoveItem(item.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-4">
              {/* Banner de envío gratis */}
              <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-3">
                <p className="text-sm text-green-700 dark:text-green-300 text-center font-medium">
                  🚚 ¡Envío gratis incluido en tu pedido!
                </p>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total:</span>
                <span className="text-primary">{formatPrice(total)}</span>
              </div>

              {/* Botón de compra */}
              <Button
                onClick={onCheckout}
                className="w-full"
                size="lg"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Comprar por WhatsApp
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};