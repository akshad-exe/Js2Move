import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink, RefreshCw, CheckCircle, XCircle, Clock, Wallet } from "lucide-react";
import { useDeployment } from "@/hooks";
import { useWallet } from "@/lib/wallet/useWallet";

interface DeploymentPanelProps {
  isActive: boolean;
}

export default function DeploymentPanel({ isActive }: DeploymentPanelProps) {
  const { deployments, loading, fetchDeployments } = useDeployment();
  const { address, isConnected, balance, isCheckingBalance } = useWallet();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (isActive && isConnected) {
      fetchDeployments();
    }
  }, [isActive, isConnected, fetchDeployments]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDeployments();
    setRefreshing(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Deployments</h3>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing || loading}
          className="p-2 rounded-md hover:bg-muted transition-colors disabled:opacity-50"
          title="Refresh deployments"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Wallet Info */}
      {isConnected && address && (
        <div className="p-4 border-b border-border/50 bg-blue-50 dark:bg-blue-900/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Connected Wallet</p>
              <p className="text-xs font-mono text-gray-600 dark:text-gray-400">
                {address.toString().slice(0, 6)}...{address.toString().slice(-4)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Testnet Balance</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {isCheckingBalance ? 'Checking...' : balance ? `${parseFloat(balance).toFixed(4)} MOVE` : '0.0000 MOVE'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Deployments List */}
      <div className="flex-1 overflow-y-auto">
        {loading && deployments.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border border-blue-500 border-t-transparent" />
          </div>
        ) : (!Array.isArray(deployments) || deployments.length === 0) ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500">
            <Wallet className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm">No deployments yet</p>
            <p className="text-xs">Deploy your first contract!</p>
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {(Array.isArray(deployments) ? deployments : []).slice(0, 10).map((deployment) => (
              <motion.div
                key={deployment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-3 rounded-lg border ${getStatusColor(deployment.status)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(deployment.status)}
                    <div>
                      <p className="text-sm font-medium">
                        {deployment.moduleName || 'Contract'}
                      </p>
                      <p className="text-xs opacity-75">
                        {new Date(deployment.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {deployment.txHash && (
                      <a
                        href={`https://explorer.movementnetwork.xyz/txn/${deployment.txHash}/userTxnOverview?network=bardock+testnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded-md hover:bg-black/10 transition-colors"
                        title="View Transaction"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {deployment.address && (
                      <a
                        href={`https://explorer.movementnetwork.xyz/account/${deployment.address}?network=bardock+testnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded-md hover:bg-black/10 transition-colors"
                        title="View Contract"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                {deployment.address && (
                  <p className="text-xs font-mono mt-2 opacity-75">
                    {deployment.address.slice(0, 8)}...{deployment.address.slice(-6)}
                  </p>
                )}

                {deployment.gasUsed && (
                  <p className="text-xs mt-1 opacity-75">
                    Gas used: {deployment.gasUsed.toLocaleString()}
                  </p>
                )}

                {deployment.error && (
                  <p className="text-xs mt-1 text-red-600 bg-red-50 p-2 rounded">
                    {deployment.error}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-border/50 bg-gray-50 dark:bg-gray-800/50">
        <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
          Deploying to Movement Testnet • Requires 0.1 APT minimum balance
        </p>
      </div>
    </motion.div>
  );
}