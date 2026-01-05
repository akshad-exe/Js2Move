import { compileCode } from '@/lib/api/compilerClient';
import toast from 'react-hot-toast';

export async function compileMoveJS(source: string): Promise<{
    success: boolean;
    output: string;
    logs: string[];
}> {
    try {
        const result = await compileCode(source);

        if (result.success) {
            toast.success('Compilation successful!');
            return {
                success: true,
                output: result.code,
                logs: result.warnings,
            };
        } else {
            const errorMsg = result.warnings[0] || 'Compilation produced empty output';
            toast.error(errorMsg);
            return {
                success: false,
                output: '',
                logs: result.warnings,
            };
        }
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Compilation error occurred';
        toast.error('Compilation failed. Please try again.');
        return {
            success: false,
            output: '',
            logs: [errorMsg],
        };
    }
}