import { FC } from 'react';
import cn from 'classnames';

type Props = {
    isConnected: boolean;
};

const ConnectionDot: FC<Props> = ({ isConnected }) => (
    <span aria-hidden className="relative flex size-1.5 shrink-0">
        {isConnected && (
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-blue-light opacity-75" />
        )}
        <span
            className={cn(
                'relative inline-flex size-1.5 rounded-full',
                isConnected ? 'bg-blue-light' : 'bg-black-500'
            )}
        />
    </span>
);

export default ConnectionDot;
