import { useState } from "react";
import { Loader2, Fuel, TrendingUp } from "lucide-react";
import toast from "react-hot-toast";
import { estimateGas, getGasPrice } from "@/lib/api/gasClient";

interface GasPanelProps {
  code: string;
  theme?: string;
}

export default function GasPanel({ code }: GasPanelProps) {
  const [gasEstimate, setGasEstimate] = useState<any>(null);
  const [gasPrice, setGasPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEstimate = async () => {
    if (!code.trim()) {
      toast.error("Write some code first!");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const [estimate, priceData] = await Promise.all([
        estimateGas({ source: code }),
        getGasPrice(),
      ]);
      setGasEstimate(estimate);
      setGasPrice(priceData?.gasPrice || null);
      toast.success("Gas estimation complete!");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to estimate gas";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full rounded-lg overflow-hidden border border-border/50 bg-white/40 dark:bg-white/5 backdrop-blur-sm flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/50 bg-white/60 dark:bg-white/10 flex items-center justify-between">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Fuel className="w-4 h-4" />
          Gas Estimation
        </h3>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {error ? (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        ) : gasEstimate ? (
          <div className="space-y-6">
            {/* Gas Estimate Card */}
            <div className="p-4 rounded-lg border border-purple-500/20 bg-purple-500/5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Estimated Gas Units</p>
                  <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {gasEstimate?.units || gasEstimate?.gas || "0"}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500 opacity-50" />
              </div>
              <p className="text-xs text-muted-foreground">
                Based on your MoveJS code complexity
              </p>
            </div>

            {/* Gas Price */}
            {gasPrice !== null && (
              <div className="p-4 rounded-lg border border-blue-500/20 bg-blue-500/5">
                <p className="text-xs text-muted-foreground mb-1">Current Gas Price</p>
                <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  {gasPrice} (APT per unit)
                </p>
              </div>
            )}

            {/* Total Cost */}
            {gasPrice !== null && (
              <div className="p-4 rounded-lg border border-green-500/20 bg-green-500/5">
                <p className="text-xs text-muted-foreground mb-1">Estimated Transaction Cost</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {((gasEstimate?.units || gasEstimate?.gas || 0) * gasPrice).toFixed(6)} APT
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Approximate cost in Aptos native token
                </p>
              </div>
            )}

            {/* Details */}
            {gasEstimate?.details && (
              <div className="p-4 rounded-lg border border-border/50 bg-muted/20">
                <p className="text-sm font-semibold mb-2">Details</p>
                <pre className="text-xs bg-muted/50 p-3 rounded overflow-auto max-h-32">
                  {JSON.stringify(gasEstimate.details, null, 2)}
                </pre>
              </div>
            )}

            {/* Notes */}
            <div className="p-4 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
              <p className="text-xs text-yellow-700 dark:text-yellow-300">
                <strong>Note:</strong> Gas estimates are approximate. Actual costs may vary based on network conditions and transaction complexity.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <Fuel className="w-12 h-12 text-muted-foreground opacity-50" />
            <div className="text-center">
              <p className="text-sm font-medium text-foreground mb-1">Estimate Gas Costs</p>
              <p className="text-xs text-muted-foreground mb-4">Get an estimate of transaction fees for your code</p>
              <button
                onClick={handleEstimate}
                disabled={isLoading}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-all"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Estimating...
                  </span>
                ) : (
                  "Estimate Gas"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
