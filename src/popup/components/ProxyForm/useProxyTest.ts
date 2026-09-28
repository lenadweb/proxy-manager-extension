import { useState } from 'react';
import { getConnectionSignature } from 'src/shared/proxy';
import { ProxyTestResult, requestProxyTest } from 'src/shared/proxyTest';
import { ProxyProfile } from 'src/shared/types';

type CompletedTest = {
    signature: string;
    result: ProxyTestResult;
};

export const useProxyTest = (currentSignature: string) => {
    const [completedTest, setCompletedTest] = useState<CompletedTest | null>(
        null
    );

    const result =
        completedTest?.signature === currentSignature
            ? completedTest.result
            : null;

    const runTest = async (proxy: ProxyProfile): Promise<ProxyTestResult> => {
        const testResult = await requestProxyTest(proxy);
        setCompletedTest({
            signature: getConnectionSignature(proxy),
            result: testResult,
        });
        return testResult;
    };

    return { result, runTest };
};
