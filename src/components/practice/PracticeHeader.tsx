
interface PracticeHeaderProps {
  title: string;
  subtitle: string;
}

export const PracticeHeader = ({ title, subtitle }: PracticeHeaderProps) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
      <p className="text-gray-600">{subtitle}</p>
    </div>
  );
};
