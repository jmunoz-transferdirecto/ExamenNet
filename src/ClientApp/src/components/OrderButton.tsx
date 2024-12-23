import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert
} from '@mui/material';
import { Product } from '../interfaces/types';
import api from '../services/api';
import axios from 'axios';

interface OrderButtonProps {
  product: Product;
}

export const OrderButton = ({ product }: OrderButtonProps) => {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      if (quantity > product.stock) {
        setError('Quantity exceeds available stock');
        return;
      }

      await api.createOrder({
        productId: product.id,
        quantity: quantity
      });

      setOpen(false);
      setError('');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.errors) {

          const validationErrors = Object.values(error.response.data.errors).flat();
          setError(validationErrors.join('\n'));
        } else if (error.response?.data) {

          setError(error.response.data);
        } else {

          setError('Ocurrió un error al procesar la solicitud');
        }
      } else {
        setError('Error de conexión');
      }
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpen(true)}
        disabled={product.stock === 0}
      >
        Order
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create Order</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            autoFocus
            margin="dense"
            label="Quantity"
            type="number"
            fullWidth
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            inputProps={{ min: 1, max: product.stock }}
          />
          <p>Available stock: {product.stock}</p>
          <p>Total price: ${product.price * quantity}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">
            Create Order
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};