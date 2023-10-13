using System;
using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Signal.Api.Common.Auth;
using Signal.Api.Common.Exceptions;
using Signal.Api.Common.OpenApi;
using Signal.Core.Entities;
using Signal.Core.Exceptions;

namespace Signalco.Api.Public.Functions.Entity;

public class EntityDeleteFunction(
    IFunctionAuthenticator functionAuthenticator,
    IEntityService entityService)
{
    [Function("Entity-Delete")]
    [OpenApiSecurityAuth0Token]
    [OpenApiOperation<EntityDeleteFunction>("Entity", Description = "Deletes the entity.")]
    [OpenApiJsonRequestBody<EntityDeleteDto>(Description = "Information about entity to delete.")]
    [OpenApiResponseBadRequestValidation]
    [OpenApiResponseWithoutBody]
    [OpenApiResponseWithoutBody(HttpStatusCode.NotFound)]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "entity")]
        HttpRequestData req,
        CancellationToken cancellationToken = default) =>
        await req.UserRequest<EntityDeleteDto>(cancellationToken, functionAuthenticator, async context =>
        {
            if (string.IsNullOrWhiteSpace(context.Payload.Id))
                throw new ExpectedHttpException(HttpStatusCode.BadRequest, "Id property is required.");

            await entityService.RemoveAsync(
                context.User.UserId,
                context.Payload.Id,
                cancellationToken);
        });

    [Serializable]
    private class EntityDeleteDto
    {
        [Required]
        public string? Id { get; set; }
    }
}