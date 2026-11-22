using Cars.Application.Cars.DTOs;
using Cars.Infrastructure;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Cars.Application.Features;

public class GetFeaturesList
{
    public class Query : IRequest<List<FeatureDto>>
    {
    }

    public class Handler : IRequestHandler<Query, List<FeatureDto>>
    {
        private readonly DataContext _context;

        public Handler(DataContext context)
        {
            _context = context;
        }

        public async Task<List<FeatureDto>> Handle(
            Query request,
            CancellationToken cancellationToken)
        {
            return await _context.Features
                .AsNoTracking()
                .OrderBy(feature => feature.Name)
                .Select(feature => new FeatureDto
                {
                    Id = feature.Id,
                    Name = feature.Name
                })
                .ToListAsync(cancellationToken);
        }
    }
}