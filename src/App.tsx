import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LoginPage } from './components/LoginPage';
import { ProductGrid } from './components/ProductGrid';
import { ProductModal } from './components/ProductModal';
import { CartModal, CartItem } from './components/CartModal';
import { AdminPanel } from './components/AdminPanel';
import { UserProfile } from './components/UserProfile';
import { PromoBanner } from './components/PromoBanner';
import { FeaturedSections } from './components/FeaturedSections';
import { Footer } from './components/Footer';
import { Product } from './components/ProductCard';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';
import { authApi, productsApi, cartApi, exchangeRatesApi } from './utils/api';

// Datos iniciales de productos
const initialProducts: Product[] = [
  // Zapatillas
  {
    id: '1',
    name: 'Vans Old Skool',
    category: 'Zapatillas',
    image: 'https://i.ibb.co/XnFqDZz/vans2.jpg',
    price: 36000,
    sizes: '34-38',
    stock: 15
  },
  {
    id: '2',
    name: 'Vans Old Skool Black',
    category: 'Zapatillas',
    image: 'https://i.ibb.co/9991FgJR/vans3.jpg',
    price: 36000,
    sizes: '38-42',
    stock: 12
  },
  {
    id: '3',
    name: 'Vans Old Skool White',
    category: 'Zapatillas',
    image: 'https://i.ibb.co/FL3t2TQg/vans11.jpg',
    price: 36000,
    sizes: '34-38',
    stock: 18
  },
  {
    id: '4',
    name: 'New Balance 740',
    category: 'Zapatillas',
    image: 'https://i.ibb.co/VsFvFBL/nb1.jpg',
    price: 45000,
    sizes: '35-39',
    stock: 8
  },
  {
    id: '5',
    name: 'Botas CAT Impermeables',
    category: 'Zapatillas',
    image: 'https://i.ibb.co/wrswVjXX/cat2.jpg',
    price: 35000,
    sizes: '38-43',
    stock: 6
  },
  {
    id: '6',
    name: 'Adidas SL 72 N',
    category: 'Zapatillas',
    image: 'https://i.ibb.co/DPDkYyb0/adidas2.jpg',
    price: 43000,
    sizes: '35-39',
    stock: 10
  },
  {
    id: '7',
    name: 'Adidas SL 72 RS',
    category: 'Zapatillas',
    image: 'https://i.ibb.co/SDGZ1wMX/adidas1.jpg',
    price: 40000,
    sizes: '34-38',
    stock: 14
  },
  {
    id: '8',
    name: 'Pumas Caven 2.0',
    category: 'Zapatillas',
    image: 'https://i.ibb.co/8nKNz3SG/pumas1.jpg',
    price: 42700,
    sizes: '38-41',
    stock: 9
  },
  // Cremas Skala
  {
    id: '9',
    name: 'Skala Crema Para Peinar Abacate',
    category: 'Cremas Skala',
    image: 'https://i.ibb.co/MDyVFdDJ/skaabacate.png',
    price: 6390,
    boxPrice: 33590,
    stock: 25
  },
  {
    id: '10',
    name: 'Skala Impecavel Ceramidas G3 Crema Acondicionador',
    category: 'Cremas Skala',
    image: 'https://i.ibb.co/CK9ccxsk/skacera.png',
    price: 6800,
    boxPrice: 37200,
    stock: 30
  },
  {
    id: '11',
    name: 'Mascara Skala Coquetel De Frutas Liberada Vegana',
    category: 'Cremas Skala',
    image: 'https://i.ibb.co/8Lj1tPrd/skabebe.png',
    price: 6490,
    boxPrice: 34900,
    stock: 20
  },
  {
    id: '12',
    name: 'Skala Crema De Peinar Hidratacion Profunda',
    category: 'Cremas Skala',
    image: 'https://i.ibb.co/sdsfMMw7/babosa.png',
    price: 6000,
    boxPrice: 31200,
    stock: 22
  },
  {
    id: '13',
    name: 'Skala Mascara Crema Vinagre De Maca Manzana Vegana',
    category: 'Cremas Skala',
    image: 'https://i.ibb.co/0jM0PShT/manza.png',
    price: 6300,
    boxPrice: 35400,
    stock: 18
  },
  {
    id: '14',
    name: 'Mascara Skala 12 En 1 Restauración',
    category: 'Cremas Skala',
    image: 'https://i.ibb.co/s9cmCNJk/12-1.png',
    price: 5350,
    boxPrice: 29700,
    stock: 35
  },
  {
    id: '15',
    name: 'Skala Máscara Coco Frutástica 2 En 1 Nutrición',
    category: 'Cremas Skala',
    image: 'https://i.ibb.co/Nnyd1PZ3/coco.png',
    price: 5600,
    boxPrice: 30600,
    stock: 28
  },
  {
    id: '16',
    name: 'Máscara Skala MAIS CACHOS hidratación',
    category: 'Cremas Skala',
    image: 'https://i.ibb.co/xqNgXntL/celeste.png',
    price: 9120,
    boxPrice: 48120,
    stock: 15
  },
  {
    id: '17',
    name: 'Mascara Divino Potao Crema Peinar Rulos Skala Vegana',
    category: 'Cremas Skala',
    image: 'https://i.ibb.co/bjwz8VSZ/rosada.png',
    price: 6450,
    boxPrice: 35800,
    stock: 24
  },
  {
    id: '18',
    name: 'Mascara Skala 2 En 1 Banana Y Bacuri',
    category: 'Cremas Skala',
    image: 'https://i.ibb.co/v6mP9nQ7/banana.png',
    price: 5100,
    boxPrice: 27500,
    stock: 32
  },
  {
    id: '19',
    name: 'Skala Potao Desmaiado Máscara Vegana Anti Frizz Pelo',
    category: 'Cremas Skala',
    image: 'https://i.ibb.co/390phs5F/dificil.png',
    price: 5150,
    boxPrice: 27900,
    stock: 26
  },
  {
    id: '20',
    name: 'Mascara Crema Skala Dona 2 En 1 Crema Peinar Vegana',
    category: 'Cremas Skala',
    image: 'https://i.ibb.co/Mk5CBSmT/roda.png',
    price: 5800,
    boxPrice: 30400,
    stock: 19
  },
  {
    id: '21',
    name: 'Baño De Crema Skala Maracuya Fortalecedor',
    category: 'Cremas Skala',
    image: 'https://i.ibb.co/QFXrH5pD/br.png',
    price: 6990,
    boxPrice: 35790,
    stock: 21
  },
  {
    id: '22',
    name: 'Skala Genetic Glicolico Crema Vegana Brillo Hidratación 1kg',
    category: 'Cremas Skala',
    image: 'https://i.ibb.co/yBFY95FH/colico.png',
    price: 6190,
    boxPrice: 32100,
    stock: 17
  },
  {
    id: '23',
    name: 'Skala Macara Capilar Uva 2 En 1 Brillo Extremo',
    category: 'Cremas Skala',
    image: 'https://i.ibb.co/Q7p11Nv3/u.png',
    price: 6890,
    boxPrice: 39500,
    stock: 23
  },
  {
    id: '24',
    name: 'Skala Mascara Crema Para Peinar Frutilla Morango Vegana',
    category: 'Cremas Skala',
    image: 'https://i.ibb.co/jvwv9bjs/moran.png',
    price: 6295,
    boxPrice: 32770,
    stock: 29
  },
  // Pasta dental
  {
    id: '25',
    name: 'Colgate Total 12 Advanced Health',
    category: 'Pasta dental',
    image: 'https://images.unsplash.com/photo-1755086598087-771fc08e1ae5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xnYXRlJTIwdG9vdGhwYXN0ZSUyMGRlbnRhbCUyMGNhcmV8ZW58MXx8fHwxNzU3MjY5MTM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    price: 4500,
    stock: 40
  },
  {
    id: '26',
    name: 'Colgate Luminous White Advanced',
    category: 'Pasta dental',
    image: 'https://images.unsplash.com/photo-1755086598087-771fc08e1ae5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xnYXRlJTIwdG9vdGhwYXN0ZSUyMGRlbnRhbCUyMGNhcmV8ZW58MXx8fHwxNzU3MjY5MTM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    price: 5200,
    stock: 35
  },
  // Perfumes árabes
  {
    id: '27',
    name: 'Perfume Árabe Oud Royal Premium',
    category: 'Perfumes árabes',
    image: 'https://images.unsplash.com/photo-1650686036849-ff87bcaa2e9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmFiaWMlMjBwZXJmdW1lJTIwbHV4dXJ5JTIwZnJhZ3JhbmNlfGVufDF8fHx8MTc1NzI2OTE0MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    price: 18500,
    stock: 12
  },
  {
    id: '28',
    name: 'Perfume Árabe Rose Damascus Luxury',
    category: 'Perfumes árabes',
    image: 'https://images.unsplash.com/photo-1650686036849-ff87bcaa2e9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmFiaWMlMjBwZXJmdW1lJTIwbHV4dXJ5JTIwZnJhZ3JhbmNlfGVufDF8fHx8MTc1NzI2OTE0MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    price: 22000,
    stock: 8
  }
];

interface UserData {
  name: string;
  email: string;
  registeredAt: string;
  isAdmin: boolean;
}

export default function App() {
  // Estados principales
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currency, setCurrency] = useState('ARS');
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // Estados de páginas y modales
  const [currentPage, setCurrentPage] = useState<'main' | 'login'>('main');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  
  // Estados de datos
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [exchangeRates, setExchangeRates] = useState({ USD: 1200, ARS: 1, PYG: 0.00015 });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Aplicar tema
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Cargar usuario guardado
        const savedUser = localStorage.getItem('tikva-user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setCurrentUser(userData);
          await loadUserCart(userData.email);
        }

        // Cargar tipos de cambio
        const ratesResponse = await exchangeRatesApi.get();
        if (ratesResponse.success && ratesResponse.data?.rates) {
          setExchangeRates(ratesResponse.data.rates);
        }

        // Cargar productos desde la base de datos
        const productsResponse = await productsApi.getAll();
        if (productsResponse.success && productsResponse.data?.products) {
          if (productsResponse.data.products.length > 0) {
            setProducts(productsResponse.data.products);
          } else {
            // Si no hay productos en la BD, usar los iniciales y subirlos
            await initializeProducts();
          }
        }
      } catch (error) {
        console.error('Error cargando datos iniciales:', error);
        toast.error('Error cargando datos. Usando datos locales.');
      }
    };

    loadInitialData();
  }, []);

  // Inicializar productos en la base de datos
  const initializeProducts = async () => {
    for (const product of initialProducts) {
      try {
        await productsApi.create(product);
      } catch (error) {
        console.error('Error inicializando producto:', product.name, error);
      }
    }
    toast.success('Productos inicializados en la base de datos');
  };

  // Restaurar carrito cuando el usuario inicie sesión
  useEffect(() => {
    if (currentUser) {
      const userCartKey = `tikva-cart-${currentUser.email}`;
      const savedUserCart = localStorage.getItem(userCartKey);
      if (savedUserCart) {
        try {
          const parsedCart = JSON.parse(savedUserCart);
          setCartItems(parsedCart);
        } catch (error) {
          console.error('Error loading user cart from localStorage:', error);
          setCartItems([]);
        }
      }
    }
  }, [currentUser]);

  // Guardar carrito específico del usuario (solo si está logueado)
  useEffect(() => {
    if (currentUser && cartItems.length >= 0) {
      // Guardar en localStorage como respaldo
      const userCartKey = `tikva-cart-${currentUser.email}`;
      localStorage.setItem(userCartKey, JSON.stringify(cartItems));
      
      // Guardar en la base de datos
      saveUserCart(currentUser.email, cartItems);
    }
  }, [cartItems, currentUser]);

  // Funciones de navegación
  const scrollToProducts = () => {
    const element = document.getElementById('productos');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNavigateToCategory = (category: string) => {
    setSelectedCategory(category);
    scrollToProducts();
    toast.success(`Mostrando productos de ${category}`);
  };

  const clearCategoryFilter = () => {
    setSelectedCategory(null);
  };

  // Filtrar productos por categoría si hay una seleccionada
  const filteredProducts = selectedCategory 
    ? products.filter(product => product.category === selectedCategory)
    : products;

  // Cargar carrito del usuario desde la base de datos
  const loadUserCart = async (email: string) => {
    try {
      const response = await cartApi.get(email);
      if (response.success && response.data?.cart) {
        setCartItems(response.data.cart);
      }
    } catch (error) {
      console.error('Error cargando carrito:', error);
    }
  };

  // Guardar carrito en la base de datos
  const saveUserCart = async (email: string, cart: CartItem[]) => {
    try {
      await cartApi.save(email, cart);
    } catch (error) {
      console.error('Error guardando carrito:', error);
    }
  };

  // Funciones de autenticación
  const handleLogin = async (email: string, password: string, name?: string, isRegistering?: boolean) => {
    try {
      if (isRegistering && name) {
        // Registro
        const response = await authApi.signup({ name, email, password });
        
        if (response.success && response.data?.user) {
          setCurrentUser(response.data.user);
          localStorage.setItem('tikva-user', JSON.stringify(response.data.user));
          setCurrentPage('main');
          toast.success(`¡Registro exitoso! Bienvenido ${name}`);
        } else {
          toast.error(response.error || 'Error en el registro');
        }
      } else {
        // Inicio de sesión
        const response = await authApi.signin({ email, password });
        
        if (response.success && response.data?.user) {
          setCurrentUser(response.data.user);
          localStorage.setItem('tikva-user', JSON.stringify(response.data.user));
          setCurrentPage('main');
          toast.success(`¡Bienvenido ${response.data.user.name}!`);
          
          // Cargar carrito del usuario desde la base de datos
          await loadUserCart(email);
          
          if (response.data.user.isAdmin) {
            toast.success('Acceso de administrador activado');
          }
        } else {
          toast.error(response.error || 'Credenciales inválidas');
        }
      }
    } catch (error) {
      console.error('Error en autenticación:', error);
      toast.error('Error de conexión');
    }
  };

  const handleLogout = async () => {
    // Guardar carrito del usuario actual antes de cerrar sesión
    if (currentUser) {
      await saveUserCart(currentUser.email, cartItems);
    }
    
    setCurrentUser(null);
    localStorage.removeItem('tikva-user');
    // Limpiar el carrito completamente al cerrar sesión
    setCartItems([]);
    toast.success('Sesión cerrada exitosamente');
  };

  // Funciones del carrito
  const handleAddToCart = (product: Product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
    
    toast.success(`${product.name} añadido al carrito`);
  };

  // Nueva función para comprar directamente por WhatsApp
  const handleBuyOnWhatsApp = (product: Product) => {
    const message = `🛒 *Pedido desde Tikvá*\\n\\n` +
      `• ${product.name}\\n  Cantidad: 1\\n  Precio: ${product.price.toLocaleString()}` +
      `\\n\\n💰 *Total: ${product.price.toLocaleString()}*\\n\\n` +
      `🚚 *Envío a domicilio disponible*`;
    
    const whatsappUrl = `https://wa.me/5493764145766?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    toast.success('Redirigiendo a WhatsApp...');
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      handleRemoveFromCart(productId);
      return;
    }
    
    setCartItems(cartItems.map(item =>
      item.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
    toast.success('Producto eliminado del carrito');
  };

  const handleCheckout = () => {
    let message = `🛒 *Pedido desde Tikvá*\\n\\n` +
      cartItems.map(item => 
        `• ${item.name}\\n  Cantidad: ${item.quantity}\\n  Precio: ${(item.price * item.quantity).toLocaleString()}`
      ).join('\\n\\n') +
      `\\n\\n💰 *Total: ${cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}*\\n\\n` +
      `🚚 *Envío a domicilio disponible*`;
    
    // Agregar información del cliente solo si está logueado
    if (currentUser) {
      message += `\\n\\n👤 *Cliente:* ${currentUser.name}\\n📧 *Email:* ${currentUser.email}`;
    }
    
    const whatsappUrl = `https://wa.me/5493764145766?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    setIsCartModalOpen(false);
    toast.success('Redirigiendo a WhatsApp...');
  };

  // Funciones de administración
  const handleUpdateProduct = async (updatedProduct: Product) => {
    try {
      const response = await productsApi.update(updatedProduct.id, updatedProduct);
      if (response.success) {
        setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
        toast.success('Producto actualizado');
      } else {
        toast.error(response.error || 'Error actualizando producto');
      }
    } catch (error) {
      console.error('Error actualizando producto:', error);
      toast.error('Error de conexión');
    }
  };

  const handleAddProduct = async (newProduct: Omit<Product, 'id'>) => {
    try {
      const response = await productsApi.create(newProduct);
      if (response.success && response.data?.product) {
        setProducts([...products, response.data.product]);
        toast.success('Producto añadido');
      } else {
        toast.error(response.error || 'Error añadiendo producto');
      }
    } catch (error) {
      console.error('Error añadiendo producto:', error);
      toast.error('Error de conexión');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const response = await productsApi.delete(productId);
      if (response.success) {
        setProducts(products.filter(p => p.id !== productId));
        toast.success('Producto eliminado');
      } else {
        toast.error(response.error || 'Error eliminando producto');
      }
    } catch (error) {
      console.error('Error eliminando producto:', error);
      toast.error('Error de conexión');
    }
  };

  // Funciones de producto
  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  // Mostrar página de login si no estamos en main
  if (currentPage === 'login') {
    return (
      <div className="min-h-screen bg-background">
        <LoginPage 
          onLogin={handleLogin}
          onBack={() => setCurrentPage('main')}
        />
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <Navbar
        isDarkMode={isDarkMode}
        onThemeToggle={() => setIsDarkMode(!isDarkMode)}
        currency={currency}
        onCurrencyChange={setCurrency}
        onLoginClick={() => setCurrentPage('login')}
        cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setIsCartModalOpen(true)}
        isLoggedIn={!!currentUser}
        userEmail={currentUser?.email}
        onLogout={handleLogout}
        onProfileClick={() => setIsUserProfileOpen(true)}
      />

      {/* Contenido principal */}
      <main className="pt-16">
        {/* Banner de promociones */}
        <PromoBanner onScrollToProducts={scrollToProducts} />

        {/* Secciones destacadas */}
        <FeaturedSections onNavigateToCategory={handleNavigateToCategory} />

        {/* Sección de productos */}
        <section id="productos" className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">
                {selectedCategory ? `${selectedCategory}` : 'Nuestros Productos'}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {selectedCategory 
                  ? `Explora nuestra selección de ${selectedCategory.toLowerCase()} de calidad premium` 
                  : 'Descubre nuestra selección de productos de calidad premium con envío a domicilio y los mejores precios del mercado'
                }
              </p>
              {selectedCategory && (
                <button
                  onClick={clearCategoryFilter}
                  className="mt-4 text-primary hover:text-primary/80 transition-colors underline"
                >
                  Ver todos los productos
                </button>
              )}
            </div>

            <ProductGrid
              products={filteredProducts}
              currency={currency}
              exchangeRates={exchangeRates}
              onAddToCart={handleAddToCart}
              onBuyOnWhatsApp={handleBuyOnWhatsApp}
              onViewDetails={handleViewDetails}
            />
          </div>
        </section>

        {/* Botón flotante de admin */}
        {currentUser?.isAdmin && (
          <button
            onClick={() => setIsAdminPanelOpen(true)}
            className="fixed bottom-6 right-6 bg-primary text-primary-foreground p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-40"
          >
            ⚙️
          </button>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modales */}

      <ProductModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        currency={currency}
        exchangeRates={exchangeRates}
        onAddToCart={handleAddToCart}
        onBuyOnWhatsApp={handleBuyOnWhatsApp}
      />

      <CartModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
        cartItems={cartItems}
        currency={currency}
        exchangeRates={exchangeRates}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />

      {currentUser?.isAdmin && (
        <AdminPanel
          isOpen={isAdminPanelOpen}
          onClose={() => setIsAdminPanelOpen(false)}
          products={products}
          onUpdateProduct={handleUpdateProduct}
          onAddProduct={handleAddProduct}
          onDeleteProduct={handleDeleteProduct}
          exchangeRates={exchangeRates}
          onUpdateExchangeRates={async (rates) => {
            try {
              const response = await exchangeRatesApi.update(rates);
              if (response.success) {
                setExchangeRates(rates);
                toast.success('Tipos de cambio actualizados');
              } else {
                toast.error(response.error || 'Error actualizando tipos de cambio');
              }
            } catch (error) {
              console.error('Error actualizando tipos de cambio:', error);
              toast.error('Error de conexión');
            }
          }}
        />
      )}

      {currentUser && (
        <UserProfile
          isOpen={isUserProfileOpen}
          onClose={() => setIsUserProfileOpen(false)}
          userData={currentUser}
          cartHistory={cartItems}
        />
      )}

      {/* Toast notifications */}
      <Toaster />
    </div>
  );
}
