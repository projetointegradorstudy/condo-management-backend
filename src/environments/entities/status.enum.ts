export enum Status {
  AVAILABLE = 'available',
  LOCKED = 'locked',
  PENDING = 'pending',
}

export function validateStatus(status: string): boolean {
  if (status) {
    return Object.values(Status).includes(status as Status);
  }
  return true;
}
