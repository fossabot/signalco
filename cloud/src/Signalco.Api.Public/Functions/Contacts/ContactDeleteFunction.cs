using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Signal.Api.Common.Auth;
using Signal.Api.Common.Exceptions;
using Signal.Api.Common.OpenApi;
using Signal.Core.Contacts;
using Signal.Core.Entities;
using Signal.Core.Exceptions;

namespace Signalco.Api.Public.Functions.Contacts;

public class ContactDeleteFunction
{
    private readonly IFunctionAuthenticator functionAuthenticator;
    private readonly IEntityService entityService;

    public ContactDeleteFunction(
        IFunctionAuthenticator functionAuthenticator,
        IEntityService entityService)
    {
        this.functionAuthenticator = functionAuthenticator ?? throw new ArgumentNullException(nameof(functionAuthenticator));
        this.entityService = entityService ?? throw new ArgumentNullException(nameof(entityService));
    }

    [Function("Entity-Contact-Delete")]
    [OpenApiSecurityAuth0Token]
    [OpenApiOperation<ContactDeleteFunction>("Contact", Description = "Deletes the contact.")]
    [OpenApiParameter("id", In = ParameterLocation.Path, Required = true, Type = typeof(Guid), Description = "Entity identifier")]
    [OpenApiParameter("channelName", In = ParameterLocation.Path, Required = true, Type = typeof(string), Description = "Channel name")]
    [OpenApiParameter("contactName", In = ParameterLocation.Path, Required = true, Type = typeof(string), Description = "Contact name")]
    [OpenApiResponseWithoutBody]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "entity/{id:guid}/contacts/{channelName}/{contactName}")]
        HttpRequestData req,
        string id,
        string channelName,
        string contactName,
        CancellationToken cancellationToken = default) =>
        await req.UserRequest(cancellationToken, this.functionAuthenticator, async context =>
        {
            if (string.IsNullOrWhiteSpace(id) ||
                string.IsNullOrWhiteSpace(channelName) ||
                string.IsNullOrWhiteSpace(contactName))
                throw new ExpectedHttpException(
                    HttpStatusCode.BadRequest,
                    "EntityId, ChannelName and ContactName parameters are required.");

            var contactPointer = new ContactPointer(
                id ?? throw new ArgumentException("Contact pointer requires entity identifier"),
                channelName ?? throw new ArgumentException("Contact pointer requires channel name"),
                contactName ?? throw new ArgumentException("Contact pointer requires contact name"));

            await this.entityService.ContactDeleteAsync(context.User.UserId, contactPointer, cancellationToken);
        });
}