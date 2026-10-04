import * as React from "react";

/*
 * Icons exported from the Figma frame that have no exact Lucide match.
 * Paths are unchanged from the Figma export; strokes use currentColor so the
 * nav/active styles can color them.
 */

type IconProps = React.SVGProps<SVGSVGElement>;

export function ThreadlineLogo(props: IconProps) {
  const id = React.useId();
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden {...props}>
      <path
        d="M0 8C0 3.58172 3.58172 0 8 0H20C24.4183 0 28 3.58172 28 8V28H8C3.58172 28 0 24.4183 0 20V8Z"
        fill={`url(#${id})`}
      />
      <path
        d="M6 6C6 6 10.7797 9.5 14 9.5C17.2203 9.5 22 6 22 6C22 6 17.5 10.7268 17.5 14C17.5 17.2732 22 22 22 22C22 22 17.2203 18.5 14 18.5C10.7797 18.5 6 22 6 22C6 22 11 17.3366 11 14C11 10.6634 6 6 6 6Z"
        fill="white"
      />
      <defs>
        <radialGradient
          id={id}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(14 14) rotate(45) scale(19.799)"
        >
          <stop stopColor="#D8E6FF" />
          <stop offset="1" stopColor="#0058FE" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export function AtIcon(props: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden {...props}>
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 10.5C9.38071 10.5 10.5 9.38071 10.5 8C10.5 6.61929 9.38071 5.5 8 5.5C6.61929 5.5 5.5 6.61929 5.5 8C5.5 9.38071 6.61929 10.5 8 10.5Z" />
        <path d="M11.5 13C10.5494 13.6319 9.22688 14 8 14C6.81331 14 5.65328 13.6481 4.66658 12.9888C3.67989 12.3295 2.91085 11.3925 2.45673 10.2961C2.0026 9.19975 1.88378 7.99335 2.11529 6.82946C2.3468 5.66558 2.91825 4.59648 3.75736 3.75736C4.59648 2.91825 5.66558 2.3468 6.82946 2.11529C7.99335 1.88378 9.19975 2.0026 10.2961 2.45673C11.3925 2.91085 12.3295 3.67989 12.9888 4.66658C13.6481 5.65328 14 6.81331 14 8C14 9.38063 13.5 10.5 12.25 10.5C11 10.5 10.5 9.38063 10.5 8V5.5" />
      </g>
    </svg>
  );
}

export function PlugsIcon(props: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden {...props}>
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 9L7.5 10.5" />
        <path d="M7 7L5.5 8.5" />
        <path d="M4 7L9 12" />
        <path d="M3.62875 12.3711L1.5 14.4998" />
        <path d="M8.25087 11.25L6.43837 13.0625C6.15707 13.3438 5.77555 13.5018 5.37774 13.5018C4.97994 13.5018 4.59842 13.3438 4.31712 13.0625L2.93837 11.6819C2.65766 11.4007 2.5 11.0195 2.5 10.6222C2.5 10.2248 2.65766 9.84373 2.93837 9.5625L4.75087 7.75" />
        <path d="M7 4L12 9" />
        <path d="M12.3711 3.62875L14.4998 1.5" />
        <path d="M11.25 8.24989L13.0625 6.43739C13.3438 6.15609 13.5018 5.77457 13.5018 5.37677C13.5018 4.97896 13.3438 4.59744 13.0625 4.31614L11.6819 2.93739C11.4007 2.65668 11.0195 2.49902 10.6222 2.49902C10.2248 2.49902 9.84373 2.65668 9.5625 2.93739L7.75 4.74989" />
      </g>
    </svg>
  );
}

/** Four-point sparkle used for every AI affordance. Scales from the 14px Figma source. */
export function SparkleIcon({ width = 14, height = 14, ...props }: IconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 14 14" fill="none" aria-hidden {...props}>
      <path
        d="M6.62654 1.29963C6.52181 1.38661 6.4508 1.50748 6.4258 1.64131L5.81267 4.88374C5.76912 5.11426 5.65709 5.3263 5.49121 5.49218C5.32532 5.65807 5.11328 5.7701 4.88276 5.81364L1.64033 6.42678C1.50651 6.45177 1.38564 6.52279 1.29866 6.62752C1.21168 6.73225 1.16406 6.8641 1.16406 7.00024C1.16406 7.13638 1.21168 7.26823 1.29866 7.37296C1.38564 7.47769 1.50651 7.54871 1.64033 7.5737L4.88276 8.18684C5.11328 8.23038 5.32532 8.34241 5.49121 8.5083C5.65709 8.67418 5.76912 8.88622 5.81267 9.11674L6.4258 12.3592C6.4508 12.493 6.52181 12.6139 6.62654 12.7008C6.73127 12.7878 6.86312 12.8354 6.99926 12.8354C7.1354 12.8354 7.26726 12.7878 7.37199 12.7008C7.47672 12.6139 7.54773 12.493 7.57273 12.3592L8.18586 9.11674C8.22941 8.88622 8.34143 8.67418 8.50732 8.5083C8.6732 8.34241 8.88525 8.23038 9.11577 8.18684L12.3582 7.5737C12.492 7.54871 12.6129 7.47769 12.6999 7.37296C12.7868 7.26823 12.8345 7.13638 12.8345 7.00024C12.8345 6.8641 12.7868 6.73225 12.6999 6.62752C12.6129 6.52279 12.492 6.45177 12.3582 6.42678L9.11577 5.81364C8.88525 5.7701 8.6732 5.65807 8.50732 5.49218C8.34143 5.3263 8.22941 5.11426 8.18586 4.88374L7.57273 1.64131C7.54773 1.50748 7.47672 1.38661 7.37199 1.29963C7.26726 1.21265 7.1354 1.16504 6.99926 1.16504C6.86312 1.16504 6.73127 1.21265 6.62654 1.29963Z"
        stroke="currentColor"
        strokeWidth={1.5 * (14 / Number(width))}
        strokeLinecap="round"
      />
    </svg>
  );
}
