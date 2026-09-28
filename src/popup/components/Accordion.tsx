import { FC, ReactNode, useId } from 'react';
import cn from 'classnames';
import { ChevronDown, LucideIcon } from 'lucide-react';
import SectionTitle from 'src/popup/components/SectionTitle';

type Props = {
    icon: LucideIcon;
    title: string;
    summary?: string;
    isOpen: boolean;
    onToggle: () => void;
    children: ReactNode;
};

const Accordion: FC<Props> = ({
    icon,
    title,
    summary,
    isOpen,
    onToggle,
    children,
}) => {
    const panelId = useId();

    return (
        <div className="rounded-3xl bg-black-700">
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="group flex w-full cursor-pointer items-center justify-between gap-3 rounded-3xl p-4 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white/60"
            >
                <SectionTitle
                    icon={icon}
                    title={title}
                    summary={isOpen ? undefined : summary}
                />
                <ChevronDown
                    aria-hidden
                    className={cn(
                        'size-4 shrink-0 text-black-400 transition group-hover:text-white',
                        isOpen && 'rotate-180'
                    )}
                />
            </button>
            <div
                id={panelId}
                inert={!isOpen}
                className={cn(
                    'grid transition-all duration-200 ease-out',
                    isOpen
                        ? 'grid-rows-[1fr] opacity-100'
                        : 'grid-rows-[0fr] opacity-0'
                )}
            >
                <div className="overflow-hidden">
                    <div className="space-y-4 px-4 pb-4">{children}</div>
                </div>
            </div>
        </div>
    );
};

export default Accordion;
