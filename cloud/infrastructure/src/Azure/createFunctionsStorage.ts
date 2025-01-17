import { type ResourceGroup } from '@pulumi/azure-native/resources';
import { createStorageAccount } from './createStorageAccount';
import { BlobContainer } from '@pulumi/azure-native/storage';

export default function createFunctionsStorage(
    resourceGroup: ResourceGroup,
    namePrefix: string,
    protect: boolean,
    
) {
    const account = createStorageAccount(resourceGroup, namePrefix, protect, resourceGroup);

    // Function code archives will be stored in this container.
    const codeContainer = new BlobContainer(`func-zips-${namePrefix}`, {
        containerName: 'zips',
        resourceGroupName: resourceGroup.name,
        accountName: account.storageAccount.name,
    }, {
        // parent: account
    });

    return {
        storageAccount: account,
        zipsContainer: codeContainer,
    };
}