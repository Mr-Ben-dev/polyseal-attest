import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { encodeAbiParameters, parseAbiParameters } from 'viem';

interface SchemaField {
  name: string;
  type: string;
}

interface SchemaFormGeneratorProps {
  schemaString: string;
  onSubmit: (encodedData: `0x${string}`, formValues: Record<string, unknown>) => void;
  disabled?: boolean;
  submitLabel?: string;
}

/**
 * Parse EAS schema string into structured fields
 * Example: "string name, uint256 age, bool active" -> [{name: "name", type: "string"}, ...]
 */
function parseSchemaString(schema: string): SchemaField[] {
  if (!schema || schema.trim() === '') {
    return [];
  }

  try {
    // Remove extra whitespace and split by comma
    const fields = schema
      .split(',')
      .map((field) => field.trim())
      .filter((field) => field.length > 0);

    return fields.map((field) => {
      // Split by space to get type and name
      const parts = field.trim().split(/\s+/);
      if (parts.length < 2) {
        throw new Error(`Invalid field format: ${field}`);
      }

      const type = parts[0];
      const name = parts.slice(1).join(' '); // Handle names with spaces

      return { name, type };
    });
  } catch (error) {
    console.error('Error parsing schema:', error);
    return [];
  }
}

/**
 * Get input type based on Solidity type
 */
function getInputType(solidityType: string): 'text' | 'number' | 'checkbox' | 'textarea' {
  if (solidityType.startsWith('uint') || solidityType.startsWith('int')) {
    return 'number';
  }
  if (solidityType === 'bool') {
    return 'checkbox';
  }
  if (solidityType === 'bytes' || solidityType.startsWith('bytes')) {
    return 'textarea';
  }
  return 'text';
}

/**
 * Convert form value to proper type for ABI encoding
 */
function convertValueForEncoding(value: unknown, solidityType: string): unknown {
  // Handle boolean
  if (solidityType === 'bool') {
    return Boolean(value);
  }

  // Handle integers
  if (solidityType.startsWith('uint') || solidityType.startsWith('int')) {
    const num = value === '' ? '0' : value;
    return BigInt(String(num));
  }

  // Handle addresses
  if (solidityType === 'address') {
    return value || '0x0000000000000000000000000000000000000000';
  }

  // Handle bytes32
  if (solidityType === 'bytes32') {
    const str = String(value);
    if (str.startsWith('0x')) {
      return str as `0x${string}`;
    }
    // Convert string to bytes32
    const hex = Buffer.from(str, 'utf8').toString('hex');
    return `0x${hex.padEnd(64, '0')}` as `0x${string}`;
  }

  // Handle bytes
  if (solidityType === 'bytes' || solidityType.startsWith('bytes')) {
    const str = String(value);
    if (str.startsWith('0x')) {
      return str as `0x${string}`;
    }
    return `0x${Buffer.from(str, 'utf8').toString('hex')}` as `0x${string}`;
  }

  // Default: string
  return String(value);
}

/**
 * Dynamic form generator that creates inputs based on EAS schema
 */
export default function SchemaFormGenerator({
  schemaString,
  onSubmit,
  disabled = false,
  submitLabel = 'Submit Attestation',
}: SchemaFormGeneratorProps) {
  const fields = parseSchemaString(schemaString);
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});
  const [error, setError] = useState<string>('');

  const handleInputChange = (fieldName: string, value: unknown) => {
    setFormValues((prev) => ({ ...prev, [fieldName]: value }));
    setError(''); // Clear error on input change
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Validate all required fields have values
      const missingFields = fields.filter((field) => {
        const value = formValues[field.name];
        return value === undefined || value === '' || value === null;
      });

      if (missingFields.length > 0) {
        setError(`Please fill in all fields: ${missingFields.map((f) => f.name).join(', ')}`);
        return;
      }

      // Convert schema string to ABI parameter format
      const abiParams = parseAbiParameters(schemaString);

      // Convert form values to proper types for encoding
      const values = fields.map((field) =>
        convertValueForEncoding(formValues[field.name], field.type)
      );

      // Encode data using viem - cast values as any to satisfy type checker
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const encodedData = encodeAbiParameters(abiParams, values as any);

      // Call parent submit handler with encoded data and raw values
      onSubmit(encodedData, formValues);
    } catch (err) {
      console.error('Error encoding data:', err);
      setError(err instanceof Error ? err.message : 'Failed to encode attestation data');
    }
  };

  if (fields.length === 0) {
    return (
      <div className="p-4 bg-muted rounded-lg text-center text-muted-foreground">
        No schema fields to display. Please select a valid schema.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => {
        const inputType = getInputType(field.type);
        const value = formValues[field.name] ?? '';

        return (
          <div key={field.name}>
            <Label htmlFor={field.name} className="flex items-center gap-2">
              <span className="font-medium">{field.name}</span>
              <span className="text-xs text-muted-foreground font-mono">({field.type})</span>
            </Label>

            {inputType === 'checkbox' ? (
              <div className="flex items-center space-x-2 mt-2">
                <Switch
                  id={field.name}
                  checked={Boolean(value)}
                  onCheckedChange={(checked) => handleInputChange(field.name, checked)}
                  disabled={disabled}
                />
                <Label htmlFor={field.name} className="text-sm text-muted-foreground">
                  {value ? 'True' : 'False'}
                </Label>
              </div>
            ) : inputType === 'textarea' ? (
              <Textarea
                id={field.name}
                placeholder={`Enter ${field.name} (${field.type})`}
                rows={3}
                value={String(value || '')}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                disabled={disabled}
                className="mt-1 font-mono text-sm"
              />
            ) : (
              <Input
                id={field.name}
                type={inputType}
                placeholder={`Enter ${field.name}${field.type === 'address' ? ' (0x...)' : ''}`}
                value={String(value || '')}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                disabled={disabled}
                className="mt-1"
              />
            )}

            {field.type === 'address' &&
              value &&
              typeof value === 'string' &&
              !value.startsWith('0x') && (
                <p className="text-xs text-amber-600 mt-1">Address should start with 0x</p>
              )}
          </div>
        );
      })}

      {error && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <AlertCircle className="w-4 h-4 text-destructive" />
          <span className="text-sm text-destructive">{error}</span>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={disabled}>
        {submitLabel}
      </Button>
    </form>
  );
}
