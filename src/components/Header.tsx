interface HeaderProps {
  currentIndex: number;
  total: number;
}

export function Header({ currentIndex, total }: HeaderProps) {
  return (
    <div className="meta-bar">
      <span className="meta-bar-brand">EPHEMERAL_WISDOM</span>
      <span>
        id:{currentIndex} / {total}
      </span>
    </div>
  );
}
