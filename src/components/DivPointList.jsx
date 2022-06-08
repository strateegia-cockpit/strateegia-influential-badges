import { useState, useEffect } from "react";
import { Select } from "@chakra-ui/react";
import * as api from "strateegia-api";
import { i18n } from "../translate/i18n";

export default function DivPointList({ mapId, handleSelectChange }) {
  const [DivPointList, setDivPointList] = useState(null);

  useEffect(() => {
    async function fetchMapList() {
      try {
        const accessToken = localStorage.getItem("accessToken");
        // let map = [];
        // if (typeof mapId === 'object') {
        //   Promise.all(
        //     mapId.map(async (id) => {
        //       const maps = await api.getMapById(accessToken, id)
        //       return maps;
        //     })
        //     .then(data => map.push(data))
        //   )
        // }
        const map = await api.getMapById(accessToken, mapId);
        console.log('maps', map);
        const divPoints = map.points.filter((point) => point.point_type === "DIVERGENCE");
        const allIds = divPoints.map(({id}) => id);
        const allOption = {id: allIds, title: i18n.t('selector.list')};

        divPoints.unshift(allOption);
        console.log(divPoints)
        setDivPointList(divPoints);
      } catch (error) {
        console.log(error);
      }
    }
    fetchMapList();
  }, [mapId]);

  return mapId ? (
    <Select
      placeholder={i18n.t('main.placeholderDiv')}
      onChange={handleSelectChange}
    >
      {DivPointList
        ? DivPointList.map((divPoint) => {
            return (
              <option key={divPoint.id} value={divPoint.id}>
                {divPoint.title}
              </option>
            );
          })
        : null}
    </Select>
  ) : (
    ""
  );
}
