import { useWallet as useAptosWallet } from "@aptos-labs/wallet-adapter-react";

export function useWallet() {
    const {
        connect,
        disconnect,
        account,
        connected,
        wallets,
        wallet
    } = useAptosWallet();

    // Just a quick helper I wrote to format the long addresses into something readable
    const formatAddress = (address: string) => {
        if (!address) return "";
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    // This is where I handle the connection logic, defaulting to Razor if it's there
    const connectWallet = async () => {
        try {
            const availableWallet = wallets?.[0];
            if (availableWallet) {
                await connect(availableWallet.name);
            } else {
                alert("Please install Razor Wallet extension");
                window.open("https://chromewebstore.google.com/detail/razor-wallet/fdcnegogpncmocked6eias4h4xkpjpdh", "_blank");
            }
        } catch (error) {
            console.error("Connection error:", error);
        }
    };

    // Simple disconnect wrapper
    const disconnectWallet = async () => {
        try {
            await disconnect();
        } catch (error) {
            console.error("Disconnect error:", error);
        }
    };

    return {
        connect: connectWallet,
        disconnect: disconnectWallet,
        address: account?.address,
        formattedAddress: account?.address ? formatAddress(account.address.toString()) : undefined,
        isConnected: connected,
        walletName: wallet?.name,
        hasWallet: wallets && wallets.length > 0
    };
}
