const API_PREFIX = '/api/v1';

const roleStorageKey = 'admin-role';

export function getRole(): 'MANAGER' | 'ADMIN' {
  const role = localStorage.getItem(roleStorageKey);
  return role === 'ADMIN' ? 'ADMIN' : 'MANAGER';
}

export function setRole(role: 'MANAGER' | 'ADMIN') {
  localStorage.setItem(roleStorageKey, role);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const role = getRole();
  const res = await fetch(`${API_PREFIX}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-role': role,
      'x-user-id': role === 'ADMIN' ? 'u-admin-001' : 'u-mgr-001',
      'x-user-name': role === 'ADMIN' ? '系统管理员' : '演示主管',
      ...(options.headers || {})
    }
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `Request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export const api = {
  dashboard(params: { departmentId?: string; employeeName?: string }) {
    const query = new URLSearchParams();
    if (params.departmentId) {
      query.set('departmentId', params.departmentId);
    }
    if (params.employeeName) {
      query.set('employeeName', params.employeeName);
    }
    return request(`/manager/dashboard?${query.toString()}`);
  },
  records(params: { departmentId?: string; employeeName?: string }) {
    const query = new URLSearchParams();
    if (params.departmentId) {
      query.set('departmentId', params.departmentId);
    }
    if (params.employeeName) {
      query.set('employeeName', params.employeeName);
    }
    return request(`/manager/records?${query.toString()}`);
  },
  recordDetail(id: string) {
    return request(`/manager/records/${id}`);
  },
  prompts(module?: string) {
    const query = module ? `?module=${module}` : '';
    return request(`/admin/prompts${query}`);
  },
  createPrompt(payload: { module: string; content: string; publish?: boolean }) {
    return request('/admin/prompts', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },
  publishPrompt(id: string) {
    return request(`/admin/prompts/${id}/publish`, { method: 'POST' });
  },
  rollbackPrompt(payload: { module: string; version: number }) {
    return request('/admin/prompts/rollback', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }
};
