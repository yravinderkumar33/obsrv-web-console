import { GuardProps } from 'types/auth';

const GuestGuard = ({ children }: GuardProps) => {
  return children;
};

export default GuestGuard;
