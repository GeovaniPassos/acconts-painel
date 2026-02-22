export function togglePaymenetStatus(currentState) {
    const isPaid = currentState === "true";
    return {
        isPaid: !isPaid
    };
}