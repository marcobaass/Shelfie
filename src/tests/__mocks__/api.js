// Pfad: src/tests/__mocks__/api.ts
import { vi } from "vitest";
export const mockFetchBooks = vi.fn(() => {
    return Promise.resolve({
        docs: [
            { id: '1', title: 'React Basics', author: 'John Doe' },
            { id: '2', title: 'Advanced React', author: 'Jane Smith' },
        ],
    });
});
