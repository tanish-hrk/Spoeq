import clsx from 'clsx';

const base = 'btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-pink/70 disabled:opacity-50 disabled:cursor-not-allowed';
const variants = {
  gradient: 'btn-gradient text-white',
  outline: 'btn-outline text-neutral-200',
  danger: 'btn-danger text-white',
  subtle: 'bg-neutral-800/60 hover:bg-neutral-700/60 shadow-inner border border-neutral-700'
};
export function Button({ variant='gradient', as:Comp='button', className, ...rest }){
  return <Comp className={clsx(base, variants[variant], className)} {...rest} />;
}

export default Button;
