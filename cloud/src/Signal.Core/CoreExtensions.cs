﻿using System;
using Microsoft.Extensions.DependencyInjection;
using Signal.Core.Entities;
using Signal.Core.Notifications;
using Signal.Core.Sharing;
using Signal.Core.Users;

namespace Signal.Core;

public static class CoreExtensions
{
    public static IServiceCollection AddCore(this IServiceCollection services) =>
        services
            .AddTransient<INotificationSmtpService, NotificationSmtpService>()
            .AddTransient<INotificationService, NotificationService>()
            .AddTransient<ISharingService, SharingService>()
            .AddTransient<IEntityService, EntityService>()
            .AddTransient<IUserService, UserService>()
            .AddTransient(typeof(Lazy<>), typeof(LazyInstance<>));
}

public class LazyInstance<T>: Lazy<T> where T : notnull
{
    public LazyInstance(IServiceProvider serviceProvider)
        : base(serviceProvider.GetRequiredService<T>)
    {
    }
}