
using Cars.Aplication.Cars;
using Cars.Application.Cars;
using Cars.Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Cars.Application.Cars.DTOs;
using Cars.Application.Features;
using Cars.Application.Photos;

namespace Cars.API.Controllers;

[Authorize]
public class CarsController : BaseApiController
{
    private readonly ISender _sender;

    public CarsController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    public async Task<ActionResult<PagedList<CarDto>>> GetCars(
        [FromQuery] CarListParams parameters)
    {
        return await _sender.Send(new GetCarsList.Query
        {
            Params = parameters
        });
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<CarDto>> GetCar(Guid id)
    {
        var car = await _sender.Send(new Details.Query { Id = id });

        if (car is null)
        {
            return NotFound();
        }

        return car;
    }

    [HttpPost]
    public async Task<ActionResult<Car>> CreateCar(Car car)
    {
        var result = await _sender.Send(new Create.Command { Car = car });

        return CreatedAtAction(
            nameof(GetCar),
            new { id = result.Id },
            result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateCar(Guid id, Car car)
    {
        var result = await _sender.Send(new Edit.Command
        {
            Id = id,
            Car = car
        });

        if (!result)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpPut("{id:guid}/features")]
    public async Task<IActionResult> UpdateCarFeatures(
        Guid id,
        UpdateCarFeaturesDto features)
    {
        var result = await _sender.Send(
            new UpdateCarFeatures.Command
            {
                CarId = id,
                Features = features
            });

        if (!result)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpPost("{id:guid}/photos")]
    public async Task<ActionResult<CarPhotoDto>> UploadCarPhoto(
        Guid id,
        [FromForm] UploadCarPhotoDto photo)
    {
        var result = await _sender.Send(
            new UploadCarPhoto.Command
            {
                CarId = id,
                Photo = photo
            });

        if (result is null)
        {
            return NotFound();
        }

        return CreatedAtAction(
            nameof(GetCar),
            new { id },
            result);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:guid}/photos/{photoId:guid}")]
    public async Task<IActionResult> DeleteCarPhoto(
        Guid id,
        Guid photoId)
    {
        var result = await _sender.Send(
            new DeleteCarPhoto.Command
            {
                CarId = id,
                PhotoId = photoId
            });

        if (!result)
        {
            return NotFound();
        }

        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteCar(Guid id)
    {
        var result = await _sender.Send(new Delete.Command { Id = id });

        if (!result)
        {
            return NotFound();
        }

        return NoContent();
    }
}