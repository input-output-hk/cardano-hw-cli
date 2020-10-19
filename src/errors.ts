/* eslint-disable max-len */
const errors: {[key: string]: ({ message } : { message?: string }) => string} = {
  TrezorSignTxError: () => 'TrezorSignTxError: Error occured while signing the transaction with Trezor',
  HwTransportNotFoundError: () => 'HwTransportNotFoundError: Error occured while trying to find hw transport, make sure Ledger or Trezor is connected to you computer',
  InvalidPathError: ({ message }) => `InvalidPathError: can not parse path: ${message}`,
  InvalidFileTypeError: ({ message }) => `InvalidFileTypeError: Invalid file type of hw-signing-file at path: ${message}`,
  InvalidHwSigningFileError: ({ message }) => `InvalidHwSigningFileError: Invalid file contents of hw-signing-file at ${message}`,
  InvalidTxBodyFileError: ({ message }) => `InvalidTxBodyFileError: Invalid file contents of tx-body-file at ${message}`,
  TxSerializationMismatchError: () => 'TxSerializationMismatchError: Tx serialization mismatch',
  MissingHwSigningDataAtPathError: ({ message }) => `MissingHwSigningDataAtPathError: Can not find hw signing data with path ${message}`,
  MultipleWitnessesError: () => 'MultipleWitnessesError: Multiple witnesses found',
  UndefinedCommandError: () => 'UndefinedCommandError: command undefined',
  MissingSigningFileError: () => 'MissingSigningFileError: missing signing file',
  UnknownCertificateTypeError: () => 'UnknownCertificateTypeError: unknown certificate type',
  MultipleCertificatesWithPoolRegError: () => 'MultipleCertificatesWithPoolRegError: Multiple pool registration certificates found, expected one',
  WithdrawalIncludedWithPoolRegError: () => 'WithdrawalIncludedWithPoolRegError: Withdrawal certificate and pool registration certificate found, expected one',
  PaymentFileInlucedWithPoolRegError: () => 'PaymentFileInlucedWithPoolRegError: Unexpected payment hardware signing file with pool registration certificate found',
  MultipleStakingSigningFilesWithPoolRegError: () => 'MultipleStakingSigningFilesWithPoolRegError: Multiple staking signing files with pool registration certificate found, expected only one staking signing file',
  MissingPaymentSigningFileError: () => 'MissingPaymentSigningFileError: Missing payment hardware signing file',
  TooManySigningFilesError: () => 'TooManySigningFilesError:',
  MissingStakingSigningFileError: () => 'MissingStakingSigningFileError',
  MissingInputError: () => 'MissingInputError',
  MissingOutputError: () => 'MissingOutputError',
  TrezorError: () => 'TrezorError: Trezor operation failed, please make sure you are using the latest version of Trezor firmware',
}

const getErrorTranslation = (
  error: Error,
): string => {
  const translation = errors[error.name]
  if (translation !== undefined) {
    return translation(error)
  }

  return 'UknownError: An unkwown error has occured'
}

export {
  getErrorTranslation,
}
