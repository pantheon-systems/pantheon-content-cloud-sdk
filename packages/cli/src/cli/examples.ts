type ExampleItem = {
  description: string;
  command: string;
};

export const formatExamples = (items: ExampleItem[]): [string][] => {
  return items.map((record) => [
    `\n${record.description}\n$ ${record.command}`,
  ]);
};
