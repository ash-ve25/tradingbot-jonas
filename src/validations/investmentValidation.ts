import { body, check, param } from 'express-validator';

export function validateInvestment() {
  return [
    check('amount').exists().withMessage('amount is required'),
    check('transactionId').exists().withMessage('transactionId is required'),
    check('blockchain').exists().withMessage('blockchain name is required'),
    check('coin').exists().withMessage('coin name is required'),
  ];
}
export function validateInvestmentId() {
  return [param('id').exists().withMessage('id is required')];
}
