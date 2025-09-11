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
    // Solo permitir agregar al carrito si el usuario está logueado
    if (!currentUser) {
      toast.error('Debes iniciar sesión para agregar productos al carrito');
      setCurrentPage('login');
      return;
    }

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
    if (!currentUser) {
      setCurrentPage('login');
      return;
    }

    const message = `🛒 *Pedido desde Tikvá*\n\n` +
      cartItems.map(item => 
        `• ${item.name}\n  Cantidad: ${item.quantity}\n  Precio: $${(item.price * item.quantity).toLocaleString()}`
      ).join('\n\n') +
      `\n\n💰 *Total: $${cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}*\n\n` +
      `🚚 *Envío gratis incluido*\n\n` +
      `👤 *Cliente:* ${currentUser.name}\n📧 *Email:* ${currentUser.email}`;
    
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
                  : 'Descubre nuestra selección de productos de calidad premium con envío gratis y los mejores precios del mercado'
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
        isLoggedIn={!!currentUser}
        onLoginRequired={() => setCurrentPage('login')}
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
