export enum EnvRequestStatus {
  APPROVED = 'available',
  PENDING = 'pending',
  NOT_APPROVED = 'not_approved',
  CANCELLED = 'cancelled',
}

// export function validateStatus(status: string): boolean {
//   if (status) {
//     return Object.values(Status).includes(status as Status);
//   }
//   return true;
// }

// export function isComplianceStatus(receivedStatus: string, environmentStatus: string): string | undefined {
//   switch (receivedStatus) {
//     case Status.PENDING:
//       if (environmentStatus === Status.LOCKED || environmentStatus === Status.PENDING) {
//         return 'environment is not available to request';
//       }
//       break;

//     case Status.LOCKED:
//       if (environmentStatus !== Status.PENDING) {
//         return 'environment is not ready to approve';
//       }
//       break;

//     case Status.AVAILABLE:
//       if (environmentStatus !== Status.LOCKED && environmentStatus !== Status.PENDING) {
//         return 'environment is not ready to release';
//       }
//       break;
//   }

//   return undefined;
// }
