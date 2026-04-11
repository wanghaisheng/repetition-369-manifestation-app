/**
 * Cloudflare D1 StorageAdapter 骨架
 * 未来迁移时实现具体逻辑
 */
import type {
  StorageAdapter,
  DataAdapter,
  AuthAdapter,
  QueryOptions,
  QueryFilter,
  QueryResult,
  SingleResult,
  MutationResult,
  SignUpParams,
  SignInParams,
  AuthStateChangeCallback,
} from './types';

const NOT_IMPLEMENTED = { message: 'D1Adapter not implemented', code: 'NOT_IMPLEMENTED' };

const d1Data: DataAdapter = {
  async query<T>(_table: string, _options?: QueryOptions): Promise<QueryResult<T>> {
    // TODO: Implement D1 query via Cloudflare Workers binding
    return { data: null, error: NOT_IMPLEMENTED };
  },
  async queryOne<T>(_table: string, _options?: QueryOptions): Promise<SingleResult<T>> {
    return { data: null, error: NOT_IMPLEMENTED };
  },
  async insert<T>(_table: string, _data: Record<string, unknown>): Promise<SingleResult<T>> {
    return { data: null, error: NOT_IMPLEMENTED };
  },
  async update<T>(_table: string, _data: Record<string, unknown>, _filters: QueryFilter[]): Promise<SingleResult<T>> {
    return { data: null, error: NOT_IMPLEMENTED };
  },
  async delete(_table: string, _filters: QueryFilter[]): Promise<MutationResult> {
    return { data: null, error: NOT_IMPLEMENTED };
  },
};

const d1Auth: AuthAdapter = {
  async getUser() {
    // TODO: Implement via Cloudflare Access / custom JWT
    return { data: null, error: NOT_IMPLEMENTED };
  },
  async getSession() {
    return { data: null, error: NOT_IMPLEMENTED };
  },
  async signUp(_params: SignUpParams) {
    return { data: null, error: NOT_IMPLEMENTED };
  },
  async signIn(_params: SignInParams) {
    return { data: null, error: NOT_IMPLEMENTED };
  },
  async signOut() {
    return { data: null, error: NOT_IMPLEMENTED };
  },
  onAuthStateChange(_callback: AuthStateChangeCallback) {
    return () => {};
  },
};

export const d1Adapter: StorageAdapter = {
  data: d1Data,
  auth: d1Auth,
};
