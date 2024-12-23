'use client'
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  Box
} from '@mui/material';
import { Product } from '../interfaces/types';
import api from '../services/api';
import { AxiosError } from 'axios';

interface ProductDialogProps {
  open: boolean;
  product: Product | null;
  onClose: () => void;
}

interface ApiError {
  message?: string;
  data?: string;
}

export default function ProductDialog({ open, product, onClose }: ProductDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        stock: product.stock.toString()
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: ''
      });
    }
    setErrors({});
    setError('');
  }, [product, open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0';
    }
    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.stock = 'El stock no puede ser negativo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    try {
      if (!validateForm()) return;
      
      setLoading(true);
      setError('');

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      };

      if (product) {
        await api.updateProduct(product.id, { ...productData, id: product.id });
      } else {
        await api.createProduct(productData);
      }

      onClose();
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.data || 
                          error.message || 
                          'Error al guardar el producto';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {product ? 'Editar Producto' : 'Nuevo Producto'}
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Nombre"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={!!errors.name}
            helperText={errors.name}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Descripción"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            error={!!errors.description}
            helperText={errors.description}
            margin="normal"
            multiline
            rows={3}
          />

          <TextField
            fullWidth
            label="Precio"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            error={!!errors.price}
            helperText={errors.price}
            margin="normal"
            inputProps={{ step: "0.01" }}
          />

          <TextField
            fullWidth
            label="Stock"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            error={!!errors.stock}
            helperText={errors.stock}
            margin="normal"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={loading}
        >
          {loading ? 'Guardando...' : (product ? 'Actualizar' : 'Crear')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}