import { interpolate } from '@pulumi/pulumi';
import { WebApp } from '@pulumi/azure-native/web';

export function webAppIdentity (webApp: WebApp) {
    return webApp.identity.apply(identity => {
        return {
            tenantId: interpolate`${identity?.tenantId}`,
            objectId: interpolate`${identity?.principalId}`,
        };
    });
}
