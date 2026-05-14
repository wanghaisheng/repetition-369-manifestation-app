/**
 * Storage Adapter 入口
 * 通过环境变量 VITE_STORAGE_PROVIDER 切换后端实现
 * 默认: supabase
 */
import type { StorageAdapter } from './types';
import { supabaseAdapter } from './supabase';
import { d1Adapter } from './d1';

export type {
  StorageAdapter,
  DataAdapter,
  AuthAdapter,
  QueryFilter,
  QueryOptions,
  Result,
  AuthUser,
  AuthSession,
  SignUpParams,
  SignInParams,
  StorageError,
} from './types';

export { ok, err, toStorageError } from './types';

function resolveAdapter(): StorageAdapter {
  const provider = import.meta.env.VITE_STORAGE_PROVIDER || 'supabase';
  switch (provider) {
    case 'd1':
      return d1Adapter;
    case 'supabase':
    default:
      return supabaseAdapter;
  }
}

/** 全局单例 Storage Adapter */
export const storage = resolveAdapter();
