import type { TNull } from "~~/shares/types/primitives";

export interface CompanyState {
  icon: TNull<string>;
  logo: TNull<string>;
  name: TNull<string>;
  colors: TNull<{
    first: string;
    second: string;
  }>;
}
