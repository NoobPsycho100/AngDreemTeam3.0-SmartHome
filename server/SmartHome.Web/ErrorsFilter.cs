using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using SmartHome.Core;

namespace SmartHome.Web;

public class ErrorsFilter : IExceptionFilter
{
    public void OnException(ExceptionContext context)
    {
        if (context.Exception is ValidationException error)
        {
            HandleValidationError(context, error);
        }

        if (context.Exception is DbUpdateException dbError)
        {
            if (dbError.InnerException is SqliteException sqlError)
            {
                if (sqlError.Message.Contains("FOREIGN KEY constraint failed"))
                {
                    HandleValidationError(context, new ValidationException("Error while saving to database", new ValidationException.FieldError("", "Cannot find parent / related data")));
                }

                if (sqlError.Message.Contains("UNIQUE constraint failed"))
                {
                    HandleValidationError(context, new ValidationException("Error while saving to database", new ValidationException.FieldError("", "Duplicate data")));
                }
            }
        }
    }

    private void HandleValidationError(ExceptionContext context, ValidationException error)
    {
        if (error != null)
        {
            context.Result = new BadRequestObjectResult(new
            {
                type = "https://tools.ietf.org/html/rfc9110#section-15.5.1",
                title = error.Message,
                status = 400,
                errors = error.FieldErrors.GroupBy(f => f.Field, f => f.Error).ToDictionary(x => x.Key, x => x.ToList()),
                traceId = context.HttpContext.TraceIdentifier,
            });
            context.ExceptionHandled = true;
        }
    }
}