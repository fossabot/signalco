using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Signal.Api.Common.Auth;
using Signal.Api.Common.Entities;
using Signal.Api.Common.Exceptions;
using Signal.Api.Common.OpenApi;
using Signal.Api.Common.Users;
using Signal.Core.Contacts;
using Signal.Core.Entities;

namespace Signalco.Api.Public.Functions.Entity;

public class EntityRetrieveFunction
{
    private readonly IFunctionAuthenticator functionAuthenticator;
    private readonly IEntityService entityService;

    public EntityRetrieveFunction(
        IFunctionAuthenticator functionAuthenticator,
        IEntityService entityService)
    {
        this.functionAuthenticator = functionAuthenticator ?? throw new ArgumentNullException(nameof(functionAuthenticator));
        this.entityService = entityService ?? throw new ArgumentNullException(nameof(entityService));
    }

    [Function("Entity-Retrieve")]
    [OpenApiSecurityAuth0Token]
    [OpenApiOperation<EntityRetrieveFunction>("Entity", Description = "Retrieves all available entities.")]
    [OpenApiOkJsonResponse<IEnumerable<EntityDetailsDto>>]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "entity")]
        HttpRequestData req,
        CancellationToken cancellationToken = default) =>
        await req.UserRequest(cancellationToken, this.functionAuthenticator, async context =>
            (await this.entityService.AllDetailedAsync(context.User.UserId, null, cancellationToken))
            .Select(EntityDetailsDto)
            .ToList());
    
    // TODO: Use mapper
    private static EntityDetailsDto EntityDetailsDto(IEntityDetailed entity) =>
        new(entity.Type, entity.Id, entity.Alias)
        {
            Contacts = entity.Contacts
                .Select(s => new ContactDto
                (
                    s.EntityId,
                    s.ContactName,
                    s.ChannelName,
                    s.ValueSerialized,
                    s.TimeStamp,
                    s.Metadata
                )),
            SharedWith = entity.Users
                .Select(u => new UserDto(u.UserId, u.Email, u.FullName))
        };
}