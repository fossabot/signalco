import React, { CSSProperties, forwardRef } from 'react';
import type { SupportedColorScheme } from '@signalco/ui/theme';
import { cx } from '@signalco/ui/cx';
import ApiBadge from '../development/ApiBadge';
import { isDeveloper } from '../../src/services/EnvProvider';

interface SignalcoLogotypeProps {
    width?: number;
    height?: number;
    theme?: SupportedColorScheme;
    hideBadge?: boolean;
}

interface BadgeContainerCssProperties extends CSSProperties {
    '--fixedHeight': string;
}

function SignalcoLogotype({ width, height, theme, hideBadge }: SignalcoLogotypeProps, ref: React.Ref<HTMLDivElement>) {
    if (typeof width === 'undefined' &&
        typeof height === 'undefined') {
        throw new Error('Either height or width must be provided to SignalcoLogo.');
    }
    const paddingTop = height ? Math.ceil(height / 10.5) : Math.ceil((width ?? 0) / 40);
    const fixedHeight = height ?? (666 / 2810) * ((width ?? 0) + paddingTop * 4);
    const fixedWidth = width ?? (2810 / 666) * ((height ?? 0) - paddingTop);
    const badgeContainerStyle: BadgeContainerCssProperties = { '--fixedHeight': `${fixedHeight - paddingTop}px` };

    return (
        <div aria-label="Signalco" role="img" className={cx('flex relative gap-2', hideBadge && 'block')} ref={ref}>
            <svg version="1.0"
                xmlns="http://www.w3.org/2000/svg"
                width={fixedWidth}
                height={fixedHeight - paddingTop}
                viewBox="0 0 2810.000000 666.000000"
                preserveAspectRatio="xMidYMid meet">
                <g transform="translate(0.000000,666.000000) scale(0.100000,-0.100000)"
                    style={{ fill: theme === 'dark' ? '#ffffff' : '#000000' }}
                    stroke="none">
                    <path d="M4427 6389 c-94 -22 -182 -96 -225 -187 -36 -75 -38 -193 -5 -263 80 -175 285 -253 459 -174 73 33 129 87 166 162 27 55 32 76 32 141 1 65 -4 86 -27 134 -72 146 -240 225 -400 187z" />
                    <path d="M18900 3955 l0 -2445 235 0 235 0 0 2445 0 2445 -235 0 -235 0 0 -2445z" />
                    <path d="M25505 6320 c-413 -37 -785 -140 -1130 -313 -281 -140 -551 -329 -752 -524 -65 -63 -82 -87 -93 -125 -33 -122 46 -244 172 -264 63 -11 114 12 200 89 363 323 713 522 1117 633 845 233 1749 45 2417 -505 60 -49 127 -108 149 -131 56 -59 108 -84 175 -84 157 -1 257 171 177 305 -14 24 -70 83 -124 131 -485 430 -1061 694 -1693 773 -152 19 -478 27 -615 15z" />
                    <path d="M1790 4990 c-503 -61 -861 -278 -1015 -614 -58 -127 -70 -191 -69 -376 1 -189 17 -270 81 -400 67 -137 263 -307 439 -380 146 -61 433 -131 834 -205 395 -72 594 -138 727 -239 110 -83 153 -175 153 -327 0 -151 -44 -254 -152 -355 -99 -93 -234 -150 -438 -186 -120 -21 -547 -18 -685 5 -302 51 -583 157 -795 302 -46 31 -86 53 -91 48 -24 -24 -200 -347 -195 -358 10 -26 152 -117 287 -184 304 -151 632 -227 1030 -238 594 -17 1012 112 1283 397 93 99 160 213 196 340 28 96 38 298 20 406 -26 165 -76 268 -185 383 -198 208 -407 287 -1140 425 -455 86 -606 136 -740 244 -118 95 -165 194 -165 346 1 155 38 246 146 353 54 54 93 82 157 113 288 139 805 148 1199 20 107 -35 295 -123 363 -170 32 -22 50 -29 57 -22 11 11 198 352 198 362 0 8 -129 78 -216 117 -153 68 -428 145 -637 179 -119 19 -531 28 -647 14z" />
                    <path d="M7159 4985 c-380 -52 -716 -209 -971 -453 -270 -259 -435 -594 -478 -972 -18 -152 -8 -456 19 -593 133 -666 634 -1154 1319 -1287 628 -122 1254 63 1614 476 33 38 72 87 87 108 l26 40 3 -35 c2 -18 2 -180 -1 -359 -4 -300 -6 -334 -30 -440 -63 -291 -187 -497 -382 -635 -122 -87 -304 -158 -485 -190 -125 -23 -481 -31 -621 -16 -385 44 -747 179 -1006 375 l-111 84 -118 -176 -117 -176 49 -44 c182 -162 506 -317 844 -402 487 -124 1059 -118 1468 16 214 70 384 168 529 306 232 222 359 487 429 898 17 98 18 222 21 1788 l4 1682 -223 -2 -223 -3 -5 -323 -5 -324 -47 64 c-246 335 -623 542 -1088 598 -114 14 -383 11 -501 -5z m661 -428 c453 -108 784 -406 918 -827 45 -143 56 -226 56 -410 -1 -247 -44 -423 -149 -616 -180 -330 -477 -542 -872 -621 -125 -25 -452 -25 -578 0 -289 58 -502 171 -691 368 -162 170 -253 346 -306 592 -32 147 -32 427 0 574 54 249 145 424 310 595 187 194 426 314 727 364 55 9 143 12 280 10 170 -4 216 -8 305 -29z" />
                    <path d="M12055 4984 c-410 -56 -750 -243 -970 -536 l-75 -98 -2 312 -3 313 -222 3 -223 2 0 -1735 0 -1735 235 0 235 0 0 974 c0 1059 2 1107 56 1292 142 491 531 779 1084 801 373 15 646 -77 842 -286 87 -93 150 -198 194 -329 70 -205 67 -149 71 -1359 l4 -1093 234 0 235 0 0 1048 c0 1073 -3 1176 -41 1375 -110 585 -524 972 -1126 1052 -133 18 -394 18 -528 -1z" />
                    <path d="M15960 4989 c-294 -34 -622 -132 -840 -251 -74 -40 -219 -136 -273 -180 l-27 -23 101 -170 c56 -93 103 -171 105 -173 1 -2 39 24 84 58 147 108 267 171 454 236 215 75 389 104 617 104 455 0 743 -147 889 -452 69 -143 82 -213 87 -455 l5 -211 -678 -5 c-744 -4 -788 -7 -1021 -67 -202 -53 -362 -140 -484 -267 -108 -111 -170 -218 -215 -370 -35 -120 -44 -335 -19 -468 77 -412 406 -696 918 -792 131 -25 523 -25 654 0 204 38 407 118 554 218 87 58 201 169 260 253 l49 69 0 -266 0 -267 225 0 226 0 -3 1198 c-3 1111 -5 1204 -22 1292 -111 577 -473 903 -1095 985 -116 16 -429 18 -551 4z m1200 -2162 l0 -293 -39 -76 c-82 -160 -209 -312 -337 -404 -187 -134 -436 -204 -724 -204 -164 0 -301 20 -423 60 -127 43 -189 81 -278 169 -128 129 -176 262 -166 460 8 163 52 269 151 366 123 121 292 181 586 209 19 1 304 4 633 4 l597 2 0 -293z" />
                    <path d="M21855 4989 c-632 -84 -1098 -409 -1356 -943 -102 -211 -150 -394 -171 -650 -29 -348 38 -701 188 -996 85 -165 176 -291 304 -420 331 -330 769 -500 1289 -500 534 0 987 196 1255 544 80 105 100 136 89 146 -16 15 -319 219 -329 222 -6 2 -38 -31 -71 -72 -170 -214 -391 -343 -688 -402 -118 -24 -355 -28 -480 -9 -553 84 -937 446 -1057 996 -29 132 -36 432 -14 583 45 305 168 555 367 747 248 238 550 355 919 355 229 0 399 -39 592 -136 51 -25 123 -68 159 -95 74 -54 194 -176 235 -239 l27 -40 26 17 c231 155 321 217 321 223 0 17 -108 159 -173 227 -97 101 -218 190 -356 261 -171 88 -302 132 -492 168 -100 19 -477 28 -584 13z" />
                    <path d="M25467 4985 c-703 -96 -1251 -572 -1427 -1240 -39 -147 -48 -205 -60 -368 -30 -431 84 -859 317 -1187 87 -121 271 -306 393 -393 119 -84 321 -185 466 -231 321 -102 727 -114 1057 -31 663 167 1140 688 1258 1375 123 716 -154 1419 -706 1791 -223 151 -481 247 -761 284 -140 18 -401 18 -537 0z m563 -420 c292 -65 556 -228 719 -445 114 -152 199 -341 241 -535 34 -156 39 -450 11 -614 -48 -282 -161 -516 -338 -701 -98 -103 -183 -167 -304 -230 -199 -103 -372 -143 -619 -142 -376 0 -665 112 -905 349 -139 138 -244 308 -309 504 -56 166 -70 266 -71 489 0 221 15 325 70 496 148 454 522 769 1000 843 94 15 417 6 505 -14z" />
                    <path d="M4280 3245 l0 -1735 230 0 230 0 0 1735 0 1735 -230 0 -230 0 0 -1735z" />
                    <path d="M14641 3154 c0 -11 3 -14 6 -6 3 7 2 16 -1 19 -3 4 -6 -2 -5 -13z" />
                    <path d="M14598 3113 c7 -3 16 -2 19 1 4 3 -2 6 -13 5 -11 0 -14 -3 -6 -6z" />
                </g>
            </svg>
            {(!hideBadge && isDeveloper) && (
                <div className="absolute top-[calc(var(--fixedHeight)-24px-var(--fixedHeight)*0.18)]" style={badgeContainerStyle}>
                    <ApiBadge />
                </div>
            )}
        </div>
    )
}

export default forwardRef<HTMLDivElement, SignalcoLogotypeProps>(SignalcoLogotype);
