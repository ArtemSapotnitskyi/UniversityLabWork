
using Cars.Application.Cars.DTOs;
using Cars.Infrastructure;
using Cars.Domain;
using MediatR;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Cars.Application.Photos;

public class UploadCarPhoto
{
    public class Command : IRequest<CarPhotoDto?>
    {
        public Guid CarId { get; set; }
        public UploadCarPhotoDto Photo { get; set; } = null!;
    }

    public class Handler : IRequestHandler<Command, CarPhotoDto?>
    {
        private readonly DataContext _context;
        private readonly IWebHostEnvironment _environment;

        private const long MaxFileSize = 5 * 1024 * 1024;

        public Handler(
            DataContext context,
            IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        public async Task<CarPhotoDto?> Handle(
            Command request,
            CancellationToken cancellationToken)
        {
            var car = await _context.Cars
                .Include(car => car.Photos)
                .FirstOrDefaultAsync(
                    car => car.Id == request.CarId,
                    cancellationToken);

            if (car is null)
            {
                return null;
            }

            var file = request.Photo.File;

            if (file is null || file.Length == 0)
            {
                throw new BadHttpRequestException(
                    "No file was uploaded.");
            }

            if (file.Length > MaxFileSize)
            {
                throw new BadHttpRequestException(
                    "File size cannot exceed 5 MB.");
            }

            var extension = Path.GetExtension(file.FileName)
                .ToLowerInvariant();

            var allowedExtensions = new[]
            {
                ".jpg",
                ".jpeg",
                ".png",
                ".webp"
            };

            if (!allowedExtensions.Contains(extension))
            {
                throw new BadHttpRequestException(
                    "Unsupported image format.");
            }

            var header = new byte[12];

            await using (var stream = file.OpenReadStream())
            {
                var bytesRead = await stream.ReadAsync(
                    header.AsMemory(0, header.Length),
                    cancellationToken);

                if (!IsValidImage(header, bytesRead, extension))
                {
                    throw new BadHttpRequestException(
                        "Invalid image content.");
                }
            }

            var fileName = $"{Guid.NewGuid()}{extension}";

            var uploadsFolder = Path.Combine(
                _environment.WebRootPath,
                "uploads",
                "cars");

            Directory.CreateDirectory(uploadsFolder);

            var filePath = Path.Combine(uploadsFolder, fileName);

            await using (var stream = new FileStream(
                filePath,
                FileMode.Create,
                FileAccess.Write))
            {
                await file.CopyToAsync(stream, cancellationToken);
            }

            if (request.Photo.IsMain)
            {
                foreach (var photo in car.Photos)
                {
                    photo.IsMain = false;
                }
            }

            var carPhoto = new CarPhoto
            {
                FileName = fileName,
                Url = $"/uploads/cars/{fileName}",
                IsMain = request.Photo.IsMain,
                CarId = car.Id
            };

            _context.CarPhotos.Add(carPhoto);

            await _context.SaveChangesAsync(cancellationToken);

            return new CarPhotoDto
            {
                Id = carPhoto.Id,
                FileName = carPhoto.FileName,
                Url = carPhoto.Url,
                IsMain = carPhoto.IsMain
            };
        }

        private static bool IsValidImage(
            byte[] header,
            int bytesRead,
            string extension)
        {
            if (extension == ".jpg" || extension == ".jpeg")
            {
                return bytesRead >= 3 &&
                       header[0] == 0xFF &&
                       header[1] == 0xD8 &&
                       header[2] == 0xFF;
            }

            if (extension == ".png")
            {
                return bytesRead >= 8 &&
                       header[0] == 0x89 &&
                       header[1] == 0x50 &&
                       header[2] == 0x4E &&
                       header[3] == 0x47 &&
                       header[4] == 0x0D &&
                       header[5] == 0x0A &&
                       header[6] == 0x1A &&
                       header[7] == 0x0A;
            }

            if (extension == ".webp")
            {
                return bytesRead >= 12 &&
                       header[0] == 0x52 &&
                       header[1] == 0x49 &&
                       header[2] == 0x46 &&
                       header[3] == 0x46 &&
                       header[8] == 0x57 &&
                       header[9] == 0x45 &&
                       header[10] == 0x42 &&
                       header[11] == 0x50;
            }

            return false;
        }
    }
}