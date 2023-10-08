import ammo_9mm_AP from "@src/dict/ammo/9mm/9mm_AP";
import ammo_9mm_ball from "@src/dict/ammo/9mm/9mm_ball";
import ammo_9mm_JHP from "@src/dict/ammo/9mm/9mm_JHP";
import { AmmoDictEntity } from "@src/dict/ammo/ammo";

const ammo_9mm: { [id: string]: AmmoDictEntity } = {
  "9mm_ball": ammo_9mm_ball,
  "9mm_AP": ammo_9mm_AP,
  "9mm_JHP": ammo_9mm_JHP,
};

export default ammo_9mm;
