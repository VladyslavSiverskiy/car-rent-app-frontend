export function calculatePayment (dayPrice, hours) {
    let paymentPerHour = dayPrice / 24;
    return paymentPerHour * hours + 1;
}