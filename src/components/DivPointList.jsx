import { useState, useEffect } from "react";
import { Select } from "@chakra-ui/react";
import * as api from "strateegia-api";
import { i18n } from "../translate/i18n";

export default function DivPointList({ mapId, handleSelectChange, innerRef }) {
  const [divPointList, setDivPointList] = useState(null);

  useEffect(() => {
    async function fetchMapList() {
      try {
        const accessToken = localStorage.getItem("accessToken");
        
        if (mapId.length !== 24) {

          const allProjectMaps = await Promise.all(
            mapId.map(async (id) => {
              const allMapsInfo = await api.getMapById(accessToken, id)
              return allMapsInfo;
            })
          ).then(data => data.flat());  

          const divPoints = allProjectMaps.map(singleMap => getOnlyDivPoints(singleMap));
        
          const allDivPoints = setAllDivPointsOption(divPoints.flat())
          setDivPointList(allDivPoints);

        } else {
          const map = await api.getMapById(accessToken, mapId);
          const divPoints = getOnlyDivPoints(map);
          const allDivPoints = setAllDivPointsOption(divPoints)
          setDivPointList(allDivPoints);
        }

      } catch (error) {
        console.log(error);
      }
    }
    fetchMapList();
  }, [mapId]);

  function getOnlyDivPoints(map) {
    const divPoints = map.points.filter((point) => point.point_type === "DIVERGENCE");
    return divPoints;
  }

  function setAllDivPointsOption(divPoints) {
    const allIds = divPoints.map(({id}) => id);
    const allOption = {id: allIds, title: i18n.t('selector.list')};
    divPoints.length > 1 && divPoints.unshift(allOption);
    return divPoints;
  }


  return mapId && (
    <Select
      placeholder={i18n.t('main.placeholderDiv')}
      onChange={handleSelectChange}
      isDisabled={mapId.length === 24 ? false : true}
      value={mapId.length !== 24 ? divPointList?.[0].id : undefined}
      ref={innerRef}
    >
      {divPointList
        ? divPointList.map((divPoint) => {
            return (
              <option key={divPoint.id} value={divPoint.id}>
                {divPoint.title}
              </option>
            );
          })
        : null}
    </Select>
  );
}
