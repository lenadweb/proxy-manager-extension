import { FC, useId } from 'react';
import { PROXY_SCHEMES } from 'src/shared/constants';
import { t } from 'src/shared/i18n';
import { ProxyScheme } from 'src/shared/types';

type Props = {
    value: ProxyScheme;
    onChange: (scheme: ProxyScheme) => void;
};

const SchemeSelector: FC<Props> = ({ value, onChange }) => {
    const groupName = useId();

    return (
        <fieldset>
            <legend className="mb-1.5 text-[12px] font-medium text-black-200">
                {t('field_protocol')}
            </legend>
            <div className="grid grid-cols-4 gap-1 rounded-2xl bg-background p-1">
                {PROXY_SCHEMES.map((scheme) => (
                    <label key={scheme} className="relative cursor-pointer">
                        <input
                            type="radio"
                            name={groupName}
                            value={scheme}
                            checked={value === scheme}
                            onChange={() => onChange(scheme)}
                            className="peer sr-only"
                        />
                        <span className="flex h-8 items-center justify-center rounded-xl text-[12px] font-medium uppercase text-black-200 transition-colors hover:bg-black-600 peer-checked:bg-blue-accent peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-white">
                            {scheme}
                        </span>
                    </label>
                ))}
            </div>
        </fieldset>
    );
};

export default SchemeSelector;
