﻿using System;
using System.Net;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;

namespace Signal.Api.Common.OpenApi;

public class OpenApiOkJsonResponseAttribute : OpenApiResponseWithBodyAttribute
{
    public OpenApiOkJsonResponseAttribute(Type bodyType) : base(HttpStatusCode.OK, "application/json", bodyType)
    {
    }
}