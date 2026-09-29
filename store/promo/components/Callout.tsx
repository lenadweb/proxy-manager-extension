import { FC, ReactNode } from 'react';
import AuthSection from 'src/popup/components/ProxyForm/AuthSection';
import { createDraft } from 'src/popup/components/ProxyForm/draft';
import { JAPAN } from '../fixtures';
import { Callout as CalloutConfig, CalloutKind } from '../shots';
import PrivacyCard from './PrivacyCard';

const CALLOUT_LEFT = 596;
const CALLOUT_SCALE = 1.35;

const noop = () => undefined;

const CALLOUT_CONTENT: Record<CalloutKind, ReactNode> = {
    [CalloutKind.Credentials]: (
        <div className="w-[330px]">
            <AuthSection
                draft={createDraft(JAPAN)}
                isOpen
                onToggle={noop}
                onChange={noop}
            />
        </div>
    ),
    [CalloutKind.Privacy]: <PrivacyCard />,
};

type Props = {
    callout: CalloutConfig;
};

const Callout: FC<Props> = ({ callout }) => (
    <div
        className="absolute z-20 origin-left rounded-[30px] bg-background p-2 ring-1 ring-blue-accent/40 shadow-[0_16px_36px_rgba(0,0,0,0.42),0_4px_12px_rgba(0,0,0,0.3)]"
        style={{
            top: callout.top,
            left: CALLOUT_LEFT,
            transform: `scale(${CALLOUT_SCALE})`,
        }}
    >
        {CALLOUT_CONTENT[callout.kind]}
    </div>
);

export default Callout;
