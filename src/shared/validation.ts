import { isValidPort } from 'src/shared/proxy';
import { ProxyProfile, ProxyScheme } from './types';

export enum FieldError {
    Required = 'required',
    Invalid = 'invalid',
}

export enum ValidatedField {
    Host = 'host',
    Port = 'port',
}

export type FieldErrors = Partial<Record<ValidatedField, FieldError>>;

type AddressInput = Record<ValidatedField, string>;

const FORBIDDEN_HOST_CHARS = /[\s/@\\?#;,"'<>]/;

const validateHost = (host: string): FieldError | undefined => {
    const value = host.trim();
    if (!value) return FieldError.Required;
    if (FORBIDDEN_HOST_CHARS.test(value)) return FieldError.Invalid;
    if (value.includes(':')) {
        if (value.startsWith('[') && !value.endsWith(']'))
            return FieldError.Invalid;
        try {
            // URL validates and canonicalizes IPv6 literals. A colon in a DNS
            // hostname otherwise means a port/URL was pasted into Host.
            const bracketed = value.startsWith('[') ? value : `[${value}]`;
            if (!new URL(`http://${bracketed}/`).hostname)
                return FieldError.Invalid;
        } catch {
            return FieldError.Invalid;
        }
    } else if (!/^[a-z0-9_.-]+$/i.test(value)) return FieldError.Invalid;
    return undefined;
};

const validatePort = (port: string): FieldError | undefined => {
    if (!port.trim()) return FieldError.Required;
    if (!isValidPort(Number(port))) return FieldError.Invalid;
    return undefined;
};

export const validateAddress = ({ host, port }: AddressInput): FieldErrors => {
    const errors: FieldErrors = {};
    const hostError = validateHost(host);
    const portError = validatePort(port);

    if (hostError) errors[ValidatedField.Host] = hostError;
    if (portError) errors[ValidatedField.Port] = portError;

    return errors;
};

export const hasErrors = (errors: FieldErrors): boolean =>
    Object.keys(errors).length > 0;

export const isValidProfile = (value: unknown): value is ProxyProfile => {
    if (!value || typeof value !== 'object') return false;
    const proxy = value as Partial<ProxyProfile>;
    return (
        typeof proxy.id === 'string' &&
        typeof proxy.name === 'string' &&
        Object.values(ProxyScheme).includes(proxy.scheme as ProxyScheme) &&
        typeof proxy.host === 'string' &&
        !validateHost(proxy.host) &&
        typeof proxy.port === 'number' &&
        isValidPort(proxy.port) &&
        typeof proxy.username === 'string' &&
        typeof proxy.password === 'string' &&
        Array.isArray(proxy.bypassList) &&
        proxy.bypassList.every((rule) => typeof rule === 'string')
    );
};
