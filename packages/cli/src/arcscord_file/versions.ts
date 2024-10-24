import type { ArcscordFileParser } from "./type";
import { fileV1 } from "./file_v1";

export const parsers: Record<number, ArcscordFileParser> = {
  1: fileV1,
};
