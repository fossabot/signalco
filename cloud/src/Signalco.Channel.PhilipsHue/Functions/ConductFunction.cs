﻿using System.Threading;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Signal.Api.Common.Auth;
using Signal.Api.Common.OpenApi;
using Signal.Core.Entities;
using Signalco.Common.Channel;

namespace Signalco.Channel.PhilipsHue.Functions;

public class ConductFunctions : ConductFunctionsForwardToStationBase
{
    public ConductFunctions(
        IFunctionAuthenticator authenticator,
        IEntityService entityService) 
        : base(entityService, authenticator)
    {
    }

    [Function("Conduct")]
    [OpenApiOperation<ConductFunctions>("Conducts")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "conduct/{entityId:guid}/{contactName}")]
        HttpRequestData req,
        string entityId,
        string contactName,
        CancellationToken cancellationToken = default) =>
        await this.HandleAsync(req, ChannelNames.Device, entityId, contactName, cancellationToken);
}