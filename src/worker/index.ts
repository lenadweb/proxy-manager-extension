import { registerProxySync } from './applyProxy';
import { registerProxyAuth } from './proxyAuth';
import { registerProxyErrorListener } from './proxyErrors';
import { registerProxyTester } from './proxyTester';
import { registerProxyExtensionControl } from './proxyExtensions';

registerProxyAuth();
registerProxyErrorListener();
registerProxyTester();
registerProxyExtensionControl();
registerProxySync();
