const errors: {[key: string]: string} = {
  TrezorSignTxError: 'TrezorSignTxError: Error occured while signing the transaction with Trezor',
  HwTransportNotFoundError: 'HwTransportNotFoundError: Error occured while trying to find hw transport,'
  + ' make sure Ledger or Trezor is connected to you computer',
}

const getErrorTranslation = (
  error: Error,
) => errors[error.message] || 'UknownError: An unkwown error has occured'

export {
  getErrorTranslation,
}
