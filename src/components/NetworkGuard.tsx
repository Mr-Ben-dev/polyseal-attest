import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { polygonAmoy } from 'wagmi/chains';

interface NetworkGuardProps {
  children?: React.ReactNode;
}

export function NetworkGuard({ children }: NetworkGuardProps) {
  const chainId = useChainId();
  const { isConnected } = useAccount();
  const { switchChainAsync } = useSwitchChain();

  if (!isConnected) {
    return (
      <Alert className="m-4 border-yellow-500/50 bg-yellow-500/10">
        <AlertCircle className="h-4 w-4 text-yellow-500" />
        <AlertDescription className="text-yellow-700">
          Please connect your wallet to continue.
        </AlertDescription>
      </Alert>
    );
  }
  
  if (chainId !== polygonAmoy.id) {
    return (
      <Alert className="m-4 border-destructive/50 bg-destructive/10">
        <AlertCircle className="h-4 w-4 text-destructive" />
        <AlertDescription className="flex items-center justify-between">
          <span className="text-destructive">
            Please switch to Polygon Amoy testnet.
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
  
  return <>{children}</>;
}
