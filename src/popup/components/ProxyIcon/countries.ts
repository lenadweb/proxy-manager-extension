import { countries } from 'country-flag-icons';

export type Country = {
    code: string;
    name: string;
};

const FLAG_PATH_CODE = /\/([A-Z0-9-]+)\.svg$/;

const flagModules = import.meta.glob<string>(
    '../../../../node_modules/country-flag-icons/3x2/*.svg',
    { query: '?url', import: 'default', eager: true }
);

const FLAG_URLS = new Map(
    Object.entries(flagModules).map(([path, url]) => [
        path.match(FLAG_PATH_CODE)?.[1] ?? path,
        url,
    ])
);

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });

export const getCountryName = (code: string): string => {
    try {
        return regionNames.of(code) ?? code;
    } catch {
        return code;
    }
};

export const COUNTRIES: Country[] = countries
    .map((code) => ({ code, name: getCountryName(code) }))
    .sort((first, second) => first.name.localeCompare(second.name));

export const getFlagUrl = (code: string): string | null =>
    FLAG_URLS.get(code.toUpperCase()) ?? null;

enum MatchRank {
    Code = 0,
    NameStart = 1,
    NamePart = 2,
    None = 3,
}

const getMatchRank = ({ code, name }: Country, query: string): MatchRank => {
    const lowerName = name.toLowerCase();

    if (code.toLowerCase() === query) return MatchRank.Code;
    if (lowerName.startsWith(query)) return MatchRank.NameStart;
    if (lowerName.includes(query)) return MatchRank.NamePart;
    return MatchRank.None;
};

export const searchCountries = (query: string): Country[] => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return COUNTRIES;

    return COUNTRIES.map((country) => ({
        country,
        rank: getMatchRank(country, normalizedQuery),
    }))
        .filter(({ rank }) => rank !== MatchRank.None)
        .sort((first, second) => first.rank - second.rank)
        .map(({ country }) => country);
};
