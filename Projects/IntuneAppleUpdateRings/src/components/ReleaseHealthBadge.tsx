interface Props {
  risk: 'current' | 'lagging' | 'stale' | 'unsupported' | 'unknown';
}

export function ReleaseHealthBadge({ risk }: Props) {
  const labels: Record<string, string> = {
    current: 'Current',
    lagging: 'Lagging',
    stale: 'Stale',
    unsupported: 'Unsupported',
    unknown: 'Unknown'
  };

  return <span>{labels[risk]}</span>;
}
