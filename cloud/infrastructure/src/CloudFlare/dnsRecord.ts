import { Config, Input, Resource } from '@pulumi/pulumi';
import { Record } from '@pulumi/cloudflare';

export default function dnsRecord (name: string, dnsName: Input<string>, value: Input<string>, type: 'CNAME' | 'TXT' | 'MX', protect: boolean, parent?: Resource) {
    const config = new Config();
    const zoneId = config.requireSecret('zoneid');
    return new Record(name, {
        name: dnsName,
        zoneId,
        type,
        value,
        priority: type === 'MX' ? 10 : undefined,
    }, {
        protect,
        // parent: parent
    });
}
