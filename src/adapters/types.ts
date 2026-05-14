/**
 * Storage Adapter 统一契约 (Result Pattern)
 * 抽象 CRUD、Auth、Query 操作，使 Services 层零直接后端依赖
 *
 * 所有异步方法返回 `Result<T>` 判别联合：
 *   - { ok: true, value }  成功分支
 *   - { ok: false, error } 失败分支
 *
 * Services 层必须显式 `if (!result.ok)` 处理失败分支。
 */

// ============ Result Pattern ============

export interface StorageError {
  message: string;
  code?: string;
  details?: string;
}

export type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: StorageError };

export const ok = <T>(value: T): Result<T> => ({ ok: true, value });
export const err = <T = never>(error: StorageError): Result<T> => ({ ok: false, error });

/** 把 unknown 异常归一化为 StorageError */
export function toStorageError(e: unknown): StorageError {
  if (!e) return { message: 'Unknown error' };
  if (typeof e === 'object' && e !== null) {
    const anyE = e as { message?: string; code?: string; details?: string };
    return {
      message: anyE.message || String(e),
      code: anyE.code,
      details: anyE.details,
    };
  }
  return { message: String(e) };
}

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

// ============ Adapter Interfaces ============

/**
 * CRUD 数据操作接口
 */
export interface DataAdapter {
  /** 查询多条记录 */
  query<T = Record<string, unknown>>(table: string, options?: QueryOptions): Promise<Result<T[]>>;

  /** 查询单条记录，未找到时 value 为 null */
  queryOne<T = Record<string, unknown>>(table: string, options?: QueryOptions): Promise<Result<T | null>>;

  /** 插入单条记录 */
  insert<T = Record<string, unknown>>(table: string, data: Record<string, unknown>): Promise<Result<T>>;

  /** 更新单条记录 */
  update<T = Record<string, unknown>>(table: string, data: Record<string, unknown>, filters: QueryFilter[]): Promise<Result<T>>;

  /** 删除记录 */
  delete(table: string, filters: QueryFilter[]): Promise<Result<void>>;
}

/**
 * 认证操作接口
 */
export interface AuthAdapter {
  /** 获取当前用户，未登录时 value 为 null */
  getUser(): Promise<Result<AuthUser | null>>;

  /** 获取当前 session，未登录时 value 为 null */
  getSession(): Promise<Result<AuthSession | null>>;

  /** 注册 */
  signUp(params: SignUpParams): Promise<Result<void>>;

  /** 登录 */
  signIn(params: SignInParams): Promise<Result<void>>;

  /** 登出 */
  signOut(): Promise<Result<void>>;

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
