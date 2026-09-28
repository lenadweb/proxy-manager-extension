import { registerProxySync } from './applyProxy';
import { registerProxyAuth } from './proxyAuth';
import { registerProxyErrorListener } from './proxyErrors';
import { registerProxyTester } from './proxyTester';

registerProxySync();
registerProxyAuth();
registerProxyErrorListener();
registerProxyTester();
