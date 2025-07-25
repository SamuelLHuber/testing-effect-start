import { useAccount, useConnect, useDisconnect, useEnsName } from "wagmi"

export function Wallet() {
  const { address, isConnected } = useAccount()
  const { data: ensName, error, status } = useEnsName({ address })
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  if (!isConnected) {
    return (
      <div className="card w-96 rounded-2xl bg-base-200 shadow-sm">
        <div className="card-body items-center">
          <h2 className="card-title text-2xl mb-4">
            Connect Wallet
          </h2>
          <p className="text-center mb-4">
            Connect your wallet to view your ENS name
          </p>
          {connectors.map((connector) => (
            <button
              key={connector.uid}
              onClick={() => connect({ connector })}
              className="btn btn-primary rounded-2xl btn-lg w-full text-lg font-semibold"
            >
              Connect {connector.name}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="card w-96 rounded-2xl bg-base-200 shadow-sm">
      <div className="card-body items-center">
        <h2 className="card-title text-2xl mb-4">
          Wallet Connected
        </h2>

        <div className="text-center mb-4">
          <p className="text-sm opacity-70 mb-2">
            Address:
          </p>
          <p className="font-mono text-xs break-all">
            {address}
          </p>
        </div>

        {status === "pending" && (
          <div className="text-center">
            <span className="loading loading-spinner loading-md">
            </span>
            <p className="mt-2">
              Loading ENS name...
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="text-center text-error">
            <p>
              Error fetching ENS name: {error?.message}
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="text-center mb-4">
            {ensName
              ? (
                <div>
                  <p className="text-sm opacity-70 mb-2">
                    ENS Name:
                  </p>
                  <p className="text-xl font-bold">
                    {ensName}
                  </p>
                </div>
              )
              : (
                <p className="text-sm opacity-70">
                  No ENS name found
                </p>
              )}
          </div>
        )}

        <button
          onClick={() => disconnect()}
          className="btn btn-outline rounded-2xl btn-sm mt-4"
        >
          Disconnect
        </button>
      </div>
    </div>
  )
}
