
using Cars.Application.Cars.DTOs;
using Cars.Application.Cars.Mappers;
using Cars.Domain;
using Cars.Infrastructure;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Cars.Aplication.Cars;

public class GetCarsList
{
    public class Query : IRequest<PagedList<CarDto>>
    {
        public CarListParams Params { get; set; } = new();
    }

    public class Handler : IRequestHandler<Query, PagedList<CarDto>>
    {
        private readonly DataContext _context;

        public Handler(DataContext context)
        {
            _context = context;
        }

        public async Task<PagedList<CarDto>> Handle(
            Query request,
            CancellationToken cancellationToken)
        {
            var parameters = request.Params;

            var query = _context.Cars
                .AsNoTracking()
                .AsQueryable();

            // Search
            if (!string.IsNullOrWhiteSpace(parameters.Search))
            {
                var search = parameters.Search.Trim();

                query = query.Where(car =>
                    car.Brand.Contains(search) ||
                    car.Model.Contains(search));
            }

            // Filter by brand
            if (!string.IsNullOrWhiteSpace(parameters.Brand))
            {
                var brand = parameters.Brand.Trim();

                query = query.Where(car =>
                    car.Brand.Contains(brand));
            }

            // Filter by fuel type
            if (parameters.FuelType.HasValue)
            {
                query = query.Where(car =>
                    car.FuelType == parameters.FuelType.Value);
            }

            // Filter by body type
            if (parameters.BodyType.HasValue)
            {
                query = query.Where(car =>
                    car.BodyType == parameters.BodyType.Value);
            }

            // Filter by production year
            if (parameters.ProductionYear.HasValue)
            {
                var year = parameters.ProductionYear.Value;

                query = query.Where(car =>
                    car.ProductionDate.Year == year);
            }

            // Sorting
            query = parameters.SortBy.ToLower() switch
            {
                "model" => parameters.Descending
                    ? query.OrderByDescending(car => car.Model)
                    : query.OrderBy(car => car.Model),

                "year" => parameters.Descending
                    ? query.OrderByDescending(car => car.ProductionDate)
                    : query.OrderBy(car => car.ProductionDate),

                "fuel" => parameters.Descending
                    ? query.OrderByDescending(car => car.FuelType)
                    : query.OrderBy(car => car.FuelType),

                "body" => parameters.Descending
                    ? query.OrderByDescending(car => car.BodyType)
                    : query.OrderBy(car => car.BodyType),

                _ => parameters.Descending
                    ? query.OrderByDescending(car => car.Brand)
                    : query.OrderBy(car => car.Brand)
            };

            // Pagination
            var pageNumber = Math.Max(1, parameters.PageNumber);
            var pageSize = Math.Clamp(parameters.PageSize, 1, 100);

            var totalCount = await query.CountAsync(cancellationToken);

            var cars = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Include(car => car.Photos)
                .Include(car => car.Features)
                .ToListAsync(cancellationToken);

            return new PagedList<CarDto>
            {
                Items = cars.Select(CarMapper.ToDto).ToList(),
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalCount = totalCount,
                TotalPages = (int)Math.Ceiling(
                    totalCount / (double)pageSize)
            };
        }
    }
}