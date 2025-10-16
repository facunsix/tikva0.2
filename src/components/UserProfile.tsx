import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { User, ShoppingBag, Calendar, Package } from 'lucide-react';
import { CartItem } from './CartModal';

interface UserData {
  name: string;
  email: string;
  registeredAt: string;
  isAdmin: boolean;
}

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
  userData: UserData;
  cartHistory: CartItem[];
}

export const UserProfile: React.FC<UserProfileProps> = ({
  isOpen,
  onClose,
  userData,
  cartHistory
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Perfil de Usuario</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información personal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Información Personal</span>
                {userData.isAdmin && (
                  <Badge variant="destructive">Admin</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Nombre</label>
                  <p className="font-medium">{userData.name}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Email</label>
                  <p className="font-medium">{userData.email}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Miembro desde</label>
                  <p className="font-medium flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(userData.registeredAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Tipo de cuenta</label>
                  <p className="font-medium">{userData.isAdmin ? 'Administrador' : 'Usuario'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Estadísticas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShoppingBag className="h-5 w-5" />
                <span>Estadísticas de Compras</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{cartHistory.length}</p>
                  <p className="text-sm text-muted-foreground">Productos en Carrito</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {new Set(cartHistory.map(item => item.category)).size}
                  </p>
                  <p className="text-sm text-muted-foreground">Categorías Exploradas</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {cartHistory.reduce((sum, item) => sum + item.quantity, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Cantidad Total</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    ${cartHistory.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Valor Total</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Historial del carrito */}
          {cartHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>Productos en Carrito</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {cartHistory.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">{item.category}</Badge>
                            <span className="text-xs text-muted-foreground">
                              Cantidad: {item.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">${(item.price * item.quantity).toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">${item.price.toLocaleString()} c/u</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {cartHistory.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">Carrito vacío</h3>
                <p className="text-muted-foreground text-sm">
                  Aún no has añadido productos a tu carrito
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};