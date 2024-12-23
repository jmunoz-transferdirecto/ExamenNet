'use client'
import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container
} from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <html lang="es">
      <body>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Sistema de Gestión
            </Typography>
            <Button 
              color="inherit" 
              component={Link} 
              href="/"
              sx={{ color: pathname === '/' ? 'secondary.main' : 'inherit' }}
            >
              Productos
            </Button>
            <Button 
              color="inherit" 
              component={Link} 
              href="/orders"
              sx={{ color: pathname === '/orders' ? 'secondary.main' : 'inherit' }}
            >
              Órdenes
            </Button>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          {children}
        </Container>
      </body>
    </html>
  );
}