// This is a test file to verify Active Repo's AI documentation capabilities.
// It calculates the fibonacci sequence.

export const fibonacci = (n: number): number => {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
};

console.log("Fibonacci(10):", fibonacci(10));
