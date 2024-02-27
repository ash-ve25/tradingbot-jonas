import { body, check, param } from 'express-validator';

export function validateWithdrawal() {
  return [
    check('withdrawalAmount').exists().withMessage('withdrawal amount is required'),
    check('walletAddress').exists().withMessage('walletAddress is required'),
    check('blockchain').exists().withMessage('blockchain name is required'),
    check('investment').exists().withMessage('investment id is required'),
  ];
}
export function validateWithdrawalId() {
  return [param('id').exists().withMessage('id is required')];
}
export function validateWithdrawalApprove() {
  return [param('id').exists().withMessage('id is required')];
}
