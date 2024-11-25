export const useMaskedAuthor = (author) => {
  return author.slice(0, 1) + '**';
};
