/**
 * Storage Adapter 入口
 * 通过环境变量 VITE_STORAGE_PROVIDER 切换后端实现
 * 默认: supabase
 */
import type { StorageAdapter } from './types';
import { supabaseAdapter } from './supabase';

export type { StorageAdapter, DataAdapter, AuthAdapter } from './types';
export type {
  QueryFilter,
  QueryOptions,
  QueryResult,
  SingleResult,
  MutationResult,
  AuthUser,
  AuthSession,
  SignUpParams,
  SignInParams,
  StorageError,
} from './types';

function resolveAdapter(): StorageAdapter {
  const provider = import.meta.env.VITE_STORAGE_PROVIDER || 'supabase';

  switch (provider) {
    case 'd1': {
      // 动态导入避免打包未使用的适配器
      // 注意: 这里用同步导入因为 adapter 在应用启动时就需要
      const { d1Adapter } = require('./d1');
      return d1Adapter;
    }
    case 'supabase':
    default:
      return supabaseAdapter;
  }
}

/** 全局单例 Storage Adapter */
export const storage = resolveAdapter();
