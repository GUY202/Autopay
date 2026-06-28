import { http, createConfig } from 'wagmi';
import { arcTestnet } from './arc';
import { injected } from 'wagmi/connectors';

export const config = createConfig({
  chains: [arcTestnet],
  connectors: [
    injected(),
  ],
  transports: {
    [arcTestnet.id]: http(),
  },
});
