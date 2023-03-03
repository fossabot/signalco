﻿using System;
using System.Threading;
using System.Threading.Tasks;
using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Signal.Core.Caching;
using Signal.Core.Secrets;

namespace Signal.Infrastructure.Secrets;

public class SecretsProvider : ISecretsProvider
{
    private const string KeyVaultUrlKey = "SignalcoKeyVaultUrl";

    private readonly IServiceProvider serviceProvider;

    private Lazy<IConfiguration>? configuration;

    private static SecretClient? client;
    private static readonly InMemoryCache<string> SecretsCache = new(TimeSpan.FromHours(1));

    public SecretsProvider(IServiceProvider serviceProvider)
    {
        this.serviceProvider = serviceProvider ?? throw new ArgumentNullException(nameof(serviceProvider));
    }

    protected SecretClient Client()
    {
        this.configuration ??= this.serviceProvider.GetService<Lazy<IConfiguration>?>();
        if (this.configuration == null)
            throw new Exception("Configuration unavailable in this context - can't key Vault URL.");

        return client ??= new SecretClient(
            new Uri(this.configuration.Value[KeyVaultUrlKey]),
            new DefaultAzureCredential());
    }

    public async Task<string> GetSecretAsync(string key, CancellationToken cancellationToken = default)
    {
        // Check cache
        if (SecretsCache.TryGet(key, out var value))
            return value!;

        // Check configuration (never expires - required redeployment)
        try
        {
            this.configuration ??= this.serviceProvider.GetService<Lazy<IConfiguration>?>();
            if (this.configuration != null)
                return this.configuration.Value[key] ?? throw new Exception("Not a local secret.");
        }
        catch
        {
            // Try in vault next
        }

        // Instantiate secrets client if not already
        var secret = await this.Client().GetSecretAsync(key, cancellationToken: cancellationToken);
        return SecretsCache.Set(key, secret.Value.Value);
    }
}