'use client'
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material';
import { Product } from '../interfaces/types';

interface DeleteConfirmDialogProps {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmDialog({
  open,
  product,
  onClose,
  onConfirm
}: DeleteConfirmDialogProps) {
  if (!product) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirmar Eliminación</DialogTitle>
      <DialogContent>
        <Typography>
          ¿Estás seguro que deseas eliminar el producto <b>{product.name}</b>?
          Esta acción no se puede deshacer.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
}