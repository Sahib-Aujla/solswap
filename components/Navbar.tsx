'use client'
import dynamic from 'next/dynamic'
import SolBalance from './SolBalance';

// Dynamically import WalletMultiButton with SSR disabled
const WalletMultiButton = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

const Navbar = () => {
  return (
    <div className="flex justify-between p-5">
      <div>SolSwap</div>
      <div className='flex gap-5'>
        <SolBalance />
        <WalletMultiButton />
      </div>
    </div>
  );
};

export default Navbar;