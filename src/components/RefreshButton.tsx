import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { RefreshCw } from 'lucide-react';
import { triggerDataRefresh } from '../utils/cacheUtils';
import { cn } from '@/lib/utils'; // optional: if you use className utils

interface RefreshButtonProps {
  tooltip?: string;
  size?: 'small' | 'medium' | 'large';
  color?: 'inherit' | 'primary' | 'secondary' | 'default';
}

export function RefreshButton({
  tooltip = 'Refresh data',
  size = 'medium',
}: RefreshButtonProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    triggerDataRefresh();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const sizeClass = {
    small: 'w-8 h-8',
    medium: 'w-9 h-9',
    large: 'w-10 h-10',
  }[size];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          variant='outline'
          size='icon'
          className={cn(sizeClass, 'transition')}
        >
          <RefreshCw
            className={cn('w-5 h-5', isRefreshing && 'animate-spin')}
          />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}
