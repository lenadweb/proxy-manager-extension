import { FC } from 'react';
import { Check, ShieldCheck } from 'lucide-react';
import SectionTitle from 'src/popup/components/SectionTitle';
import { PRIVACY_CARD } from '../copy';

const PrivacyCard: FC = () => (
    <div className="w-[330px] space-y-3 rounded-3xl bg-black-700 p-4">
        <SectionTitle
            icon={ShieldCheck}
            title={PRIVACY_CARD.title}
            summary={PRIVACY_CARD.summary}
        />
        <ul className="m-0 list-none space-y-2 p-0">
            {PRIVACY_CARD.points.map(({ icon: PointIcon, label }) => (
                <li
                    key={label}
                    className="flex items-center gap-3 rounded-xl bg-background px-3 py-2.5 text-[13px] text-white-100"
                >
                    <PointIcon
                        aria-hidden
                        className="size-4 shrink-0 text-blue-light"
                    />
                    <span className="flex-1">{label}</span>
                    <Check aria-hidden className="size-4 text-blue-light" />
                </li>
            ))}
        </ul>
    </div>
);

export default PrivacyCard;
