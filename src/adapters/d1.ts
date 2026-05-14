/**
 * Cloudflare D1 StorageAdapter 骨架 (Result Pattern)
 * 未来迁移时实现具体逻辑
 */
import {
  err,
  type StorageAdapter,
  type DataAdapter,
  type AuthAdapter,
  type QueryOptions,
  type QueryFilter,
  type Result,
  type AuthUser,
  type AuthSession,
  type SignUpParams,
  type SignInParams,
  type AuthStateChangeCallback,
} from './types';

const NOT_IMPLEMENTED = { message: 'D1Adapter not implemented', code: 'NOT_IMPLEMENTED' };

const d1Data: DataAdapter = {
  async query<T>(_table: string, _options?: QueryOptions): Promise<Result<T[]>> {
    return err(NOT_IMPLEMENTED);
  },
  async queryOne<T>(_table: string, _options?: QueryOptions): Promise<Result<T | null>> {
    return err(NOT_IMPLEMENTED);
  },
  async insert<T>(_table: string, _data: Record<string, unknown>): Promise<Result<T>> {
    return err(NOT_IMPLEMENTED);
  },
  async update<T>(_table: string, _data: Record<string, unknown>, _filters: QueryFilter[]): Promise<Result<T>> {
    return err(NOT_IMPLEMENTED);
  },
  async delete(_table: string, _filters: QueryFilter[]): Promise<Result<void>> {
    return err(NOT_IMPLEMENTED);
  },
};

const d1Auth: AuthAdapter = {
  async getUser(): Promise<Result<AuthUser | null>> {
    return err(NOT_IMPLEMENTED);
  },
  async getSession(): Promise<Result<AuthSession | null>> {
    return err(NOT_IMPLEMENTED);
  },
  async signUp(_params: SignUpParams): Promise<Result<void>> {
    return err(NOT_IMPLEMENTED);
  },
  async signIn(_params: SignInParams): Promise<Result<void>> {
    return err(NOT_IMPLEMENTED);
  },
  async signOut(): Promise<Result<void>> {
    return err(NOT_IMPLEMENTED);
  },
  onAuthStateChange(_callback: AuthStateChangeCallback) {
    return () => {};
  },
};

export const d1Adapter: StorageAdapter = {
  data: d1Data,
  auth: d1Auth,
};
