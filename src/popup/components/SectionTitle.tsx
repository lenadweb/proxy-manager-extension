import { FC } from 'react';
import { LucideIcon } from 'lucide-react';

type Props = {
    icon: LucideIcon;
    title: string;
    summary?: string;
};

const SectionTitle: FC<Props> = ({ icon: IconComponent, title, summary }) => (
    <span className="flex min-w-0 items-center gap-3 text-left">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-black-600 text-blue-light">
            <IconComponent aria-hidden className="size-4" />
        </span>
        <span className="min-w-0">
            <span className="block text-sm font-medium leading-snug text-white-100">
                {title}
            </span>
            {summary && (
                <span className="block truncate text-[12px] leading-snug text-black-400">
                    {summary}
                </span>
            )}
        </span>
    </span>
);

export default SectionTitle;
