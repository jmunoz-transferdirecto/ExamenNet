'use client'
import React, { useEffect, useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { Order } from '../../interfaces/types';
import api from '../../services/api';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await api.getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Historial de Órdenes
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Producto</TableCell>
              <TableCell align="right">Cantidad</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell>Fecha</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.product?.name}</TableCell>
                <TableCell align="right">{order.quantity}</TableCell>
                <TableCell align="right">${order.total.toFixed(2)}</TableCell>
                <TableCell>{new Date(order.date).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}