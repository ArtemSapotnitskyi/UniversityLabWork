
using FluentValidation;
using System.Net;

namespace Cars.API.Middleware;

public class ApiExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ApiExceptionMiddleware> _logger;

    public ApiExceptionMiddleware(
        RequestDelegate next,
        ILogger<ApiExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (ValidationException ex)
        {
            _logger.LogWarning(ex, "Validation error occurred.");

            context.Response.StatusCode =
                (int)HttpStatusCode.BadRequest;

            context.Response.ContentType = "application/json";

            var errors = ex.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(
                    group => group.Key,
                    group => group.Select(e => e.ErrorMessage).ToArray());

            await context.Response.WriteAsJsonAsync(new
            {
                title = "Validation error",
                status = 400,
                errors
            });
        }
        catch (Exception ex)
        {
            var (statusCode, title) = ex switch
            {
                BadHttpRequestException =>
                    (HttpStatusCode.BadRequest, "Bad request"),

                ArgumentException =>
                    (HttpStatusCode.BadRequest, "Invalid request"),

                _ =>
                    (HttpStatusCode.InternalServerError, "Server error")
            };

            if ((int)statusCode >= 500)
            {
                _logger.LogError(ex, "An unexpected error occurred.");
            }
            else
            {
                _logger.LogWarning(ex, "Request rejected.");
            }

            context.Response.StatusCode = (int)statusCode;
            context.Response.ContentType = "application/json";

            await context.Response.WriteAsJsonAsync(new
            {
                title,
                status = (int)statusCode,
                detail = (int)statusCode == 400
                    ? ex.Message
                    : "An unexpected error occurred."
            });
        }
    }
}