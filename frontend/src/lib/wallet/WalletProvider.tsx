import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import type { ReactNode } from "react";

export function WalletProvider({ children }: { children: ReactNode }) {
    return (
        <AptosWalletAdapterProvider
            autoConnect={true}
            onError={(error) => {
                console.log("Wallet error:", error);
            }}
        >
            {children}
        </AptosWalletAdapterProvider>
    );
}
