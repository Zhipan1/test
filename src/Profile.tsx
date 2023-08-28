import {
    useAccount,
    useConnect,
    useDisconnect,
  } from 'wagmi'

import { goerli } from 'wagmi/chains'


  import Mint from './Mint'
  
  export function Profile() {
    const { isConnected } = useAccount()
    const { connect, connectors, error, isLoading, pendingConnector } =
      useConnect()
    const { disconnect } = useDisconnect()
  
    if (isConnected) {
      return (
        <div>
            <Mint />
          <button onClick={() => disconnect()}>Disconnect</button>
        </div>
      )
    }
  
    return (
      <div>
        {connectors.map((connector) => (
          <button
            disabled={!connector.ready}
            key={connector.id}
            onClick={() => connect({ connector, chainId: goerli.id })}
          >
            {connector.name}
            {!connector.ready && ' (unsupported)'}
            {isLoading &&
              connector.id === pendingConnector?.id &&
              ' (connecting)'}
          </button>
        ))}
  
        {error && <div>{error.message}</div>}
      </div>
    )
  }
  