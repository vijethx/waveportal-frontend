import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button, Box } from "@chakra-ui/react";

export default function ConenctBtn() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        return (
          <Box
            {...(!mounted && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}>
            {(() => {
              if (!mounted || !account || !chain) {
                return (
                  <Button
                    onClick={openConnectModal}
                    type='button'
                    colorScheme={"purple"}
                    bg={"purple.500"}
                    px={6}
                    _hover={{
                      bg: "purple.600",
                    }}>
                    Connect Wallet
                  </Button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type='button'>
                    Wrong network
                  </button>
                );
              }
              return (
                <Box style={{ display: "flex", gap: 12 }}>
                  <Button
                    onClick={openAccountModal}
                    type='button'
                    bgColor={"white"}
                    border='2px'
                    borderColor={"purple.600"}>
                    {" "}
                    {chain.iconUrl && (
                      <img
                        alt={chain.name ?? "Chain icon"}
                        src={chain.iconUrl}
                        style={{ width: 20, height: 20, marginRight: 4 }}
                      />
                    )}
                    {account.displayName}
                  </Button>
                </Box>
              );
            })()}
          </Box>
        );
      }}
    </ConnectButton.Custom>
  );
}
