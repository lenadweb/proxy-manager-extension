export type ExitInfo = {
    ip: string;
    country: string | null;
};

export type TestEndpoint = {
    host: string;
    path: string;
    parse: (body: string) => ExitInfo | null;
};

type IpJson = {
    ip?: unknown;
    country?: unknown;
};

const IP_ADDRESS = /^[0-9a-f.:]+$/i;

const toExitInfo = (ip: unknown, country: unknown = null): ExitInfo | null =>
    typeof ip === 'string' && IP_ADDRESS.test(ip)
        ? { ip, country: typeof country === 'string' ? country : null }
        : null;

const readKeyValue = (body: string, key: string): string | null =>
    body
        .split('\n')
        .find((line) => line.startsWith(`${key}=`))
        ?.slice(key.length + 1) ?? null;

const parseKeyValueTrace = (body: string): ExitInfo | null =>
    toExitInfo(readKeyValue(body, 'ip'), readKeyValue(body, 'loc'));

const parsePlainIp = (body: string): ExitInfo | null => toExitInfo(body.trim());

const parseIpJson = (body: string): ExitInfo | null => {
    try {
        const { ip, country } = JSON.parse(body) as IpJson;
        return toExitInfo(ip, country);
    } catch {
        return null;
    }
};

export const TEST_ENDPOINTS: TestEndpoint[] = [
    {
        host: 'one.one.one.one',
        path: '/cdn-cgi/trace',
        parse: parseKeyValueTrace,
    },
    {
        host: 'checkip.amazonaws.com',
        path: '/',
        parse: parsePlainIp,
    },
    {
        host: 'ipinfo.io',
        path: '/json',
        parse: parseIpJson,
    },
    {
        host: 'api.ipify.org',
        path: '/?format=json',
        parse: parseIpJson,
    },
];

export const TEST_HOSTS = TEST_ENDPOINTS.map(({ host }) => host);
