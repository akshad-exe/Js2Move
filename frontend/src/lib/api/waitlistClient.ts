import axios from 'axios';

const WAITLIST_URL = 'https://waitflow.onrender.com/v1/projects/69577e897a54b2bb54a37da4/public/waitlist';

export async function submitWaitlist(email: string): Promise<any> {
  try {
    const payload = { email };
    const res = await axios.post(WAITLIST_URL, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000,
    });

    // Accept 2xx responses as success
    if (res.status >= 200 && res.status < 300) {
      return res.data;
    }

    throw new Error('Unexpected response from waitlist service');
  } catch (err: any) {
    // Treat "already submitted" responses (400) as a soft-success so the UI can show a helpful state
    const status = err?.response?.status;
    const serverMessage = err?.response?.data?.message;

    if (status === 400 && typeof serverMessage === 'string' && /already/i.test(serverMessage)) {
      return { alreadySubmitted: true, data: err.response.data };
    }

    // Normalize error message and rethrow for other cases
    const message = serverMessage || err?.message || 'Failed to submit to waitlist';
    const e = new Error(message);
    (e as any).original = err;
    throw e;
  }
}
