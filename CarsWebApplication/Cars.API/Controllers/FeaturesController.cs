using Cars.Application.Features;
using Cars.Application.Cars.DTOs;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Cars.API.Controllers;

[Authorize]
public class FeaturesController : BaseApiController
{
    private readonly ISender _sender;

    public FeaturesController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    public async Task<ActionResult<List<FeatureDto>>> GetFeatures()
    {
        return await _sender.Send(new GetFeaturesList.Query());
    }
}