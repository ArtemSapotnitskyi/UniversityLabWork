namespace Cars.Application.Cars.DTOs;

public class UpdateCarFeaturesDto
{
    public List<Guid> FeatureIds { get; set; } = new();
}