using Cars.Domain;

namespace Cars.Application.Cars.DTOs;

public class CarListParams
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;

    public string? Search { get; set; }
    public string? Brand { get; set; }

    public FuelType? FuelType { get; set; }
    public BodyType? BodyType { get; set; }

    public int? ProductionYear { get; set; }

    public string SortBy { get; set; } = "brand";
    public bool Descending { get; set; } = false;
}