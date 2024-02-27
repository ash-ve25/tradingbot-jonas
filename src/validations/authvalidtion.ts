import { body } from 'express-validator';

export function CHECK_ADMIN(isLogin: boolean) {
  if (isLogin) {
    return [
      body('email').isEmail().withMessage('Invalid Email'),
      body('password').notEmpty().withMessage('Password Is Required'),
    ];
  } else {
    return [
      body('email').isEmail().withMessage('Invalid Email'),
      body('password').notEmpty().withMessage('Password Is Required'),
      body('firstName').notEmpty().withMessage('First Name Is Required'),
      body('lastName').notEmpty().withMessage('Last Name Is Required'),
    ];
  }
}
export function CHECK_USER(isLogin: boolean) {
  if (isLogin) {
    return [
      body('mobileNo').notEmpty().withMessage('Invalid Mobile Number'),
      body('code').notEmpty().withMessage('OTP Is Required'),
    ];
  } else {
    return [
      // body('email').isEmail().withMessage('Invalid Email'),
      body('password').notEmpty().withMessage('Password Is Required'),
      body('name').notEmpty().withMessage('Name Is Required'),
      body('mobileNo').notEmpty().withMessage('Mobile Number Is Required'),
    ];
  }
}
