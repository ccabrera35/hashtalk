type HashtagItemProps = {
  className?: string;
  company: string;
  onClick: () => void;
};

export default function HashtagItem({
  className,
  company,
  onClick
}: HashtagItemProps) {
  return (
    <li className={className}>
      <button onClick={onClick}>#{company}</button>
    </li>
  );
}
