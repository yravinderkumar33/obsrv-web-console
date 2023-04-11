
export interface Filters {
  [key: string]: any;
}

export interface IExistsPayload {
  email: string;
  countryCode: string;
  number: string;
}

export interface ISearchPayload {
  filters: Filters;
  limit: number;
  offset: number;
}

export interface IGenerateToken {
  grant_type: string;
  client_id: any;
  client_secret: any;
}

export interface IRefreshToken {
  grant_type: string;
  client_id: any;
  client_secret: any;
  refresh_token: string;
}

export interface IUserRegister {
  name: string;
  airlineCode: string;
  email?: string;
  isEmailVerified?: boolean;
  alternateEmail?: string;
  globalMobileNumber?: string;
  mobileNumber?: string;
  countryCode?: string;
  ismobileNumberVerified?: boolean;
  status: string;
  tenantId?: string;
  roles: Array<IUserRoles>;
  devices?: Array<IUserDevices>;
  nationality?: string;
  termsAndConditions?: Array<IUserTermsAndConditions>;
  gender?: string;
  address?: string;
  userName: string;
  languageProficiency?: Array<IUserLanguageProficiency>;
  summaries?: Object;
}

export interface IUserRoles {
  name: string;
  scope: Object;
}

export interface IUserDevices {
  id: string;
  fcmToken: string;
  type: string;
}

export interface IUserTermsAndConditions {
  version: string;
  status: string;
  acceptedOn: string;
}

export interface IUserLanguageProficiency {
  id: string;
  capabilities: IUserLanguageProficiencyCapabilities;
}

export interface IUserLanguageProficiencyCapabilities {
  read: string;
  write: string;
  speak: string;
}

