namespace Cars.Application.Photos;

public class UploadCarPhotoDto
{
    public IFormFile File { get; set; } = null!;
    public bool IsMain { get; set; }
}