const API_BASE = 'http://localhost:3000/api/v1';

function request<T>(url: string, method: 'GET' | 'POST' | 'DELETE', data?: unknown): Promise<T> {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${API_BASE}${url}`,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        'x-role': 'EMPLOYEE',
        'x-user-id': 'u-emp-001',
        'x-user-name': '演示员工',
        'x-department-id': 'dep-001',
        'x-department-name': '产品研发部'
      },
      success: (res) => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data as T);
        } else {
          reject(new Error(JSON.stringify(res.data)));
        }
      },
      fail: (err) => reject(err)
    });
  });
}

export const miniApi = {
  createPractice(topic: string) {
    return request<{ id: string; topic: string }>('/practices', 'POST', { topic });
  },
  generateOutline(practiceId: string, payload: { style: string; level?: string; backgroundTags?: string[] }) {
    return request<{ content: string }>(`/practices/${practiceId}/outline/generate`, 'POST', payload);
  },
  createRecordingPresign(
    practiceId: string,
    payload: { fileName: string; contentType: string; durationSec: number }
  ) {
    return request<{ recordingId: string; uploadUrl: string; objectKey: string }>(
      `/practices/${practiceId}/recordings/presign`,
      'POST',
      payload
    );
  },
  createAsrJob(practiceId: string, recordingId: string) {
    return request<{ id: string; status: string; text?: string }>(`/practices/${practiceId}/asr/jobs`, 'POST', {
      recordingId
    });
  },
  getAsrJob(practiceId: string, jobId: string) {
    return request<{ id: string; status: string; text?: string }>(`/practices/${practiceId}/asr/jobs/${jobId}`, 'GET');
  },
  polish(practiceId: string, sourceText: string) {
    return request<{ polishedText: string; sourceText: string; changes: any[] }>(
      `/practices/${practiceId}/polish`,
      'POST',
      { sourceText }
    );
  }
};
