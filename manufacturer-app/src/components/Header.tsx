import { WalletButton } from "./WalletButton";

export default function Header() {
  return (
    <header className="bg-white shadow-sm font-darkerGrotesque">
      <div className="p-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#333] -mt-1">
          NFC Tag Manager
        </h1>
        <WalletButton />
      </div>
    </header>
  );
}
