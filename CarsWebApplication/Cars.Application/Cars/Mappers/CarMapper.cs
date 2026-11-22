using Cars.Application.Cars.DTOs;
using Cars.Domain;

namespace Cars.Application.Cars.Mappers;

public static class CarMapper
{
    public static CarDto ToDto(Car car)
    {
        return new CarDto
        {
            Id = car.Id,
            Brand = car.Brand,
            Model = car.Model,
            DoorsNumber = car.DoorsNumber,
            LuggageCapacity = car.LuggageCapacity,
            EngineCapacity = car.EngineCapacity,
            FuelType = car.FuelType,
            ProductionDate = car.ProductionDate,
            AverageFuelConsumption = car.AverageFuelConsumption,
            BodyType = car.BodyType,

            Photos = car.Photos.Select(photo => new CarPhotoDto
            {
                Id = photo.Id,
                FileName = photo.FileName,
                Url = photo.Url,
                IsMain = photo.IsMain
            }).ToList(),

            Features = car.Features.Select(feature => new FeatureDto
            {
                Id = feature.Id,
                Name = feature.Name
            }).ToList()
        };
    }
}