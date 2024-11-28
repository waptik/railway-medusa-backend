/**
 * @see https://github.com/rpuls/medusajs-2.0-for-railway-boilerplate/blob/master/backend/src/utils/assert-value.ts
 * Assert that a value is not undefined. If it is, throw an error with the provided message.
 * @param v - Value to assert
 * @param errorMessage - Error message to throw if value is undefined
 */
export function assertValue<T extends string | undefined>(
    v: T | undefined,
    errorMessage: string,
): T {
    if (v === undefined) {
        throw new Error(errorMessage);
    }

    return v;
}
