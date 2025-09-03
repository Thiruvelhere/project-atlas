import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultWallets, RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { WagmiProvider, createConfig, http } from "wagmi";
import { hardhat } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// --- setup wagmi config ---
const { connectors } = getDefaultWallets({
  appName: "Project Atlas",
  projectId: "your-walletconnect-project-id", // ⚠️ get from cloud.walletconnect.com
  chains: [hardhat],
});

const config = createConfig({
  chains: [hardhat],
  transports: {
    [hardhat.id]: http(import.meta.env.VITE_RPC_URL || "http://127.0.0.1:8545"),
  },
  connectors,
});

const queryClient = new QueryClient();

// --- render ---
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider chains={[hardhat]} theme={darkTheme()}>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
