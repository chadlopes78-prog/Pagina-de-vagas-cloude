import type { ComponentChildren } from 'preact';
import { Icon } from './Icon';

interface ButtonProps {
  children: ComponentChildren;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  type?: 'button' | 'submit';
  disabled?: boolean;
  /** Mostra seta à direita (CTA de avanço). */
  arrow?: boolean;
  size?: 'md' | 'lg';
  pulse?: boolean;
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  type = 'button',
  disabled = false,
  arrow = false,
  size = 'md',
  pulse = false,
}: ButtonProps) {
  const classes = ['btn', `btn--${variant}`, size === 'lg' && 'btn--lg', pulse && 'btn--pulse']
    .filter(Boolean)
    .join(' ');
  return (
    <button type={type} class={classes} onClick={onClick} disabled={disabled}>
      <span>{children}</span>
      {arrow && <Icon name="arrowRight" size={20} class="btn__icon" />}
    </button>
  );
}
