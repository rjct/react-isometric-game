import { BuildingDictEntity } from "@src/dict/building/building";
import fire_barrel from "@src/dict/building/road/fire_barrel";
import highway_fence from "@src/dict/building/road/highway_fence";
import highway_fence_broken from "@src/dict/building/road/highway_fence_broken";
import highway_fence_end from "@src/dict/building/road/highway_fence_end";
import newspaper_kiosk from "@src/dict/building/road/newspaper_kiosk";
import phonebox from "@src/dict/building/road/phonebox";
import street_light from "@src/dict/building/road/street_light";
import traffic_light from "@src/dict/building/road/traffic_light";
import trash_bin from "@src/dict/building/road/trash_bin";

export const road: { [id: string]: BuildingDictEntity } = {
  highway_fence,
  highway_fence_broken,
  highway_fence_end,
  street_light,
  traffic_light,
  phonebox,
  trash_bin,
  newspaper_kiosk,
  fire_barrel,
};

export default road;
