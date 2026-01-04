import { apiClient } from '@/lib/api/axiosClient';
import toast from 'react-hot-toast';

export async function compileMoveJS(source: string): Promise<{
    success: boolean;
    output: string;
    logs: string[];
}> {
    try {
        const response = await apiClient.post('/compiler/compile', {
            source,
        });

        if (response.data.success) {
            toast.success('Compilation successful!');
        }

        return {
            success: response.data.success,
            output: response.data.output || '',
            logs: response.data.logs || [],
        };
    } catch (error) {
        toast.error('Compilation failed. Please try again.');
        return {
            success: false,
            output: '',
            logs: ['Compilation error occurred'],
        };
    }
}
