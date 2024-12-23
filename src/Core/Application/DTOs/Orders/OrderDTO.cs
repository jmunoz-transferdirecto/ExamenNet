using System;
using System.ComponentModel.DataAnnotations;

namespace Application.DTOs
{
    public class OrderDTO
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "El ID del producto es requerido")]
        public int ProductId { get; set; }

        [Required(ErrorMessage = "La cantidad es requerida")]
        [Range(1, int.MaxValue, ErrorMessage = "La cantidad debe ser mayor a 0")]
        public int Quantity { get; set; }

        [Required(ErrorMessage = "El total es requerido")]
        [Range(0.01, double.MaxValue, ErrorMessage = "El total debe ser mayor a 0")]
        public decimal Total { get; set; }

        [Required(ErrorMessage = "La fecha es requerida")]
        public DateTime Date { get; set; }

        public ProductDTO Product { get; set; }
    }
}