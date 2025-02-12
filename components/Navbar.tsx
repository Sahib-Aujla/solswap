'use client'
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const Navbar = () => {
  return (
    <div className="flex justify-between p-5">
      <div>SolSwap</div>
      <div>
        <WalletMultiButton />
      </div>
    </div>
  );
};

export default Navbar;
