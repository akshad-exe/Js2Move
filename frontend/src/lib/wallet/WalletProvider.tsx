import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import toast from "react-hot-toast";
import type { ReactNode } from "react";

export function WalletProvider({ children }: { children: ReactNode }) {
    return (
        <AptosWalletAdapterProvider
            autoConnect={true}
            onError={(error) => {
                console.error("Wallet error:", error);
                toast.error(`Wallet error: ${error?.message || 'Unknown error'}`);
            }}
        >
            {children}
        </AptosWalletAdapterProvider>
    );
}
