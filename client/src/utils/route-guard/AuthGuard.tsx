import { GuardProps } from 'types/auth';

const AuthGuard = ({ children }: GuardProps) => {
  return children;
};

export default AuthGuard;
