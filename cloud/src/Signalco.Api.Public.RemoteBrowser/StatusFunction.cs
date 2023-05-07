﻿using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Signal.Api.Common.OpenApi;
using Signalco.Api.Common.Health;

namespace Signalco.Api.Public.RemoteBrowser;

public class StatusFunction : HealthStatusFunctionsBase
{
    [Function("Status")]
    [OpenApiOperation<StatusFunction>("Health")]
    [OpenApiResponseWithoutBody]
    public Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = "status")] HttpRequestData req) =>
        this.HandleAsync(req);
}