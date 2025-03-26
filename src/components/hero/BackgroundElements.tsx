
const BackgroundElements = () => {
  return (
    <div className="absolute inset-0 -z-10">
      <div className="absolute right-0 top-1/4 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl"></div>
      <div className="absolute left-0 bottom-1/4 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl"></div>
    </div>
  );
};

export default BackgroundElements;
