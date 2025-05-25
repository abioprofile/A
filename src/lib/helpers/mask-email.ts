export const maskEmail = (email: string) => {
    const [local, domain] = email.split("@");
    if (!local || !domain) return email;
    const visibleStart = local.slice(0, 2);
    const visibleEnd = local.slice(-2);
    const maskedMiddle = "*".repeat(Math.max(local.length - 4, 0));
    return `${visibleStart}${maskedMiddle}${visibleEnd}@${domain}`;
};