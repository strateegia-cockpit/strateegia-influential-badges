import { useState, useEffect } from 'react';
import { Select } from '@chakra-ui/react';
import * as api from 'strateegia-api';
import { i18n } from "../translate/i18n";

export default function MapList({ projectId, handleSelectChange }) {
  const [mapList, setMapList] = useState(null);

  useEffect(() => {
    setMapList(null)
    async function fetchMapList() {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const project = await api.getProjectById(accessToken, projectId);

        const maps = project.maps;
        const allIds = maps.map(({id}) => id);
        const allOption = {id: allIds, title: i18n.t('selector.list')};
        
        maps.length > 1 && maps.unshift(allOption);
        setMapList(maps);
      } catch (error) {
        console.log(error);
      }
    }
    fetchMapList();


  }, [projectId]);



  return projectId ? (
    <Select placeholder={i18n.t('main.placeholderMap')}  onChange={handleSelectChange}>
      {mapList
        ? mapList.map((mapItem, index) => {
            return (
              <option key={index} value={mapItem.id}>
                {mapItem.title}
              </option>
            );
          })
        : null}
    </Select>
  ) : (
    ''
  );
}
