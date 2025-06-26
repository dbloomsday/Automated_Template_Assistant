export interface DesignBrief {
  email: string;
  company: string;
  orientation: 'portrait' | 'landscape';
  slot: 'No' | 'Short' | 'Long';
  overlay: string;
  cardType: 'Regular PVC' | 'Eco' | string;
  nameFieldLabel: string;
  employeeFields: string[];
  barcodeFront?: string;
  additionalFront?: string[];
  backColor?: string;
  barcodeBack?: string;
  additionalBack?: string[];
  ifFound?: string;
  logoFile?: { name: string; url: string };
  designStyle?: string;
}
