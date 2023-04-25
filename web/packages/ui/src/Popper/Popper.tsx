import { bindPopover, PopupState } from 'material-ui-popup-state/hooks';
import { Popper as PopperUnstyled, ClickAwayListener } from "@mui/base";
import { ChildrenProps } from '../sharedTypes';

/** @alpha */
export interface PopperProps extends ChildrenProps {
    popupState: PopupState;
}

/** @alpha */
export default function Popper(props: PopperProps) {
    const { popupState, children } = props;
    const { anchorReference, anchorPosition, ...popoverProps } = bindPopover(popupState);

    return (
        <ClickAwayListener onClickAway={(e) => {
            if (e.target !== popupState.anchorEl) {
                popupState.close();
            }
        }}>
            <PopperUnstyled style={{ zIndex: 999999 }} {...popoverProps}>
                {children}
            </PopperUnstyled>
        </ClickAwayListener>
    );
}
