import React from 'react'
import Link from 'next/link'

const MiniNavbar = () => {
  return (
    <div className='flex justify-between p-5 gap-3'>
      <Link href="/swap">
        <div className='cursor-pointer'>Swap</div>
      </Link>
      <Link href="/send">
        <div className='cursor-pointer'>Send</div>
      </Link>
      <Link href="/airdrop">
        <div className='cursor-pointer'>Airdrop</div>
      </Link>
      <Link href="/token">
        <div className='cursor-pointer'>Create Token</div>
      </Link>
    </div>
  )
}

export default MiniNavbar
