/**
 * Datos sensibles para aviso legal (LSSI): solo uso en build.
 * No exportar a cliente en texto plano; se inyectan codificados vía script.
 */
export const OWNER_NAME = 'José Miguel Vilata Martínez';
export const OWNER_NIF = '52649100F';

export function getEncodedLegal(): { owner: string; nif: string } {
  return {
    owner: Buffer.from(OWNER_NAME, 'utf8').toString('base64'),
    nif: Buffer.from(OWNER_NIF, 'utf8').toString('base64'),
  };
}
