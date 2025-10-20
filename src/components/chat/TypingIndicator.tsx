// TypeScript React component for a typing indicator in a chat application

const TypingIndicator = () => {
  return (
    <div className="flex items-center space-x-1 p-4">
      <div className="w-2 h-2 bg-[color:var(--transparent-50)] rounded-full animate-pulse delay-0"></div>
      <div className="w-2 h-2 bg-[color:var(--transparent-50)] rounded-full animate-pulse delay-150"></div>
      <div className="w-2 h-2 bg-[color:var(--transparent-50)] rounded-full animate-pulse delay-300"></div>
    </div>
  );
};

export default TypingIndicator;
