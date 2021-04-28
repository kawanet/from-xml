/**
 * from-xml.d.ts
 *
 * @see https://www.npmjs.com/package/from-xml
 */

export function fromXML<T = any>(text: string, reviver?: (key: string, value: any) => any): T;
