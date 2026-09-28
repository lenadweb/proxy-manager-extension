import { ProxyProfile } from 'src/shared/types';

export type TestSession = {
    proxy: ProxyProfile;
    errorCode: string | null;
    isAuthRejected: boolean;
};

let session: TestSession | null = null;

export const startTestSession = (proxy: ProxyProfile): void => {
    session = { proxy, errorCode: null, isAuthRejected: false };
};

export const endTestSession = (): void => {
    session = null;
};

export const getTestSession = (): TestSession | null => session;

export const recordTestError = (errorCode: string): void => {
    if (session && !session.errorCode) session.errorCode = errorCode;
};

export const recordTestAuthRejected = (): void => {
    if (session) session.isAuthRejected = true;
};
