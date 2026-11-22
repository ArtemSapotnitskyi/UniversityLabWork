
using Cars.Infrastructure;
using MediatR;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;

namespace Cars.Application.Photos;

public class DeleteCarPhoto
{
    public class Command : IRequest<bool>
    {
        public Guid CarId { get; set; }
        public Guid PhotoId { get; set; }
    }

    public class Handler : IRequestHandler<Command, bool>
    {
        private readonly DataContext _context;
        private readonly IWebHostEnvironment _environment;

        public Handler(
            DataContext context,
            IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        public async Task<bool> Handle(
            Command request,
            CancellationToken cancellationToken)
        {
            var photo = await _context.CarPhotos
                .FirstOrDefaultAsync(
                    photo => photo.Id == request.PhotoId &&
                             photo.CarId == request.CarId,
                    cancellationToken);

            if (photo is null)
            {
                return false;
            }

            var wasMain = photo.IsMain;

            var filePath = Path.Combine(
                _environment.WebRootPath,
                "uploads",
                "cars",
                Path.GetFileName(photo.FileName));

            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }

            _context.CarPhotos.Remove(photo);

            if (wasMain)
            {
                var nextMainPhoto = await _context.CarPhotos
                    .Where(p => p.CarId == request.CarId &&
                                p.Id != request.PhotoId)
                    .OrderBy(p => p.CreatedAtUtc)
                    .FirstOrDefaultAsync(cancellationToken);

                if (nextMainPhoto is not null)
                {
                    nextMainPhoto.IsMain = true;
                }
            }

            return await _context.SaveChangesAsync(
                cancellationToken) > 0;
        }
    }
}