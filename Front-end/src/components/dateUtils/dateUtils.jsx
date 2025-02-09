// src/utils/dateUtils.js

export const formatDate = (lastLogin) => {
    if (!lastLogin) return "introuvable";

    const date = new Date(lastLogin);

    // Format the date part
    const optionsDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let formattedDate = date.toLocaleDateString('fr-FR', optionsDate);

    // Capitalize the first letter of the weekday
    formattedDate = formattedDate.replace(/^\w/, (match) => match.toUpperCase());

    // Format the time part
    const optionsTime = { hour: '2-digit', minute: '2-digit' };
    const formattedTime = date.toLocaleTimeString('fr-FR', optionsTime);

    // Combine date and time
    return `${formattedDate} - ${formattedTime}`;
};