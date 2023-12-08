import vault_bed from "@src/dict/building/furniture/vault_bed";
import vault_chair from "@src/dict/building/furniture/vault_chair";
import vault_computer_1 from "@src/dict/building/furniture/vault_computer_1";
import vault_computer_2 from "@src/dict/building/furniture/vault_computer_2";
import vault_table from "@src/dict/building/furniture/vault_table";
import { BuildingDictEntity } from "@src/dict/building/_building";

export const furniture: { [id: string]: BuildingDictEntity } = {
  vault_bed,
  vault_chair,
  vault_computer_1,
  vault_computer_2,
  vault_table,
};

export default furniture;
