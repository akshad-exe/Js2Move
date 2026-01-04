import toast from 'react-hot-toast';

export interface CompileResult {
  success: boolean;
  output?: string;
  error?: string;
}

export async function compileCode(code: string): Promise<CompileResult> {
  try {
    // TODO: Replace with actual MoveJS compiler API
    const response = await fetch('http://localhost:5000/api/compile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return {
        success: true,
        output: data.output,
      };
    } else {
      const errorMsg = data.error || 'Compilation failed';
      toast.error(errorMsg);
      return {
        success: false,
        error: errorMsg,
      };
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Network error. Please check your connection.';
    toast.error(errorMsg);
    return {
      success: false,
      error: errorMsg,
    };
  }
}