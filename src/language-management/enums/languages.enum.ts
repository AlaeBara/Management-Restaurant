export enum Languages {
    FR = "fr",
    EN = "en",
    AR = "ar",
}

export const LanguageOptions = [
    { label: "Français", value: Languages.FR },
    { label: "English", value: Languages.EN },
    { label: "العربية", value: Languages.AR },
];

export const getLanguageLabel = (language: Languages) => {
    return LanguageOptions.find(option => option.value === language)?.label;
}

export const getLanguageValue = (label: string) => {
    return LanguageOptions.find(option => option.label === label)?.value;
}
