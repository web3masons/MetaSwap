const InvoiceDetails = ({ invoice }) => {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title h5">Bitcoin Payment: {invoice.milisats} Milisats</div>
        <div className="card-subtitle text-gray">Lightning Network Invoice</div>
      </div>
      <div className="card-body">
        <table className="table table-scroll" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Expires</th>
              <th>Satoshis</th>
              <th>USD Value</th>
              <th>Pre Image Hash</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{invoice.expires.toLocaleDateString()} @ {invoice.expires.toLocaleTimeString()}</td>
              <td>{invoice.milisats / 1000}</td>
              <td>0.000001</td>
              <td>
                {invoice.preImageHash}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default InvoiceDetails
