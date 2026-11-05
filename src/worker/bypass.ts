// Chrome bypass rules apply to fixed_servers, not PAC scripts. Compile only
// rules whose semantics can be preserved; never silently approximate a rule.
export class UnsupportedRoutingError extends Error {}

const quote = JSON.stringify;

export const bypassCondition = (input: string): string => {
    const rule = input.trim().toLowerCase();
    if (rule === '<local>')
        return '(host.indexOf(":") === -1 && isPlainHostName(host))';
    if (rule === '<-loopback>') throw new UnsupportedRoutingError(rule);

    const cidr = /^(\d+\.\d+\.\d+\.\d+)\/(\d+)$/.exec(rule);
    if (cidr) {
        const bits = Number(cidr[2]);
        if (bits > 32) throw new UnsupportedRoutingError(rule);
        const mask = Array.from({ length: 4 }, (_, index) => {
            const n = Math.max(0, Math.min(8, bits - index * 8));
            return 256 - 2 ** (8 - n);
        }).join('.');
        return `(/^[0-9.]+$/.test(host) && isInNet(host, ${quote(cidr[1])}, ${quote(mask)}))`;
    }

    const match =
        /^(?:(https?|wss?|ftp):\/\/)?(\[[0-9a-f:]+\]|[^/:<>]+)(?::(\d+))?$/.exec(
            rule
        );
    if (!match) throw new UnsupportedRoutingError(rule);
    const [, scheme, rawHost, port] = match;
    const host = rawHost.startsWith('.') ? `*${rawHost}` : rawHost;
    const conditions = [`shExpMatch(host.toLowerCase(), ${quote(host)})`];
    if (scheme) conditions.push(`url.indexOf(${quote(`${scheme}:`)}) === 0`);
    if (port) {
        // PAC receives HTTPS URLs stripped to their origin, which still carries
        // an explicit nondefault port. Default ports may be omitted.
        const defaultPorts: Record<string, string> = {
            http: '80',
            https: '443',
            ws: '80',
            wss: '443',
            ftp: '21',
        };
        const defaults = Object.entries(defaultPorts)
            .filter(([, defaultPort]) => defaultPort === port)
            .map(([protocol]) => `url.indexOf(${quote(`${protocol}:`)}) === 0`);
        const defaultCondition = defaults.length
            ? ` || (!new RegExp(${quote('^[a-z]+://(?:\\[[^\\]]+\\]|[^/:]+):[0-9]+')}).test(url) && (${defaults.join(' || ')}))`
            : '';
        conditions.push(
            `(new RegExp(${quote(`^[a-z]+://(?:\\[[^\\]]+\\]|[^/:]+):${port}(?:/|$)`)}).test(url)${defaultCondition})`
        );
    }
    return `(${conditions.join(' && ')})`;
};

// Health probes use DNS hostnames over HTTPS: literal IP/CIDR and local rules
// cannot bypass them. Unknown rules exclude the endpoint conservatively.
export const mayBypassProbe = (host: string, rules: string[]): boolean =>
    rules.some((input) => {
        const rule = input.trim().toLowerCase();
        if (rule === '<local>' || rule === '<-loopback>') return false;
        if (/^[0-9.]+\/[0-9]+$/.test(rule) || rule.startsWith('[')) {
            return false;
        }
        const match =
            /^(?:(\w+):\/\/)?(\[[0-9a-f:]+\]|[^/:<>]+)(?::(\d+))?$/.exec(rule);
        if (!match) return true;
        const [, scheme, pattern, port] = match;
        if (pattern.startsWith('[')) return false;
        if (scheme && scheme !== 'https') return false;
        if (port && port !== '443') return false;
        const hostname = pattern.startsWith('.') ? `*${pattern}` : pattern;
        const regex = hostname
            .replace(/[.+^${}()|[\]\\]/g, '\\$&')
            .replace(/\*/g, '.*')
            .replace(/\?/g, '.');
        return new RegExp(`^${regex}$`, 'i').test(host);
    });
