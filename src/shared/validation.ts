import { isValidPort } from 'src/shared/proxy';

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

const FORBIDDEN_HOST_CHARS = /[\s/@]/;

const validateHost = (host: string): FieldError | undefined => {
    const value = host.trim();
    if (!value) return FieldError.Required;
    if (FORBIDDEN_HOST_CHARS.test(value)) return FieldError.Invalid;
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
