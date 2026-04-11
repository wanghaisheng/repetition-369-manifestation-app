/**
 * Supabase StorageAdapter 实现
 */
import { supabase } from '@/integrations/supabase/client';
import type {
  StorageAdapter,
  DataAdapter,
  AuthAdapter,
  QueryOptions,
  QueryFilter,
  QueryResult,
  SingleResult,
  MutationResult,
  AuthUser,
  AuthSession,
  SignUpParams,
  SignInParams,
  AuthStateChangeCallback,
} from './types';

// ============ Helper ============

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

function toStorageError(error: any) {
  if (!error) return null;
  return { message: error.message || String(error), code: error.code, details: error.details };
}

// ============ Data Adapter ============

const supabaseData: DataAdapter = {
  async query<T>(table: string, options?: QueryOptions): Promise<QueryResult<T>> {
    try {
      let q = supabase.from(table).select(options?.select || '*');
      q = applyFilters(q, options?.filters);
      if (options?.order) {
        for (const o of options.order) {
          q = q.order(o.column, { ascending: o.ascending ?? true });
        }
      }
      if (options?.limit) q = q.limit(options.limit);
      if (options?.offset) q = q.range(options.offset, options.offset + (options.limit || 100) - 1);

      const { data, error } = await q;
      return { data: (data as T[] | null), error: toStorageError(error) };
    } catch (e) {
      return { data: null, error: toStorageError(e) };
    }
  },

  async queryOne<T>(table: string, options?: QueryOptions): Promise<SingleResult<T>> {
    try {
      let q = supabase.from(table).select(options?.select || '*');
      q = applyFilters(q, options?.filters);
      const { data, error } = await q.maybeSingle();
      return { data: data as T | null, error: toStorageError(error) };
    } catch (e) {
      return { data: null, error: toStorageError(e) };
    }
  },

  async insert<T>(table: string, data: Record<string, unknown>): Promise<SingleResult<T>> {
    try {
      const { data: result, error } = await supabase.from(table).insert(data).select().single();
      return { data: result as T | null, error: toStorageError(error) };
    } catch (e) {
      return { data: null, error: toStorageError(e) };
    }
  },

  async update<T>(table: string, data: Record<string, unknown>, filters: QueryFilter[]): Promise<SingleResult<T>> {
    try {
      let q = supabase.from(table).update(data);
      q = applyFilters(q, filters);
      const { data: result, error } = await q.select().single();
      return { data: result as T | null, error: toStorageError(error) };
    } catch (e) {
      return { data: null, error: toStorageError(e) };
    }
  },

  async delete(table: string, filters: QueryFilter[]): Promise<MutationResult> {
    try {
      let q = supabase.from(table).delete();
      q = applyFilters(q, filters);
      const { error } = await q;
      return { data: null, error: toStorageError(error) };
    } catch (e) {
      return { data: null, error: toStorageError(e) };
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

const supabaseAuth: AuthAdapter = {
  async getUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) return { data: null, error: toStorageError(error) };
      return { data: mapSupabaseUser(user), error: null };
    } catch (e) {
      return { data: null, error: toStorageError(e) };
    }
  },

  async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) return { data: null, error: toStorageError(error) };
      return {
        data: {
          accessToken: session.access_token,
          refreshToken: session.refresh_token,
          expiresAt: session.expires_at,
          user: mapSupabaseUser(session.user),
        },
        error: null,
      };
    } catch (e) {
      return { data: null, error: toStorageError(e) };
    }
  },

  async signUp(params: SignUpParams) {
    try {
      const { error } = await supabase.auth.signUp({
        email: params.email,
        password: params.password,
        options: {
          emailRedirectTo: params.redirectUrl,
          data: { full_name: params.fullName },
        },
      });
      return { data: null, error: toStorageError(error) };
    } catch (e) {
      return { data: null, error: toStorageError(e) };
    }
  },

  async signIn(params: SignInParams) {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: params.email,
        password: params.password,
      });
      return { data: null, error: toStorageError(error) };
    } catch (e) {
      return { data: null, error: toStorageError(e) };
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      return { data: null, error: toStorageError(error) };
    } catch (e) {
      return { data: null, error: toStorageError(e) };
    }
  },

  onAuthStateChange(callback: AuthStateChangeCallback) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const mappedSession: AuthSession | null = session
        ? {
            accessToken: session.access_token,
            refreshToken: session.refresh_token,
            expiresAt: session.expires_at,
            user: mapSupabaseUser(session.user),
          }
        : null;
      callback(event, mappedSession);
    });
    return () => subscription.unsubscribe();
  },
};

// ============ Export ============

export const supabaseAdapter: StorageAdapter = {
  data: supabaseData,
  auth: supabaseAuth,
};
