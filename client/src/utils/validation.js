export function validateControl(control, value) {
    if (!value) return false;
    switch (control){
        case 'email': return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value);
        case 'password': return value.length >= 5;
        default: return false
    }
}
export function isDisabled(email, password) {
    return email.isValid && password.isValid
}

export function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}