import { FC, ReactNode, useId } from 'react';
import cn from 'classnames';
import ChevronDownIcon from 'src/assets/icons/chevron-down.svg?react';

type Props = {
    title: string;
    isOpen: boolean;
    onToggle: () => void;
    children: ReactNode;
};

const Accordion: FC<Props> = ({ title, isOpen, onToggle, children }) => {
    const panelId = useId();

    return (
        <div className="rounded-3xl bg-black-700 text-white-100">
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="group flex w-full cursor-pointer items-center justify-between gap-2 rounded-3xl p-5 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white"
            >
                <span className="text-base leading-[1.2]">{title}</span>
                <ChevronDownIcon
                    className={cn(
                        'w-5 transition group-hover:opacity-100',
                        isOpen ? '-rotate-180' : '-rotate-90 opacity-65'
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
                    <div className="space-y-4 px-5 pb-5">{children}</div>
                </div>
            </div>
        </div>
    );
};

export default Accordion;
