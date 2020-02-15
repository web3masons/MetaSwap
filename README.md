# MetaSwap

* Alice has Lightning and wants Dai
* Bob has Dai and wants Lightning
* Bob deposits Dai into metaswap contract
* Bob shares a link with Alice to create a webrtc her
* Alice and Bob negotiate a swap volume and price
* Bob pastes his invoice into the app
* The app parses and sends the invoice to alice
* Upon payment of the invoice, alice will get a preimage
* Alice pastes the preimage into the app
* The preimage is relayed to the contract; Alice gets paid

## Nice things

* Alice doesn't need ETH; Dai can be sent directly to her exchange
* The time window that alice can 'spam' bob is really small
* Better than supercavitation as bob doesn't need to set up the swap on chain

## Punishment for bob

* Bob has rate limiting that will burn his stash, to ensure he can't try and scam Alice without hurting himself
* Can only spend 20% of any given asset at a time, and must do trades in series (nonces)
* If bob breaks the rules
  * Recipient gets their cut
  * Replayer gets their cut
  * 40% gets burned

## MVP Flow

### Alice UX

* Get link from Bob
* She enters a deposit address (pasted)
* Shows swap details offered by Bob incl. LN invoice (all verified by her UI)
* She makes the payment and pastes in the preimage

### Bob UX

* Managing Funds
  * Withdraw
  * Deposit
  * Set Burner Wallet
* Create new swap offer
  * Options to configure a new swap
    * Coin, price, amount
    * He pastes in a LN invoice
  * Generates a link/qr to share with alice

## Future Flows (v1)

* Option for alice request amounts (if she is remote)
* Deposit step to prevent bob getting spammed
* Limits (in case burner is compromised)