/**
 * Storage Adapter 统一契约
 * 抽象 CRUD、Auth、Query 操作，使 Services 层零直接后端依赖
 * 当前实现: SupabaseAdapter
 * 未来实现: D1Adapter (Cloudflare Workers + D1)
 */

// ============ Query Types ============

export interface QueryFilter {
  column: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'like' | 'ilike' | 'is';
  value: unknown;
}

export interface QueryOrder {
  column: string;
  ascending?: boolean;
}

export interface QueryOptions {
  filters?: QueryFilter[];
  order?: QueryOrder[];
  limit?: number;
  offset?: number;
  select?: string;
}

export interface QueryResult<T> {
  data: T[] | null;
  error: StorageError | null;
  count?: number;
}

export interface SingleResult<T> {
  data: T | null;
  error: StorageError | null;
}

export interface MutationResult<T = unknown> {
  data: T | null;
  error: StorageError | null;
}

// ============ Auth Types ============

export interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
  user: AuthUser;
}

export interface SignUpParams {
  email: string;
  password: string;
  fullName?: string;
  redirectUrl?: string;
}

export interface SignInParams {
  email: string;
  password: string;
}

export interface AuthStateChangeCallback {
  (event: string, session: AuthSession | null): void;
}

// ============ Error Types ============

export interface StorageError {
  message: string;
  code?: string;
  details?: string;
}

// ============ Adapter Interfaces ============

/**
 * CRUD 数据操作接口
 */
export interface DataAdapter {
  /** 查询多条记录 */
  query<T = Record<string, unknown>>(table: string, options?: QueryOptions): Promise<QueryResult<T>>;

  /** 查询单条记录 */
  queryOne<T = Record<string, unknown>>(table: string, options?: QueryOptions): Promise<SingleResult<T>>;

  /** 插入记录 */
  insert<T = Record<string, unknown>>(table: string, data: Record<string, unknown>): Promise<SingleResult<T>>;

  /** 更新记录 */
  update<T = Record<string, unknown>>(table: string, data: Record<string, unknown>, filters: QueryFilter[]): Promise<SingleResult<T>>;

  /** 删除记录 */
  delete(table: string, filters: QueryFilter[]): Promise<MutationResult>;
}

/**
 * 认证操作接口
 */
export interface AuthAdapter {
  /** 获取当前用户 */
  getUser(): Promise<SingleResult<AuthUser>>;

  /** 获取当前 session */
  getSession(): Promise<SingleResult<AuthSession>>;

  /** 注册 */
  signUp(params: SignUpParams): Promise<MutationResult>;

  /** 登录 */
  signIn(params: SignInParams): Promise<MutationResult>;

  /** 登出 */
  signOut(): Promise<MutationResult>;

  /** 监听认证状态变化，返回取消订阅函数 */
  onAuthStateChange(callback: AuthStateChangeCallback): () => void;
}

/**
 * 统一 Storage Adapter 接口
 */
export interface StorageAdapter {
  data: DataAdapter;
  auth: AuthAdapter;
}
