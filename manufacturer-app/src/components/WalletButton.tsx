import { ConnectKitButton } from "connectkit";
import EllipsisText from "react-ellipsis-text";

export const WalletButton = () => {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, isConnecting, show, hide, address, ensName, chain }) => {
        return (
          <button
            onClick={show}
            className="bg-[#333] hover:bg-[#333]/90 transition-all text-white font-darkerGrotesque tracking-wider py-3 px-4 rounded-full text-ellipsis"
          >
            <p className="-mt-1">
              <EllipsisText
                text={isConnected ? address : "Connect your Wallet"}
                length={15}
              />
            </p>
          </button>
        );
      }}
    </ConnectKitButton.Custom>
  );
};
