import { FC, useState } from 'react';
import cn from 'classnames';
import { Check, Search } from 'lucide-react';
import { t } from 'src/shared/i18n';
import { ProxyIcon, ProxyIconKind } from 'src/shared/types';
import CountryFlag from 'src/popup/components/ProxyIcon/CountryFlag';
import { searchCountries } from 'src/popup/components/ProxyIcon/countries';

type Props = {
    selected: ProxyIcon | null;
    onSelect: (icon: ProxyIcon) => void;
};

const CountryList: FC<Props> = ({ selected, onSelect }) => {
    const [query, setQuery] = useState('');
    const matches = searchCountries(query);
    const selectedCode =
        selected?.kind === ProxyIconKind.Country ? selected.code : null;

    return (
        <div className="space-y-2">
            <div className="group/search relative">
                <Search
                    aria-hidden
                    className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-black-500 transition-colors group-focus-within/search:text-blue-light"
                />
                <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={t('search_country')}
                    aria-label={t('search_country')}
                    spellCheck={false}
                    className="block h-10 w-full rounded-xl border border-black-600 bg-black-700 pr-3 pl-9 text-sm text-white caret-blue-light transition-colors placeholder:text-black-500 hover:border-black-500 focus:border-blue-accent focus:outline-none"
                />
            </div>
            <ul className="scrollbar-thin -mx-1 max-h-52 overflow-y-auto px-1">
                {matches.map(({ code, name }) => {
                    const isSelected = code === selectedCode;

                    return (
                        <li key={code}>
                            <button
                                type="button"
                                aria-pressed={isSelected}
                                onClick={() =>
                                    onSelect({
                                        kind: ProxyIconKind.Country,
                                        code,
                                    })
                                }
                                className={cn(
                                    'flex w-full cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white',
                                    isSelected
                                        ? 'bg-blue-accent/15'
                                        : 'hover:bg-black-700'
                                )}
                            >
                                <CountryFlag
                                    code={code}
                                    className="h-3.5 w-5"
                                />
                                <span className="min-w-0 flex-1 truncate text-[13px] text-white-100">
                                    {name}
                                </span>
                                {isSelected ? (
                                    <Check
                                        aria-hidden
                                        className="size-4 text-blue-light"
                                    />
                                ) : (
                                    <span className="text-[11px] text-black-500">
                                        {code}
                                    </span>
                                )}
                            </button>
                        </li>
                    );
                })}
                {matches.length === 0 && (
                    <li className="px-2.5 py-4 text-center text-[12px] text-black-400">
                        {t('no_countries_found')}
                    </li>
                )}
            </ul>
        </div>
    );
};

export default CountryList;
