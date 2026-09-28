import { FC } from 'react';
import { CircleAlert, LucideIcon, ShieldAlert, X } from 'lucide-react';
import { t } from 'src/shared/i18n';
import { ProxyControl, ProxyState } from 'src/shared/types';
import { dismissError } from 'src/popup/actions';
import IconButton from 'src/popup/components/IconButton';
import { TooltipAlign } from 'src/popup/components/Tooltip';
import { getNotice, NoticeKind } from './getNotice';

type Props = {
    state: ProxyState;
    control: ProxyControl | null;
};

const NOTICE_ICONS: Record<NoticeKind, LucideIcon> = {
    [NoticeKind.SettingsLocked]: ShieldAlert,
    [NoticeKind.ProxyError]: CircleAlert,
};

const Notice: FC<Props> = ({ state, control }) => {
    const notice = getNotice(state, control);
    if (!notice) return null;

    const NoticeIcon = NOTICE_ICONS[notice.kind];
    const isDismissible = notice.kind === NoticeKind.ProxyError;

    return (
        <div
            role="alert"
            className="mb-5 flex items-start gap-3 rounded-2xl bg-black-700 p-3.5"
        >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-danger/15 text-danger">
                <NoticeIcon aria-hidden className="size-4" />
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-[13px] leading-snug text-white-100">
                    {notice.message}
                </p>
                {notice.detail && (
                    <p className="mt-0.5 break-all text-[11px] text-black-400">
                        {notice.detail}
                    </p>
                )}
            </div>
            {isDismissible && (
                <IconButton
                    icon={X}
                    label={t('dismiss')}
                    tooltipAlign={TooltipAlign.End}
                    onClick={() => {
                        dismissError().catch(console.error);
                    }}
                />
            )}
        </div>
    );
};

export default Notice;
