/**
 * Supabase StorageAdapter 实现 (Result Pattern)
 */
import { supabase } from '@/integrations/supabase/client';
import {
  ok,
  err,
  toStorageError,
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

// ============ Helpers ============

function applyFilters(query: any, filters?: QueryFilter[]) {
  if (!filters?.length) return query;
  for (const f of filters) {
    switch (f.operator) {
      case 'eq':    query = query.eq(f.column, f.value); break;
      case 'neq':   query = query.neq(f.column, f.value); break;
      case 'gt':    query = query.gt(f.column, f.value); break;
      case 'gte':   query = query.gte(f.column, f.value); break;
      case 'lt':    query = query.lt(f.column, f.value); break;
      case 'lte':   query = query.lte(f.column, f.value); break;
      case 'in':    query = query.in(f.column, f.value as unknown[]); break;
      case 'like':  query = query.like(f.column, f.value); break;
      case 'ilike': query = query.ilike(f.column, f.value); break;
      case 'is':    query = query.is(f.column, f.value); break;
    }
  }
  return query;
}

// ============ Data Adapter ============

const supabaseData: DataAdapter = {
  async query<T>(table: string, options?: QueryOptions): Promise<Result<T[]>> {
    try {
      let q = (supabase.from as any)(table).select(options?.select || '*');
      q = applyFilters(q, options?.filters);
      if (options?.order) {
        for (const o of options.order) {
          q = q.order(o.column, { ascending: o.ascending ?? true });
        }
      }
      if (options?.limit) q = q.limit(options.limit);
      if (options?.offset) q = q.range(options.offset, options.offset + (options.limit || 100) - 1);

      const { data, error } = await q;
      if (error) return err(toStorageError(error));
      return ok((data as T[]) ?? []);
    } catch (e) {
      return err(toStorageError(e));
    }
  },

  async queryOne<T>(table: string, options?: QueryOptions): Promise<Result<T | null>> {
    try {
      let q = (supabase.from as any)(table).select(options?.select || '*');
      q = applyFilters(q, options?.filters);
      const { data, error } = await q.maybeSingle();
      if (error) return err(toStorageError(error));
      return ok((data as T | null) ?? null);
    } catch (e) {
      return err(toStorageError(e));
    }
  },

  async insert<T>(table: string, data: Record<string, unknown>): Promise<Result<T>> {
    try {
      const { data: result, error } = await (supabase.from as any)(table).insert(data).select().single();
      if (error) return err(toStorageError(error));
      if (!result) return err({ message: 'Insert returned no row' });
      return ok(result as T);
    } catch (e) {
      return err(toStorageError(e));
    }
  },

  async update<T>(table: string, data: Record<string, unknown>, filters: QueryFilter[]): Promise<Result<T>> {
    try {
      let q = (supabase.from as any)(table).update(data);
      q = applyFilters(q, filters);
      const { data: result, error } = await q.select().single();
      if (error) return err(toStorageError(error));
      if (!result) return err({ message: 'Update returned no row' });
      return ok(result as T);
    } catch (e) {
      return err(toStorageError(e));
    }
  },

  async delete(table: string, filters: QueryFilter[]): Promise<Result<void>> {
    try {
      let q = (supabase.from as any)(table).delete();
      q = applyFilters(q, filters);
      const { error } = await q;
      if (error) return err(toStorageError(error));
      return ok(undefined);
    } catch (e) {
      return err(toStorageError(e));
    }
  },
};

// ============ Auth Adapter ============

function mapSupabaseUser(u: any): AuthUser {
  return {
    id: u.id,
    email: u.email || '',
    fullName: u.user_metadata?.full_name,
    avatarUrl: u.user_metadata?.avatar_url,
    createdAt: u.created_at || new Date().toISOString(),
  };
}

function mapSupabaseSession(session: any): AuthSession {
  return {
    accessToken: session.access_token,
    refreshToken: session.refresh_token,
    expiresAt: session.expires_at,
    user: mapSupabaseUser(session.user),
  };
}

const supabaseAuth: AuthAdapter = {
  async getUser(): Promise<Result<AuthUser | null>> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) return err(toStorageError(error));
      return ok(user ? mapSupabaseUser(user) : null);
    } catch (e) {
      return err(toStorageError(e));
    }
  },

  async getSession(): Promise<Result<AuthSession | null>> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) return err(toStorageError(error));
      return ok(session ? mapSupabaseSession(session) : null);
    } catch (e) {
      return err(toStorageError(e));
    }
  },

  async signUp(params: SignUpParams): Promise<Result<void>> {
    try {
      const { error } = await supabase.auth.signUp({
        email: params.email,
        password: params.password,
        options: {
          emailRedirectTo: params.redirectUrl,
          data: { full_name: params.fullName },
        },
      });
      if (error) return err(toStorageError(error));
      return ok(undefined);
    } catch (e) {
      return err(toStorageError(e));
    }
  },

  async signIn(params: SignInParams): Promise<Result<void>> {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: params.email,
        password: params.password,
      });
      if (error) return err(toStorageError(error));
      return ok(undefined);
    } catch (e) {
      return err(toStorageError(e));
    }
  },

  async signOut(): Promise<Result<void>> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) return err(toStorageError(error));
      return ok(undefined);
    } catch (e) {
      return err(toStorageError(e));
    }
  },

  onAuthStateChange(callback: AuthStateChangeCallback) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session ? mapSupabaseSession(session) : null);
    });
    return () => subscription.unsubscribe();
  },
};

// ============ Export ============

export const supabaseAdapter: StorageAdapter = {
  data: supabaseData,
  auth: supabaseAuth,
};
