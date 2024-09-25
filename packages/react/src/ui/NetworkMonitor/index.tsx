import * as Dialog from '@radix-ui/react-dialog';
import { useEffect, useState } from 'react';

import { getThemeVariables } from '../../constants/themes';
import { useNetworkPaired } from '../../hooks/useNetworkPaired';
import { useFuel } from '../../providers';
import { DialogContent } from '../Dialog/components/Content';
import { NetworkSwitchDialog } from './components/NetworkSwitchDialog';
import { DialogMain, DialogOverlay, FuelRoot } from './styles';

export function NetworkMonitor({
  theme,
}: {
  theme: string;
}) {
  const { fuel } = useFuel();
  const currentConnector = fuel.currentConnector();
  // Fix hydration problem between nextjs render and frontend render
  // UI was not getting updated and theme colors was set wrongly
  // see more here https://nextjs.org/docs/messages/react-hydration-error
  const [isClient, setIsClient] = useState(false);
  const networkPaired = useNetworkPaired();

  const isOpen = networkPaired === false;

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Dialog.Root open={networkPaired === false}>
      <Dialog.Portal>
        <DialogOverlay asChild>
          <FuelRoot
            style={
              isClient
                ? {
                    display: isOpen ? 'block' : 'none',
                    ...getThemeVariables(theme),
                  }
                : undefined
            }
          >
            <DialogContent
              data-connector={!!currentConnector}
              // Disable closing when clicking outside the dialog
              onPointerDownOutside={(e) => {
                e.preventDefault();
              }}
              // Disable closing when pressing escape
              onEscapeKeyDown={(e) => {
                e.preventDefault();
              }}
            >
              <DialogMain>
                <NetworkSwitchDialog
                  currentConnector={currentConnector}
                  close={() => {
                    if (!networkPaired) {
                      currentConnector?.disconnect();
                    }
                  }}
                />
              </DialogMain>
            </DialogContent>
          </FuelRoot>
        </DialogOverlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
