import { FC } from 'react';
import { Route } from 'lucide-react';
import { t } from 'src/shared/i18n';
import { parseBypassList } from 'src/shared/proxy';
import Accordion from 'src/popup/components/Accordion';

type Props = {
    value: string;
    isOpen: boolean;
    onToggle: () => void;
    onChange: (value: string) => void;
};

const BypassSection: FC<Props> = ({ value, isOpen, onToggle, onChange }) => {
    const ruleCount = parseBypassList(value).length;

    return (
        <Accordion
            icon={Route}
            title={t('bypass_section')}
            summary={t('bypass_summary', [String(ruleCount)])}
            isOpen={isOpen}
            onToggle={onToggle}
        >
            <textarea
                aria-label={t('bypass_section')}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                rows={4}
                spellCheck={false}
                className="block w-full resize-y rounded-xl border border-black-600 bg-background p-3.5 text-sm leading-relaxed text-white caret-blue-light transition-colors hover:border-black-500 focus:border-blue-accent focus:outline-none"
            />
            <p className="text-[11px] leading-relaxed text-black-400">
                {t('bypass_hint')}
            </p>
        </Accordion>
    );
};

export default BypassSection;
