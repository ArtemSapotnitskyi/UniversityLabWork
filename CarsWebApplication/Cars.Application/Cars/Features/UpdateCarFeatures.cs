using Cars.Application.Cars.DTOs;
using Cars.Infrastructure;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Cars.Application.Features;

public class UpdateCarFeatures
{
    public class Command : IRequest<bool>
    {
        public Guid CarId { get; set; }
        public UpdateCarFeaturesDto Features { get; set; } = new();
    }

    public class Handler : IRequestHandler<Command, bool>
    {
        private readonly DataContext _context;

        public Handler(DataContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle(
            Command request,
            CancellationToken cancellationToken)
        {
            var car = await _context.Cars
                .Include(car => car.Features)
                .FirstOrDefaultAsync(
                    car => car.Id == request.CarId,
                    cancellationToken);

            if (car is null)
            {
                return false;
            }

            var features = await _context.Features
                .Where(feature => request.Features.FeatureIds.Contains(feature.Id))
                .ToListAsync(cancellationToken);

            if (features.Count != request.Features.FeatureIds.Distinct().Count())
            {
                throw new Exception("One or more features were not found.");
            }

            car.Features.Clear();

            foreach (var feature in features)
            {
                car.Features.Add(feature);
            }

            return await _context.SaveChangesAsync(cancellationToken) > 0;
        }
    }
}