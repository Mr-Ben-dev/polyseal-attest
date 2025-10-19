import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ENV } from '@/lib/env';
import type { Attestation } from '@/lib/graphql';
import { formatDistanceToNow } from 'date-fns';
import { Calendar, ExternalLink, FileText, User } from 'lucide-react';

interface AttestationsTableProps {
  attestations: Attestation[];
  currentAddress?: string;
}

export function AttestationsTable({ attestations, currentAddress }: AttestationsTableProps) {
  if (attestations.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground" role="status" aria-live="polite">
        <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" aria-hidden="true" />
        <p className="text-lg mb-2">No attestations found</p>
        <p className="text-sm">
          Attestations where you are the attester or recipient will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto" role="region" aria-label="Attestations table">
      <table className="w-full" role="table" aria-label={`${attestations.length} attestation${attestations.length !== 1 ? 's' : ''} found`}>
        <thead>
          <tr className="border-b border-border/40">
            <th scope="col" className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
              UID
            </th>
            <th scope="col" className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
              Role
            </th>
            <th scope="col" className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
              Attester
            </th>
            <th scope="col" className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
              Recipient
            </th>
            <th scope="col" className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
              Time
            </th>
            <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {attestations.map((attestation) => {
            const isAttester = attestation.attester.toLowerCase() === currentAddress?.toLowerCase();
            const isRecipient = attestation.recipient.toLowerCase() === currentAddress?.toLowerCase();
            const timeAgo = formatDistanceToNow(new Date(attestation.time * 1000), {
              addSuffix: true,
            });

            return (
              <tr key={attestation.id} className="border-b border-border/20 hover:bg-muted/20">
                <td className="py-4 px-2">
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {attestation.uid.slice(0, 8)}...{attestation.uid.slice(-8)}
                  </code>
                </td>
                <td className="py-4 px-2">
                  {isAttester && isRecipient ? (
                    <Badge variant="outline" className="text-xs">
                      Both
                    </Badge>
                  ) : isAttester ? (
                    <Badge variant="default" className="text-xs">
                      <User className="w-3 h-3 mr-1" />
                      Attester
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      <FileText className="w-3 h-3 mr-1" />
                      Recipient
                    </Badge>
                  )}
                </td>
                <td className="py-4 px-2">
                  <code className="text-xs">
                    {attestation.attester.slice(0, 6)}...{attestation.attester.slice(-4)}
                  </code>
                </td>
                <td className="py-4 px-2">
                  <code className="text-xs">
                    {attestation.recipient.slice(0, 6)}...{attestation.recipient.slice(-4)}
                  </code>
                </td>
                <td className="py-4 px-2">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span className="text-xs">{timeAgo}</span>
                  </div>
                </td>
                <td className="py-4 px-2">
                  <div className="flex items-center gap-2">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="text-xs h-8"
                    >
                      <a href={`/attestations?uid=${attestation.uid}`}>
                        View
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="text-xs h-8"
                    >
                      <a
                        href={`${ENV.SCANNER}/tx/${attestation.uid}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}