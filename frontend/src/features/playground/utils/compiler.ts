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
      return {
        success: false,
        error: data.error || 'Compilation failed',
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'Network error. Please check your connection.',
    };
  }
}