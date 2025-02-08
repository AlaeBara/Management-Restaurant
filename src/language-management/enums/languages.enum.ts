export enum Languages {
    EN = "en",
    AR = "ar",
}

export const LanguageOptions = [
    { label: "English", value: Languages.EN },
    { label: "العربية", value: Languages.AR },
];

export const getLanguageLabel = (language: Languages) => {
    return LanguageOptions.find(option => option.value === language)?.label;
}

export const getLanguageValue = (label: string) => {
    return LanguageOptions.find(option => option.label === label)?.value;
}
