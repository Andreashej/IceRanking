export interface ResourceContext<T> {
    resource?: T;
    update: (updatedFields: Partial<T>) => void;
    save: () => Promise<void>;
    loading: boolean;
    error?: string;
    isChanged: boolean;
}