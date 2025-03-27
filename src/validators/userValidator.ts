// Valida e-mail com regex
export const validateEmail = (email: string): boolean => {
  const regex = /^[\w-.]+@[\w-]+\.[\w-.]+$/;
  return regex.test(email);
};

// Valida CPF (apenas formato básico, sem dígito verificador)
export const validateCPF = (cpf: string): boolean => {
  const cleaned = cpf.replace(/\D/g, "");
  return cleaned.length === 11;
};

// Valida senha com no mínimo 6 caracteres (pode ser mais complexo se quiser)
export const validatePasswordStrength = (password: string): boolean => {
  return password.length >= 6;
};
