'use client'
import ProductList from '@/src/components/ProductList';
import { Container } from '@mui/material';

export default function Home() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <ProductList />
    </Container>
  );
}