import { useState, useEffect, useCallback } from "react";
import { useWallet as useAptosWallet } from "@aptos-labs/wallet-adapter-react";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

export function useWallet() {
    const {
        connect,
        disconnect,
        account,
        connected,
        wallets,
        wallet
    } = useAptosWallet();

    const [balance, setBalance] = useState<string | null>(null);
    const [isCheckingBalance, setIsCheckingBalance] = useState(false);

    // Just a quick helper I wrote to format the long addresses into something readable
    const formatAddress = (address: string) => {
        if (!address) return "";
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    // Check wallet balance on Movement testnet
    const checkBalance = useCallback(async () => {
        if (!account?.address) return;

        setIsCheckingBalance(true);
        try {
            // Configure for Movement testnet
            const config = new AptosConfig({
                network: Network.CUSTOM,
                fullnode: 'https://testnet.movementnetwork.xyz/v1'
            });
            const aptos = new Aptos(config);

            // Get APT balance from coin store
            const resources = await aptos.getAccountResources({ accountAddress: account.address.toString() });
            const coinStore = resources.find(r =>
                r.type === '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>'
            );

            let balanceValue = '0';
            if (coinStore) {
                balanceValue = (coinStore.data as any).coin.value;
            }

            // Convert from octas to MOVE (1 MOVE = 100,000,000 octas)
            const balanceInMove = parseInt(balanceValue) / 100000000;
            setBalance(balanceInMove.toString());
        } catch (error) {
            console.error('Failed to check balance:', error);
            setBalance('0');
        } finally {
            setIsCheckingBalance(false);
        }
    }, [account?.address]);

    // Check balance when wallet connects
    useEffect(() => {
        if (connected && account?.address) {
            checkBalance();
        } else {
            setBalance(null);
        }
    }, [connected, account?.address, checkBalance]);

    // This is where I handle the connection logic, prioritizing Nightly wallet
    const connectWallet = async () => {
        try {
            // Prioritize Nightly wallet
            const nightlyWallet = wallets?.find(w => w.name.toLowerCase().includes('nightly'));
            if (nightlyWallet) {
                await connect(nightlyWallet.name);
                return;
            }

            // Fallback to first available wallet
            const availableWallet = wallets?.[0];
            if (availableWallet) {
                await connect(availableWallet.name);
            } else {
                alert("Please install a compatible wallet extension (Nightly, Petra, etc.)");
                window.open("https://nightly.app/download", "_blank");
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
        hasWallet: wallets && wallets.length > 0,
        balance,
        isCheckingBalance,
        checkBalance
    };
}
