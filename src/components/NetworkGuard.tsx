import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { polygonAmoy } from 'wagmi/chains';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function NetworkGuard() {
  const chainId = useChainId();
  const { isConnected } = useAccount();
  const { switchChainAsync } = useSwitchChain();

  if (!isConnected) return null;
  
  if (chainId !== polygonAmoy.id) {
    return (
      <Alert className="m-4 border-destructive/50 bg-destructive/10">
        <AlertCircle className="h-4 w-4 text-destructive" />
        <AlertDescription className="flex items-center justify-between">
          <span className="text-destructive">
            You're on the wrong network. Please switch to Polygon Amoy testnet.
          </span>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => switchChainAsync({ chainId: polygonAmoy.id })}
          >
            Switch Network
          </Button>
        </AlertDescription>
      </Alert>
    );
  }
  
  return null;
}
