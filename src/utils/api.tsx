import { projectId, publicAnonKey } from './supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-810d4700`;

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Helper para hacer requests
async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {},
  useAuth = false,
  isAdminRequest = false
): Promise<ApiResponse<T>> {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (useAuth) {
      const accessToken = localStorage.getItem('tikva-access-token');
      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      } else {
        headers.Authorization = `Bearer ${publicAnonKey}`;
      }
    } else {
      headers.Authorization = `Bearer ${publicAnonKey}`;
    }

    // Para requests de admin, añadir autenticación especial
    if (isAdminRequest) {
      const savedUser = localStorage.getItem('tikva-user');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        if (userData.email === 'facu.esteche05@gmail.com' && userData.isAdmin) {
          // Añadir header especial para admin
          headers['X-Admin-Auth'] = JSON.stringify({
            email: userData.email,
            password: 'admin123'
          });
        }
      }
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Error en la solicitud' };
    }

    return { success: true, data };
  } catch (error) {
    console.error('API Error:', error);
    return { success: false, error: 'Error de conexión' };
  }
}

// Autenticación
export const authApi = {
  async signup(userData: { email: string; password: string; name: string }) {
    return apiRequest('/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  async signin(credentials: { email: string; password: string }) {
    return apiRequest('/signin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
};

// Productos
export const productsApi = {
  async getAll() {
    return apiRequest('/products');
  },

  async create(product: any) {
    return apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    }, true, true);
  },

  async update(id: string, product: any) {
    return apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    }, true, true);
  },

  async delete(id: string) {
    return apiRequest(`/products/${id}`, {
      method: 'DELETE',
    }, true, true);
  },
};

// Carrito
export const cartApi = {
  async get(email: string) {
    return apiRequest(`/cart/${encodeURIComponent(email)}`);
  },

  async save(email: string, cart: any[]) {
    return apiRequest(`/cart/${encodeURIComponent(email)}`, {
      method: 'POST',
      body: JSON.stringify(cart),
    });
  },
};

// Tipos de cambio
export const exchangeRatesApi = {
  async get() {
    return apiRequest('/exchange-rates');
  },

  async update(rates: { USD: number; ARS: number; PYG: number }) {
    return apiRequest('/exchange-rates', {
      method: 'POST',
      body: JSON.stringify(rates),
    }, true, true);
  },
};

// Health check
export const healthApi = {
  async check() {
    return apiRequest('/health');
  },
};