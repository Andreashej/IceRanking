export const cancellablePromise = <T,>(promise: Promise<T>) => {
    const isCancelled = { value: false };
    const wrappedPromise = new Promise<T>((res, rej) => {
        promise
            .then(d => {
                if (!isCancelled.value) return res(d);
            })
            .catch(e => {
                // rej(isCancelled.value ? isCancelled : e);
            });
    });

    return {
        promise: wrappedPromise,
        cancel: () => {
            isCancelled.value = true;
        }
    };
};