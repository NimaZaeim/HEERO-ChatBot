// TypeScript React component for a typing indicator in a chat application

const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-1 py-1 px-2">
      <div className="w-2.5 h-2.5 bg-[color:var(--transparent-50)] rounded-full animate-pulse delay-0" />
      <div className="w-2.5 h-2.5 bg-[color:var(--transparent-50)] rounded-full animate-pulse delay-150" />
      <div className="w-2.5 h-2.5 bg-[color:var(--transparent-50)] rounded-full animate-pulse delay-300" />
    </div>
  );
};

export default TypingIndicator;
