namespace Cars.Application.Cars.DTOs;

public class CarPhotoDto
{
    public Guid Id { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public bool IsMain { get; set; }
}