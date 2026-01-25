export class BusinessError extends Error {
  status: number;

  constructor(message: string, status: number = 400) {
    super(message);
    this.name = 'BusinessError';
    this.status = status; // Se não passar nada, o padrão é 400
  }
}