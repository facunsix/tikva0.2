import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Settings, Package, Plus, Edit, DollarSign, Trash2 } from 'lucide-react';
import { Product } from './ProductCard';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUpdateProduct: (product: Product) => void;
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onDeleteProduct: (productId: string) => void;
  exchangeRates: { USD: number; ARS: number; PYG: number };
  onUpdateExchangeRates: (rates: { USD: number; ARS: number; PYG: number }) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  products,
  onUpdateProduct,
  onAddProduct,
  onDeleteProduct,
  exchangeRates,
  onUpdateExchangeRates
}) => {
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Zapatillas',
    image: '',
    price: 0,
    boxPrice: 0,
    sizes: '',
    stock: 0
  });

  const [tempRates, setTempRates] = useState(exchangeRates);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const categories = ['Zapatillas', 'Cremas Skala', 'Perfumes árabes', 'Pasta dental'];

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    onAddProduct({
      ...newProduct,
      boxPrice: newProduct.boxPrice || undefined
    });
    setNewProduct({
      name: '',
      category: 'Zapatillas',
      image: '',
      price: 0,
      boxPrice: 0,
      sizes: '',
      stock: 0
    });
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      onUpdateProduct(editingProduct);
      setEditingProduct(null);
    }
  };

  const handleUpdateRates = () => {
    onUpdateExchangeRates(tempRates);
    // Actualizar los rates temporales con los nuevos valores
    setTempRates(tempRates);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Panel de Administración</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="products" className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products">Productos</TabsTrigger>
            <TabsTrigger value="add-product">Añadir Producto</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="overflow-y-auto max-h-[60vh] space-y-4">
            <div className="space-y-4">
              {products.map((product) => (
                <Card key={product.id}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <ImageWithFallback
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <h4 className="font-medium">{product.name}</h4>
                          <Badge variant="secondary">{product.category}</Badge>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setEditingProduct(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            if (window.confirm(`¿Estás seguro de eliminar \"${product.name}\"?`)) {
                              onDeleteProduct(product.id);
                            }
                          }}
                          className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Precio:</span>
                        <p className="font-medium">${product.price.toLocaleString()}</p>
                      </div>
                      {product.boxPrice && (
                        <div>
                          <span className="text-muted-foreground">Precio Caja:</span>
                          <p className="font-medium">${product.boxPrice.toLocaleString()}</p>
                        </div>
                      )}
                      {product.sizes && (
                        <div>
                          <span className="text-muted-foreground">Talles:</span>
                          <p className="font-medium">{product.sizes}</p>
                        </div>
                      )}
                      <div>
                        <span className="text-muted-foreground">Stock:</span>
                        <p className={`font-medium ${product.stock === 0 ? 'text-red-500' : product.stock && product.stock < 10 ? 'text-yellow-500' : 'text-green-500'}`}>
                          {product.stock || 0} unidades
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="add-product" className="space-y-4">
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nombre del Producto</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Categoría</Label>
                  <Select
                    value={newProduct.category}
                    onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="image">URL de Imagen</Label>
                  <Input
                    id="image"
                    type="url"
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="price">Precio</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="boxPrice">Precio Caja (opcional)</Label>
                  <Input
                    id="boxPrice"
                    type="number"
                    value={newProduct.boxPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, boxPrice: Number(e.target.value) })}
                  />
                </div>

                <div>
                  <Label htmlFor="sizes">Talles (opcional)</Label>
                  <Input
                    id="sizes"
                    value={newProduct.sizes}
                    onChange={(e) => setNewProduct({ ...newProduct, sizes: e.target.value })}
                    placeholder="ej: 34-38"
                  />
                </div>

                <div>
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Añadir Producto
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>Tipos de Cambio</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground mb-4">
                    Configure las tasas de conversión. ARS es la moneda base (valor = 1).
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="ars">ARS (Pesos Argentinos) - Base</Label>
                      <Input
                        id="ars"
                        type="number"
                        step="0.01"
                        value={tempRates.ARS}
                        onChange={(e) => setTempRates({ ...tempRates, ARS: Number(e.target.value) })}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Moneda base (siempre = 1)</p>
                    </div>
                    <div>
                      <Label htmlFor="usd">USD (Dólares)</Label>
                      <Input
                        id="usd"
                        type="number"
                        step="0.01"
                        value={tempRates.USD}
                        onChange={(e) => setTempRates({ ...tempRates, USD: Number(e.target.value) })}
                      />
                      <p className="text-xs text-muted-foreground mt-1">¿Cuántos ARS vale 1 USD?</p>
                    </div>
                    <div>
                      <Label htmlFor="pyg">PYG (Guaraníes)</Label>
                      <Input
                        id="pyg"
                        type="number"
                        step="0.01"
                        value={tempRates.PYG}
                        onChange={(e) => setTempRates({ ...tempRates, PYG: Number(e.target.value) })}
                      />
                      <p className="text-xs text-muted-foreground mt-1">¿Cuántos ARS vale 1 PYG? (ej: 0.00015)</p>
                    </div>
                  </div>
                </div>
                <Button onClick={handleUpdateRates}>
                  Actualizar Tipos de Cambio
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estadísticas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{products.length}</p>
                    <p className="text-sm text-muted-foreground">Total Productos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {products.filter(p => p.stock && p.stock > 0).length}
                    </p>
                    <p className="text-sm text-muted-foreground">En Stock</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-600">
                      {products.filter(p => p.stock && p.stock > 0 && p.stock <= 10).length}
                    </p>
                    <p className="text-sm text-muted-foreground">Stock Bajo</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">
                      {products.filter(p => !p.stock || p.stock === 0).length}
                    </p>
                    <p className="text-sm text-muted-foreground">Sin Stock</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modal de edición */}
        {editingProduct && (
          <Dialog open={true} onOpenChange={() => setEditingProduct(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Producto</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpdateProduct} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nombre</Label>
                    <Input
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label>Categoría</Label>
                    <Select
                      value={editingProduct.category}
                      onValueChange={(value) => setEditingProduct({ ...editingProduct, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label>URL de Imagen</Label>
                    <Input
                      type="url"
                      value={editingProduct.image}
                      onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                    />
                    {editingProduct.image && (
                      <div className="mt-2">
                        <ImageWithFallback
                          src={editingProduct.image}
                          alt="Preview"
                          className="w-20 h-20 object-cover rounded border"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label>Precio</Label>
                    <Input
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    />
                  </div>
                  
                  <div>
                    <Label>Precio Caja (opcional)</Label>
                    <Input
                      type="number"
                      value={editingProduct.boxPrice || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, boxPrice: Number(e.target.value) || undefined })}
                    />
                  </div>
                  
                  <div>
                    <Label>Talles (opcional)</Label>
                    <Input
                      value={editingProduct.sizes || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, sizes: e.target.value })}
                      placeholder="ej: 34-38"
                    />
                  </div>
                  
                  <div>
                    <Label>Stock</Label>
                    <Input
                      type="number"
                      value={editingProduct.stock || 0}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    />
                  </div>
                </div>
                
                <div className="flex justify-between pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setEditingProduct(null)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">Guardar Cambios</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
};