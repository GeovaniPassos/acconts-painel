export function togglePaymentStatus(currentState) {
    const isPaid = currentState === "true";
    return {
        isPaid: !isPaid
    };
}