'use client'
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Alert,
  Box,
  Snackbar
} from '@mui/material';
import { Product } from '../interfaces/types';
import api from '../services/api';
import { AxiosError } from 'axios';

interface OrderDialogProps {
  open: boolean;
  product: Product;
  onClose: () => void;
  onOrderComplete: () => void;
}

interface ApiError {
  message?: string;
  data?: string;
  errors?: {
    Product?: string[];
    [key: string]: string[] | undefined;
  };
  type?: string;
  title?: string;
  status?: number;
  traceId?: string;
}

export default function OrderDialog({ open, product, onClose, onOrderComplete }: OrderDialogProps) {
  const [quantity, setQuantity] = useState<string>('1');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleClose = () => {
    setError('');
    setQuantity('1');
    onClose();
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      const quantityNum = parseInt(quantity);
      await api.createOrder({
        productId: product.id,
        quantity: quantityNum
      });

      setShowSuccess(true);
      setTimeout(() => {
        handleClose();
        onOrderComplete();
      }, 1500);

    } catch (err) {
      const error = err as AxiosError<ApiError>;
      let errorMessage = 'Error al crear la orden';

      if (error.response?.data) {
        const responseData = error.response.data;
        
        const responseStr = JSON.stringify(responseData).toLowerCase();

        if (responseStr.includes('insufficient stock')) {
          errorMessage = `No hay suficiente stock disponible.`;
        } else if (error.response.data.errors?.Product) {
          errorMessage = error.response.data.errors.Product[0];
        } else if (responseData.message) {
          errorMessage = responseData.message;
        } else if (responseData.title) {
          errorMessage = responseData.title;
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>
          Crear Orden - {product.name}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
         
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Precio unitario: ${product.price.toFixed(2)}
            </Typography>
            <Typography 
              variant="subtitle1" 
              gutterBottom 
              color={product.stock < 5 ? 'error' : 'inherit'}
            >
              Stock disponible: {product.stock} 
              {product.stock < 5 && ' (¡Pocas unidades!)'}
            </Typography>
          </Box>

          <TextField
            fullWidth
            label="Cantidad"
            type="text"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            margin="normal"
            error={!!error}
            helperText={error || `Ingrese una cantidad entre 1 y ${product.stock}`}
            InputProps={{
              inputProps: { 
                min: 1,
                max: product.stock,
                pattern: "\\d*"
              }
            }}
          />

          {quantity && !isNaN(parseInt(quantity)) && (
            <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }}>
              Total: ${(parseInt(quantity) * product.price).toFixed(2)}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleClose} 
            disabled={loading}
            color="inherit"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={loading || !quantity || parseInt(quantity) < 1 || parseInt(quantity) > product.stock}
          >
            {loading ? 'Procesando...' : 'Crear Orden'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showSuccess}
        autoHideDuration={1500}
        message="Orden creada exitosamente"
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
    </>
  );
}