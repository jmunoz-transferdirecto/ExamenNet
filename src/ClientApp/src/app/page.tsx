'use client'
import { Container } from '@mui/material';
import ProductList from '../components/ProductList';

export default function Home() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <ProductList />
    </Container>
  );
} 