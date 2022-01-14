export enum SignInType {
  FACEBOOK = 'facebook',
  GOOGLE = 'google',
  REGISTER = 'register',
}

export enum UserRoles {
  ROOT = 'root',
  ADMIN = 'admin',
  USER = 'user',
}

export enum LanguageCode {
  VIETNAMESE = 'vn',
  FRENCH = 'fr',
  ENGLISH = 'en',
}

export enum SaleUnit {
  PERCENTAGE = '%',
  USD = 'usd',
}

export enum OrderStatus {
  PENDING = 'pending',
  CANCELED = 'cancel',
  REJECTED = 'rejected',
  REFUNDED = 'refunded',
  COMPLETED = 'completed',
}

export enum SaleType {
  ORDER = 'order',
  COLLECTION = 'collection',
  PRODUCT = 'product',
  COMBO = 'combo',
}
