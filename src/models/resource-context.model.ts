export interface ResourceContext<T> {
    resource?: T;
    update: (updatedFields: Partial<T>) => void;
    save: (updatedFields?: Partial<T>) => Promise<void>;
    loading: boolean;
    error?: string;
}