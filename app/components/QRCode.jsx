import { QRCode as QR } from 'react-qr-svg'

const QRCode = ({ data, type }) => {
  const code = data
  return (
    <div className="qr-container">
      <QR value={code} />
    </div>
  )
}

export default QRCode
