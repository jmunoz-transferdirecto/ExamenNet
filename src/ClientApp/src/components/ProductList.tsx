'use client'
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box
} from '@mui/material';
import { Product } from '../interfaces/types';
import api from '../services/api';
import ProductDialog from './ProductDialog';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import OrderDialog from './OrderDialog';

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const handleCreate = () => {
    setEditProduct(null);
    setOpenCreate(true);
  };

  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setOpenCreate(true);
  };

  const handleDelete = (product: Product) => {
    setDeleteProduct(product);
  };

  const handleCreateOrder = (product: Product) => {
    setSelectedProduct(product);
    setOrderDialogOpen(true);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Productos</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleCreate}
        >
          Nuevo Producto
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell align="right">Precio</TableCell>
              <TableCell align="right">Stock</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell align="right">${product.price.toFixed(2)}</TableCell>
                <TableCell align="right">{product.stock}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    disabled={product.stock === 0}
                    onClick={() => handleCreateOrder(product)}
                    sx={{ mr: 1 }}
                  >
                    Crear Orden
                  </Button>
                  <Button
                    size="small"
                    onClick={() => handleEdit(product)}
                    sx={{ mr: 1 }}
                  >
                    Editar
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDelete(product)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ProductDialog
        open={openCreate}
        product={editProduct}
        onClose={() => {
          setOpenCreate(false);
          setEditProduct(null);
          loadProducts();
        }}
      />

      <DeleteConfirmDialog
        open={!!deleteProduct}
        product={deleteProduct}
        onClose={() => setDeleteProduct(null)}
        onConfirm={async () => {
          if (deleteProduct) {
            await api.deleteProduct(deleteProduct.id);
            setDeleteProduct(null);
            loadProducts();
          }
        }}
      />

      {selectedProduct && (
        <OrderDialog
          open={orderDialogOpen}
          product={selectedProduct}
          onClose={() => {
            setOrderDialogOpen(false);
            setSelectedProduct(null);
          }}
          onOrderComplete={() => {
            setOrderDialogOpen(false);
            setSelectedProduct(null);
            loadProducts();
          }}
        />
      )}
    </Box>
  );
}