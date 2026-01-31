export interface CreateReadingInput {
    value: number;
    notes?: string;
    taskId: string;
}
export interface UpdateReadingStatusInput {
    status: 'APPROVED' | 'REJECTED';
    comment?: string;
}
export interface AddReadingCommentInput {
    comment: string;
}
//# sourceMappingURL=reading.types.d.ts.map