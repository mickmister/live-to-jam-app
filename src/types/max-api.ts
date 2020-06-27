type MaxAPI = {
    post: (message: string) => void;
    addHandler<T>(message: string, handler: (arg: T, arg2: T) => void): void;
    outlet<T>(value: T, value2: T): void;
    // outlet<T>(name: Outlets, value: T): void;
};
