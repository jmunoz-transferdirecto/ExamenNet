using System.ComponentModel.DataAnnotations;

namespace Application.DTOs
{
    public class CreateOrderDTO
    {
        [Required(ErrorMessage = "El ID del producto es requerido")]
        [Range(1, int.MaxValue, ErrorMessage = "El ID del producto debe ser válido")]
        public int ProductId { get; set; }

        [Required(ErrorMessage = "La cantidad es requerida")]
        [Range(1, int.MaxValue, ErrorMessage = "La cantidad debe ser mayor a 0")]
        public int Quantity { get; set; }
    }
}