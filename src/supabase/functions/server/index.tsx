import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors({
  origin: '*',
  allowHeaders: ['*'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

app.use('*', logger(console.log));

// Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Función para verificar permisos de administrador
async function verifyAdminAuth(c: any): Promise<{ isValid: boolean; error?: string; email?: string }> {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return { isValid: false, error: 'Token de autorización requerido' };
    }

    // Si es el token público anónimo, verificar si es admin con credenciales especiales
    if (accessToken === Deno.env.get('SUPABASE_ANON_KEY')) {
      // Para admin, requerir validación especial mediante header personalizado
      const adminAuth = c.req.header('X-Admin-Auth');
      if (!adminAuth) {
        return { isValid: false, error: 'Autenticación de administrador requerida' };
      }

      try {
        const { email, password } = JSON.parse(adminAuth);
        
        // Verificar credenciales exactas del admin
        if (email === 'facu.esteche05@gmail.com' && password === 'admin123') {
          // Verificar que está marcado como admin en KV Store
          const userData = await kv.get(`user:${email}`);
          if (userData?.isAdmin === true) {
            return { isValid: true, email };
          }
        }
        
        return { isValid: false, error: 'Credenciales de administrador inválidas' };
      } catch {
        return { isValid: false, error: 'Formato de autenticación inválido' };
      }
    }

    // Para usuarios normales, verificar token de Supabase
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user) {
      return { isValid: false, error: 'Usuario no autorizado' };
    }

    // Verificar si es admin en KV Store
    const userData = await kv.get(`user:${user.email}`);
    if (!userData?.isAdmin) {
      return { isValid: false, error: 'Permisos de administrador requeridos' };
    }

    return { isValid: true, email: user.email };
  } catch (error) {
    console.log('Error en verificación de admin:', error);
    return { isValid: false, error: 'Error interno de autenticación' };
  }
}

// Rutas principales con prefijo requerido
const baseRoute = '/make-server-810d4700';

// Usuarios y autenticación
app.post(`${baseRoute}/signup`, async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    // Verificar si es el admin
    const isAdmin = email === 'facu.esteche05@gmail.com' && password === 'admin123';
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, isAdmin },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    // Guardar datos adicionales del usuario
    await kv.set(`user:${email}`, {
      name,
      email,
      registeredAt: new Date().toISOString(),
      isAdmin
    });

    return c.json({ 
      user: { 
        name, 
        email, 
        isAdmin,
        registeredAt: new Date().toISOString() 
      } 
    });
  } catch (error) {
    console.log('Error en signup:', error);
    return c.json({ error: 'Error interno del servidor' }, 500);
  }
});

app.post(`${baseRoute}/signin`, async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    // Verificar si es el admin con credenciales exactas
    if (email === 'facu.esteche05@gmail.com') {
      // Para admin, verificar contraseña exacta
      if (password === 'admin123') {
        // Verificar que está marcado como admin en KV Store
        const existingUserData = await kv.get(`user:${email}`);
        if (existingUserData?.isAdmin === true) {
          const userData = {
            name: 'Admin',
            email,
            registeredAt: existingUserData.registeredAt || new Date().toISOString(),
            isAdmin: true
          };
          
          // Actualizar datos del admin
          await kv.set(`user:${email}`, userData);
          
          return c.json({ user: userData });
        } else {
          return c.json({ error: 'Usuario no tiene permisos de administrador' }, 403);
        }
      } else {
        return c.json({ error: 'Contraseña incorrecta' }, 401);
      }
    }

    // Para otros usuarios, buscar en la base de datos
    const userData = await kv.get(`user:${email}`);
    if (!userData) {
      return c.json({ error: 'Usuario no encontrado' }, 404);
    }

    return c.json({ user: userData });
  } catch (error) {
    console.log('Error en signin:', error);
    return c.json({ error: 'Error interno del servidor' }, 500);
  }
});

// Productos
app.get(`${baseRoute}/products`, async (c) => {
  try {
    const products = await kv.getByPrefix('product:');
    return c.json({ products: products || [] });
  } catch (error) {
    console.log('Error obteniendo productos:', error);
    return c.json({ error: 'Error obteniendo productos' }, 500);
  }
});

app.post(`${baseRoute}/products`, async (c) => {
  try {
    const adminAuth = await verifyAdminAuth(c);
    if (!adminAuth.isValid) {
      return c.json({ error: adminAuth.error }, adminAuth.error?.includes('Token') ? 401 : 403);
    }

    const product = await c.req.json();
    const productId = `product:${Date.now()}`;
    const productWithId = { ...product, id: productId.replace('product:', '') };
    
    await kv.set(productId, productWithId);
    
    return c.json({ product: productWithId });
  } catch (error) {
    console.log('Error creando producto:', error);
    return c.json({ error: 'Error creando producto' }, 500);
  }
});

app.put(`${baseRoute}/products/:id`, async (c) => {
  try {
    const adminAuth = await verifyAdminAuth(c);
    if (!adminAuth.isValid) {
      return c.json({ error: adminAuth.error }, adminAuth.error?.includes('Token') ? 401 : 403);
    }

    const productId = c.req.param('id');
    const updatedProduct = await c.req.json();
    
    await kv.set(`product:${productId}`, updatedProduct);
    
    return c.json({ product: updatedProduct });
  } catch (error) {
    console.log('Error actualizando producto:', error);
    return c.json({ error: 'Error actualizando producto' }, 500);
  }
});

app.delete(`${baseRoute}/products/:id`, async (c) => {
  try {
    const adminAuth = await verifyAdminAuth(c);
    if (!adminAuth.isValid) {
      return c.json({ error: adminAuth.error }, adminAuth.error?.includes('Token') ? 401 : 403);
    }

    const productId = c.req.param('id');
    await kv.del(`product:${productId}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.log('Error eliminando producto:', error);
    return c.json({ error: 'Error eliminando producto' }, 500);
  }
});

// Carrito
app.get(`${baseRoute}/cart/:email`, async (c) => {
  try {
    const email = c.req.param('email');
    const cart = await kv.get(`cart:${email}`);
    return c.json({ cart: cart || [] });
  } catch (error) {
    console.log('Error obteniendo carrito:', error);
    return c.json({ error: 'Error obteniendo carrito' }, 500);
  }
});

app.post(`${baseRoute}/cart/:email`, async (c) => {
  try {
    const email = c.req.param('email');
    const cart = await c.req.json();
    
    await kv.set(`cart:${email}`, cart);
    
    return c.json({ success: true });
  } catch (error) {
    console.log('Error guardando carrito:', error);
    return c.json({ error: 'Error guardando carrito' }, 500);
  }
});

// Configuración de tipos de cambio
app.get(`${baseRoute}/exchange-rates`, async (c) => {
  try {
    const rates = await kv.get('exchange-rates');
    return c.json({ rates: rates || { USD: 1200, ARS: 1, PYG: 0.00015 } });
  } catch (error) {
    console.log('Error obteniendo tipos de cambio:', error);
    return c.json({ error: 'Error obteniendo tipos de cambio' }, 500);
  }
});

app.post(`${baseRoute}/exchange-rates`, async (c) => {
  try {
    const adminAuth = await verifyAdminAuth(c);
    if (!adminAuth.isValid) {
      return c.json({ error: adminAuth.error }, adminAuth.error?.includes('Token') ? 401 : 403);
    }

    const rates = await c.req.json();
    await kv.set('exchange-rates', rates);
    
    return c.json({ rates });
  } catch (error) {
    console.log('Error actualizando tipos de cambio:', error);
    return c.json({ error: 'Error actualizando tipos de cambio' }, 500);
  }
});

// Ruta de salud
app.get(`${baseRoute}/health`, (c) => {
  return c.json({ status: 'OK', timestamp: new Date().toISOString() });
});

Deno.serve(app.fetch);