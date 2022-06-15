import { useState, useEffect } from "react";
import Select from 'react-select';
import * as api from "strateegia-api";
import { i18n } from "../translate/i18n";

export default function DivPointList({ mapId, handleSelectChange, innerRef }) {
  const [divPointList, setDivPointList] = useState(null);
  const [allSelected, setAllSelected] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    async function fetchMapList() {
      try {
        const accessToken = localStorage.getItem("accessToken");
    
        const allProjectMaps = await Promise.all(
          mapId.map(async ({value}) => {
            const allMapsInfo = await api.getMapById(accessToken, value)
            return allMapsInfo;
          })
        ).then(data => data.flat());  

        const divPoints = allProjectMaps.map(singleMap => getOnlyDivPoints(singleMap));
        const allDivPoints = setAllDivPointsOption(divPoints.flat())
        
        const divData = [];
        allDivPoints?.map(divItem => {
          const data = {
            label: divItem.title,
            value: divItem.id
          };
          divData.push(data);
        })
        setDivPointList(divData);
      } catch (error) {
        console.log(error);
      }
    }
    setAllSelected(false);
    setSelected(null);
    fetchMapList();
  }, [mapId]);

  function getOnlyDivPoints(map) {
    const divPoints = map.points.filter((point) => point.point_type === "DIVERGENCE");
    return divPoints;
  }

  function setAllDivPointsOption(divPoints) {
    const allOption = {id: 0, title: i18n.t('selector.list')};
    divPoints.unshift(allOption);
    return divPoints;
  }

  const changeSelectAll = () => {
    handleSelectChange(divPointList.slice(1))
    setAllSelected(true)
  };


  return mapId && (
    <Select
      placeholder={i18n.t('main.placeholderDiv')} 
      options={divPointList}
      isMulti 
      value={ allSelected ? divPointList.slice(1) : selected}
      onChange={ selected => {
        setSelected(selected)
        setAllSelected(false)
        selected.find(option => option.label === i18n.t('selector.list')) ? 
          changeSelectAll()
        : handleSelectChange(selected);
      }} 
      isSearchable 
    />
  );
}
