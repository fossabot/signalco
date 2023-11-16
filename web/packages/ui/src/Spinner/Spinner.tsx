import { HTMLAttributes } from 'react';
import {cx} from 'classix';

export type SpinnerProps = HTMLAttributes<HTMLOrSVGElement> & {
    loading?: boolean;
    loadingLabel: string;
};

export function Spinner({ loading, loadingLabel, className, ...rest }: SpinnerProps) {
    if (!loading) return null;

    return (
        <svg
            className={cx('uitw-h-8 uitw-w-8 uitw-animate-spin uitw-text-primary', className)}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-label={loadingLabel}
            {...rest}>
            <circle className="uitw-opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="uitw-opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    );
}