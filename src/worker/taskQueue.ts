let queue: Promise<unknown> = Promise.resolve();

export const runExclusive = <T>(task: () => Promise<T>): Promise<T> => {
    const result = queue.then(task);
    queue = result.catch(() => undefined);
    return result;
};
