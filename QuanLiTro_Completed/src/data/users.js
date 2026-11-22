export const mockUsers = Array.from({ length: 100 }, (_, i) => {
  const index = i + 1;
  const suffix = String(index).padStart(3, '0');
  const phone = `0987555${suffix}`;
  const password = `matkhau${index}`;
  return { phone, password };
});
